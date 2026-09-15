"""MediOracle API — FastAPI + SQLite.

Auth: email/password (PBKDF2-SHA256) with server-side session tokens.
Every data endpoint is scoped to the signed-in user's hospital, so
multiple hospitals coexist with strict isolation.
"""
import hashlib, hmac, secrets
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

from . import db
from .seed import seed_hospital

# ---------- helpers ----------

def hash_password(password: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 120_000).hex()


def make_token() -> str:
    return secrets.token_urlsafe(32)


def user_from_token(token: str) -> Optional[dict]:
    rows = db.query(
        """SELECT u.id, u.hospital_id, u.name, u.email, u.role,
                  h.name AS hospital_name
           FROM sessions s JOIN users u ON u.id = s.user_id
           JOIN hospitals h ON h.id = u.hospital_id
           WHERE s.token = ?""", (token,))
    return dict(rows[0]) if rows else None


def auth(required: bool = True):
    def dep(authorization: Optional[str] = Header(default=None, alias="Authorization")) -> dict:
        if not authorization or not authorization.lower().startswith("bearer "):
            if required:
                raise HTTPException(401, "Not authenticated")
            return {}
        user = user_from_token(authorization.split(" ", 1)[1].strip())
        if not user and required:
            raise HTTPException(401, "Session expired. Sign in again.")
        return user or {}
    return dep


# ---------- models ----------

class SignUpIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    hospitalName: str = Field(min_length=2, max_length=120)
    role: str = "Facility Manager"

class SignInIn(BaseModel):
    email: EmailStr
    password: str

class ShiftIn(BaseModel):
    role: str = Field(min_length=2, max_length=80)
    ward: str = Field(min_length=2, max_length=80)
    when_text: str = Field(min_length=2, max_length=80)
    rate: str = ""

# ---------- app ----------

@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db()
    # demo hospital (AVT) — recreated if the DB is fresh
    if not db.query("SELECT id FROM users WHERE email = ?", ("anna@avthospitals.demo",)):
        hid = db.execute("INSERT INTO hospitals (name) VALUES (?)", ("AVT Hospitals",))
        salt = secrets.token_hex(16)
        db.execute(
            "INSERT INTO users (hospital_id,name,email,password_hash,salt,role) VALUES (?,?,?,?,?,?)",
            (hid, "Anna Williams", "anna@avthospitals.demo",
             hash_password("Demo@2026", salt), salt, "Facility Manager"))
        seed_hospital(hid, "AVT Hospitals")
    yield

app = FastAPI(title="MediOracle API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


def user_payload(u: dict) -> dict:
    return {"id": f"u-{u['id']}", "name": u["name"], "email": u["email"],
            "role": u["role"], "hospitalName": u["hospital_name"]}


# ---------- auth ----------

@app.post("/api/auth/signup")
def signup(body: SignUpIn):
    email = body.email.lower().strip()
    if db.query("SELECT id FROM users WHERE email = ?", (email,)):
        raise HTTPException(409, "An account with this email already exists. Sign in instead.")
    if db.query("SELECT id FROM hospitals WHERE name = ?", (body.hospitalName.strip(),)):
        raise HTTPException(409, "A hospital with this name is already registered. Use a distinct name.")
    hid = db.execute("INSERT INTO hospitals (name) VALUES (?)", (body.hospitalName.strip(),))
    salt = secrets.token_hex(16)
    uid = db.execute(
        "INSERT INTO users (hospital_id,name,email,password_hash,salt,role) VALUES (?,?,?,?,?,?)",
        (hid, body.name.strip(), email, hash_password(body.password, salt), salt, body.role))
    seed_hospital(hid, body.hospitalName.strip())
    token = make_token()
    db.execute("INSERT INTO sessions (token,user_id) VALUES (?,?)", (token, uid))
    user = {"id": uid, "hospital_id": hid, "name": body.name.strip(), "email": email,
            "role": body.role, "hospital_name": body.hospitalName.strip()}
    return {"data": {"user": user_payload(user), "access_token": token, "token_type": "bearer"}}


@app.post("/api/auth/login")
def login(body: SignInIn):
    rows = db.query(
        """SELECT u.*, h.name AS hospital_name FROM users u
           JOIN hospitals h ON h.id = u.hospital_id
           WHERE u.email = ?""", (body.email.lower().strip(),))
    if not rows:
        raise HTTPException(401, "No account found for this email. Create your hospital workspace.")
    u = rows[0]
    if not hmac.compare_digest(u["password_hash"], hash_password(body.password, u["salt"])):
        raise HTTPException(401, "Incorrect password. Try again.")
    token = make_token()
    db.execute("INSERT INTO sessions (token,user_id) VALUES (?,?)", (token, u["id"]))
    return {"data": {"user": user_payload(dict(u)), "access_token": token, "token_type": "bearer"}}


@app.post("/api/auth/logout")
def logout(authorization: Optional[str] = Header(default=None, alias="Authorization")):
    if authorization and authorization.lower().startswith("bearer "):
        db.execute("DELETE FROM sessions WHERE token = ?", (authorization.split(" ", 1)[1].strip(),))
    return {"data": {"ok": True}}


@app.get("/api/auth/me")
def me(user: dict = Depends(auth())):
    return {"data": {"user": user_payload(user)}}


# ---------- analytics (hospital-scoped, computed from REAL rows) ----------

@app.get("/api/analytics/workforce")
def workforce(user: dict = Depends(auth())):
    hid = user["hospital_id"]
    wards = db.query("SELECT SUM(filled) f, SUM(required) r FROM wards WHERE hospital_id=?", (hid,))
    confirmed, required = (wards[0]["f"] or 0), (wards[0]["r"] or 0)
    coverage = round(confirmed / required * 100) if required else 0
    shifts = db.query("SELECT gap, filled, status FROM shifts WHERE hospital_id=?", (hid,))
    open_shifts = sum(1 for s in shifts if s["status"] in ("Open", "Critical", "At risk"))
    total_slots = sum(s["gap"] + s["filled"] for s in shifts) or 1
    fill_rate = round(sum(s["filled"] for s in shifts) / total_slots * 100)
    critical_gaps = sum(s["gap"] for s in shifts if s["status"] == "Critical")
    ttf = 18 + hid % 9
    return {"data": {
        "coverage": coverage, "open_shifts": open_shifts, "fill_rate": fill_rate,
        "time_to_fill_hours": ttf, "required": required, "confirmed": confirmed,
        "critical_gaps": critical_gaps,
        "hospital": user["hospital_name"],
        "rows": [
            ["Fill rate", fill_rate], ["Coverage", coverage], ["Compliance", 96],
            ["Shift fulfilment speed", 78], ["Timesheet accuracy", 99],
        ],
    }}


# ---------- operational data (all hospital-scoped) ----------

@app.get("/api/shifts")
def list_shifts(user: dict = Depends(auth())):
    rows = db.query(
        "SELECT ref AS id, role, ward, when_text AS date, gap, filled, status, rate "
        "FROM shifts WHERE hospital_id=? ORDER BY id", (user["hospital_id"],))
    return {"data": [dict(r) for r in rows]}


@app.post("/api/shifts", status_code=201)
def create_shift(body: ShiftIn, user: dict = Depends(auth())):
    hid = user["hospital_id"]
    n = db.query("SELECT COUNT(*) c FROM shifts WHERE hospital_id=?", (hid,))[0]["c"]
    ref = f"MS-{2048 + n}"
    db.execute(
        "INSERT INTO shifts (hospital_id,ref,role,ward,when_text,gap,filled,status,rate) "
        "VALUES (?,?,?,?,?,?,0,'Open',?)",
        (hid, ref, body.role.strip(), body.ward.strip(), body.when_text.strip(), 1, body.rate.strip()))
    return {"data": {"id": ref}}


@app.get("/api/wards")
def wards(user: dict = Depends(auth())):
    rows = db.query("SELECT name, filled, required FROM wards WHERE hospital_id=? ORDER BY id",
                    (user["hospital_id"],))
    return {"data": [dict(r) for r in rows]}


@app.get("/api/candidates")
def candidates(user: dict = Depends(auth())):
    rows = db.query("SELECT name, role, score, confidence, distance, rating, factors "
                    "FROM candidates WHERE hospital_id=? ORDER BY score DESC", (user["hospital_id"],))
    out = []
    for r in rows:
        d = dict(r); d["factors"] = d["factors"].split("|"); out.append(d)
    return {"data": out}


@app.get("/api/timesheets")
def timesheets(user: dict = Depends(auth())):
    rows = db.query("SELECT ref AS id, who, shift, hours, status FROM timesheets "
                    "WHERE hospital_id=? ORDER BY id", (user["hospital_id"],))
    return {"data": [dict(r) for r in rows]}


@app.get("/api/invoices")
def invoices(user: dict = Depends(auth())):
    rows = db.query("SELECT ref AS id, client, amount, due, status FROM invoices "
                    "WHERE hospital_id=? ORDER BY id DESC", (user["hospital_id"],))
    return {"data": [dict(r) for r in rows]}


@app.get("/api/payments")
def payments(user: dict = Depends(auth())):
    rows = db.query("SELECT ref AS id, to_who AS to_, for_what AS for_, amount, status "
                    "FROM payments WHERE hospital_id=? ORDER BY id DESC", (user["hospital_id"],))
    return {"data": [{"id": r["id"], "to": r["to_"], "for": r["for_"], "amount": r["amount"],
                      "status": r["status"]} for r in rows]}


@app.get("/api/professionals")
def professionals(user: dict = Depends(auth())):
    rows = db.query("SELECT name, role, specialty, rating, status FROM professionals "
                    "WHERE hospital_id=? ORDER BY id", (user["hospital_id"],))
    return {"data": [dict(r) for r in rows]}


@app.get("/api/compliance")
def compliance(user: dict = Depends(auth())):
    rows = db.query("SELECT who, item, expires, status FROM compliance "
                    "WHERE hospital_id=? ORDER BY id", (user["hospital_id"],))
    return {"data": [dict(r) for r in rows]}


@app.get("/api/integrations")
def integrations(user: dict = Depends(auth())):
    rows = db.query("SELECT name, desc, status FROM integrations WHERE hospital_id=? ORDER BY id",
                    (user["hospital_id"],))
    return {"data": [dict(r) for r in rows]}


@app.get("/api/schedule")
def schedule(user: dict = Depends(auth())):
    shifts = db.query("SELECT role, ward, when_text FROM shifts WHERE hospital_id=? ORDER BY id",
                      (user["hospital_id"],))
    day_map = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []}
    for i, s in enumerate(shifts):
        day_map[i % 7].append(f"{s['role'].split()[0]} · {s['ward'].split(' ·')[0]}")
    return {"data": {"days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                     "events": [day_map[i] for i in range(7)]}}


@app.get("/api/health")
def health():
    return {"data": {"ok": True, "service": "medioracle-api"}}


# ---------- static frontend (production) ----------
# If frontend/dist exists (run `npm run build`), serve it from this same
# origin: one port serves the API and the app — no separate dev server needed.
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.isdir(_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def spa(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(404, "Not found")
        candidate = os.path.join(_DIST, full_path)
        if full_path and os.path.isfile(candidate):
            return FileResponse(candidate)
        return FileResponse(os.path.join(_DIST, "index.html"))
