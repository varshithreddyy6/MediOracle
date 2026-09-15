# MediOracle

> ***The operating system for healthcare workforce. A full-stack platform that helps hospitals, clinics and care facilities orchestrate staffing — from the first open shift to the final payment.***

MediOracle is a complete, deploy-ready web application: a **NEUCONOMI-inspired marketing site** at the entry route, secure **multi-hospital authentication**, and a **workspace dashboard** from which staff run twelve operational modules (shifts, scheduling, candidate matching, compliance, timesheets, billing, payments and more).

Every account belongs to a hospital, every piece of data is isolated per hospital, and every number in the UI comes from a real API backed by a real database.

---

## Table of contents

1. [**What MediOracle does**](#1-what-medioracle-does)
2. [**Technologies used**](#2-technologies-used)
3. [**How to run the project**](#3-how-to-run-the-project)
4. [**What was worked on**](#4-what-was-worked-on)
5. [**Features**](#5-features)
6. [**Project folder structure**](#6-project-folder-structure)
7. [**API reference & usage examples**](#7-api-reference--usage-examples)
8. [**Configuration details**](#8-configuration-details)
9. [**Verification & testing**](#9-verification--testing)
10. [**Contributing**](#10-contributing)
11. [**License**](#11-license)

---

## 1. What MediOracle does

Healthcare facilities constantly juggle open shifts, agency costs, credential compliance and workforce payments across disconnected tools such as spreadsheets, phone calls and agency portals.

MediOracle consolidates that chaos into **one platform with three connected layers**:

| **Layer**                                         | **What it gives you**                                                                                                                                                                                                  |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Public landing site (`/`)**                     | A NEUCONOMI-styled marketing page that explains the product: hero, ecosystem diagram, who-we-are, solutions, numbers and footer. Sign-in / Get-started buttons lead into the app.                                      |
| **Accounts for hospitals (`/signup`, `/signin`)** | New users register **with their hospital name first**, then their personal details. Every hospital gets its own sealed workspace — multiple hospitals coexist on the same deployment with strict data isolation.       |
| **Operations workspace (`/dashboard`)**           | A hub with a hospital-branded top bar and **12 feature modules**: floor staffing, shifts, schedule, candidate matching, compliance, timesheets, billing, payments, integrations, professionals, analytics and support. |

### Core workflow

```text
Post an open shift
        ↓
See AI-ranked candidates
        ↓
A professional is placed
        ↓
The shift is worked
        ↓
The timesheet is approved
        ↓
An invoice is raised
        ↓
The professional is paid
```

Everything in that chain is backed by the FastAPI + SQLite backend — creating a shift in the UI performs a real **`POST /api/shifts`**, persists the row, and it is still there after a refresh.

---

## 2. Technologies used

### **Backend**

* [**FastAPI**](https://fastapi.tiangolo.com/) (Python) — REST API, request validation, OpenAPI docs
* [**SQLite**](https://www.sqlite.org/) — zero-config relational database
* [**Uvicorn**](https://www.uvicorn.org/) — ASGI server
* Auth: **PBKDF2-SHA256** password hashing (120k iterations, per-user salt) + server-side session tokens sent as **`Bearer`** tokens

### **Frontend**

* [**React 19**](https://react.dev/) + [**TypeScript**](https://www.typescriptlang.org/)
* [**Vite**](https://vite.dev/) — development server & production bundler
* [**React Router**](https://reactrouter.com/) — client-side routing with protected routes
* [**lucide-react**](https://lucide.dev/) — icon set
* [**Recharts**](https://recharts.org/) — charts
* **Hand-rolled CSS** (no Tailwind, no UI kit) — one design-token system shared by the landing page and the app

### **Design system**

* Ivory **`#fcf8f3`** surfaces
* Accent red **`#c60000`**
* Ink **`#0b0b0b`**
* **Montserrat** — logotype and body
* **Spinnaker** — display headings
* No sidebars anywhere — feature switching happens only through the dashboard hub

---

## 3. How to run the project

### **Prerequisites**

| **Tool** | **Version**      | **Check with**      |
| -------- | ---------------- | ------------------- |
| Python   | 3.11+            | `python3 --version` |
| Node.js  | 20.19+ or 22.12+ | `node --version`    |
| npm      | 10+              | `npm --version`     |

No external database or services are required — SQLite ships with Python.

### **Option A — One command (recommended)**

Clone the repository:

```bash
git clone https://github.com/varshithreddyy6/MediOracle.git
cd MediOracle
./dev.sh
```

Then open:

```text
http://localhost:5175
```

`dev.sh` does three things:

1. Installs the Python dependencies from `requirements.txt`.
2. Builds the frontend **if `frontend/dist/` does not exist yet**.
3. Starts **one process** that serves the entire product — the built frontend and API — on the same origin.

The API is available under:

```text
/api/*
```

### **Option B — Development mode with hot reload**

#### Terminal 1 — Backend API on :8000

```bash
cd backend
pip install -r requirements.txt
./run.sh
```

Or:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### Terminal 2 — Vite development server on :5173

```bash
cd frontend
npm install
npm run dev
```

In development mode, Vite serves the frontend with hot module replacement and forwards every **`/api`** request to the backend.

### **Option C — Production build**

```bash
cd frontend
npm install
npm run build

cd ../backend
uvicorn app.main:app --host 0.0.0.0 --port 5175
```

The FastAPI app automatically detects **`frontend/dist/`** and serves the production frontend.

It also provides SPA fallback support so deep links such as:

```text
/dashboard
/shifts
/candidates
/analytics
```

continue to work after a refresh.

### **Rebuilding after frontend changes**

```bash
cd frontend
npm run build
```

Then restart the server.

---

## **Demo accounts**

Two hospitals are pre-seeded so multi-hospital isolation can be demonstrated immediately.

| **Hospital**           | **Email**                | **Password**   |
| ---------------------- | ------------------------ | -------------- |
| AVT Hospitals          | `anna@avthospitals.demo` | `Demo@2026`    |
| Sunrise Multispecialty | `ravi@sunrise.demo`      | `Sunrise@2026` |

You can also click **Get started** and register a brand-new hospital.

A newly registered hospital starts with its own seeded dataset containing ward roster, shifts, candidates, timesheets and invoices personalized with the hospital name.

---

## 4. What was worked on

The project was developed as a full vertical slice — design system, public site, real backend, and a data-driven workspace.

### **1. UI analysis & design system**

Reverse-engineered the target visual language inspired by NEUCONOMI:

* Ivory / red / black palette
* Montserrat + Spinnaker typography
* Overline logotype mark
* Ecosystem diagram
* Section patterns
* Shared CSS custom properties

The same design tokens drive the landing page and application screens.

### **2. NEUCONOMI-style landing page**

The landing page includes:

* Hero: **"Healthcare Staffing / Orchestrated."**
* Staffing ecosystem diagram
* Professionals ↔ MediOracle ↔ Facilities
* Agencies and Insurers
* Who-we-are section
* What-we-do section
* Platform numbers
* Solutions grid
* CTA footer

### **3. Backend from scratch**

The backend includes:

* FastAPI application
* SQLite database
* 12 database tables
* PBKDF2 password hashing
* Server-side session tokens
* Hospital-scoped queries
* Per-hospital demo data seeding
* Computed workforce analytics
* REST API endpoints
* OpenAPI documentation

### **4. Authentication & multi-hospital model**

MediOracle uses a hospital-first account architecture:

1. Register the hospital.
2. Register the user.
3. Create a hospital-specific workspace.
4. Seed hospital-specific demo data.
5. Authenticate through server-side sessions.

A dedicated **`hospitals`** table establishes ownership of records.

Every data endpoint filters by the signed-in user's **`hospital_id`**, ensuring that hospitals cannot access each other's shifts, professionals, invoices or other operational data.

### **5. Workspace dashboard + 12 modules**

The dashboard acts as the central hub.

KPI tiles are powered by:

```text
/api/analytics/workforce
```

Feature modules include:

* Floor staffing
* Shifts
* Schedule
* Candidates
* Compliance
* Timesheets
* Billing
* Payments
* Integrations
* Professionals
* Analytics
* Support

### **6. Single-origin serving**

The backend serves the compiled frontend so the complete product can run from a single port.

This simplifies deployment and eliminates the need to configure separate frontend and backend origins in production.

### **7. End-to-end verification**

The complete application flow was verified using scripted browser tests with Playwright:

```text
Landing
   ↓
Sign up
   ↓
Dashboard
   ↓
Create shift
   ↓
Database persistence
   ↓
Hospital-scoped invoices
   ↓
Refresh
   ↓
Session persists
   ↓
Sign out
   ↓
Landing
   ↓
Register second hospital
   ↓
Verify isolated dataset
```

---

## 5. Features

### **Public site**

* **NEUCONOMI-inspired landing page** at **`/`**
* Red logotype
* Caps navigation
* Hero section
* Staffing ecosystem diagram
* Capability sections
* Platform numbers
* Solutions grid
* CTA footer
* Sign in / Get started buttons

### **Accounts & hospitals**

* **Hospital-first sign-up**
* Secure authentication
* **PBKDF2-SHA256** password hashing
* Opaque session tokens
* **`Authorization: Bearer`** authentication
* Server-side logout
* True multi-hospital data isolation

### **Operations workspace**

| **Module**     | **Route**             | **What it does**                                 |
| -------------- | --------------------- | ------------------------------------------------ |
| Overview       | **`/dashboard`**      | Coverage KPIs, open-shift alerts and quick stats |
| Floor staffing | **`/floor-staffing`** | Ward-by-ward filled / required coverage          |
| Shifts         | **`/shifts`**         | Live open-shift board and shift creation         |
| Schedule       | **`/schedule`**       | Weekly schedule for wards                        |
| Candidates     | **`/candidates`**     | AI-style ranked professionals                    |
| Compliance     | **`/compliance`**     | Credential status and expiry watch               |
| Timesheets     | **`/timesheets`**     | Worked hours and approval states                 |
| Billing        | **`/billing`**        | Invoices and receivables                         |
| Payments       | **`/payments`**       | Professional payouts                             |
| Integrations   | **`/integrations`**   | HR, payroll, credential and billing connectors   |
| Professionals  | **`/professional`**   | Talent directory                                 |
| Analytics      | **`/analytics`**      | Workforce performance metrics                    |

### **Platform behaviours**

* **Protected routes** — unauthenticated visitors are redirected to sign-in.
* **Session persistence** — the token is stored in **`localStorage`** under **`mo_token`**.
* **SPA deep links** — routes such as **`/dashboard`** and **`/shifts`** remain directly accessible after refresh.
* **Consistent identity** — one palette, one type system and one logo treatment across the landing page and application.
* **Real API-backed data** — application numbers and operational data are generated from database records rather than hard-coded UI values.

---

## 6. Project folder structure

```text
MediOracle/
├── README.md
├── dev.sh
├── .gitignore
│
├── backend/
│   ├── requirements.txt
│   ├── run.sh
│   ├── medioracle.db
│   └── app/
│       ├── main.py
│       ├── db.py
│       ├── seed.py
│       └── __init__.py
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── dist/
    └── src/
        ├── main.tsx
        ├── styles.css
        ├── components/
        │   └── ui.tsx
        ├── lib/
        │   ├── api.ts
        │   ├── auth.tsx
        │   └── data.ts
        └── pages/
            ├── Landing.tsx
            ├── SignIn.tsx
            ├── SignUp.tsx
            ├── Dashboard.tsx
            └── features/
                ├── ops.tsx
                ├── clinical.tsx
                └── finance.tsx
```

### **Key ideas behind the layout**

* `main.py` contains authentication, hospital scoping, endpoints and static serving.
* `db.py` contains the SQLite connection helper and database schema.
* `seed.py` provides per-hospital demo data.
* Feature pages live under **`pages/features/`**.
* **`lib/api.ts`** provides the shared API wrapper.
* **`lib/auth.tsx`** manages authentication state.
* **`lib/data.ts`** contains feature registry and module data.
* **`styles.css`** is the single source of truth for the visual system.

Adding a new module is designed to require a route entry and a dashboard tile without changing the overall architecture.

---

## 7. API reference & usage examples

### **Base URL**

Single-origin mode:

```text
http://localhost:5175/api
```

Authenticated calls require:

```http
Authorization: Bearer <token>
```

### **API endpoints**

| **Method** | **Endpoint**                   | **Auth** | **Purpose**                                |
| ---------- | ------------------------------ | -------- | ------------------------------------------ |
| **POST**   | **`/api/auth/signup`**         | —        | Create hospital + owner and seed demo data |
| **POST**   | **`/api/auth/login`**          | —        | Email + password → token                   |
| **POST**   | **`/api/auth/logout`**         | ✓        | Invalidate session                         |
| **GET**    | **`/api/auth/me`**             | ✓        | Current user + hospital                    |
| **GET**    | **`/api/analytics/workforce`** | ✓        | Fill rate, coverage and open gaps          |
| **GET**    | **`/api/shifts`**              | ✓        | Hospital shift board                       |
| **POST**   | **`/api/shifts`**              | ✓        | Create and persist a shift                 |
| **GET**    | **`/api/wards`**               | ✓        | Ward coverage                              |
| **GET**    | **`/api/candidates`**          | ✓        | Ranked candidate pool                      |
| **GET**    | **`/api/timesheets`**          | ✓        | Timesheets with approval states            |
| **GET**    | **`/api/invoices`**            | ✓        | Hospital-scoped invoices                   |
| **GET**    | **`/api/payments`**            | ✓        | Professional payouts                       |
| **GET**    | **`/api/professionals`**       | ✓        | Talent directory                           |
| **GET**    | **`/api/compliance`**          | ✓        | Credential / expiry status                 |
| **GET**    | **`/api/integrations`**        | ✓        | Connector states                           |
| **GET**    | **`/api/schedule`**            | ✓        | Weekly schedule                            |
| **GET**    | **`/api/health`**              | —        | Liveness probe                             |

### **Try it with curl**

#### **1. Sign up a new hospital**

```bash
curl -s -X POST http://localhost:5175/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"hospitalName":"Lakeside Medical Center","name":"Ravi Kumar",
       "email":"ravi@lakeside.demo","password":"Lakeside@2026"}'
```

#### **2. Log in and keep the token**

```bash
TOKEN=$(curl -s -X POST http://localhost:5175/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"anna@avthospitals.demo","password":"Demo@2026"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['token'])")
```

#### **3. Read hospital-scoped shifts**

```bash
curl -s http://localhost:5175/api/shifts \
  -H "Authorization: Bearer $TOKEN"
```

#### **4. Create a shift**

```bash
curl -s -X POST http://localhost:5175/api/shifts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"Registered Nurse","ward":"ICU · Ward 3","when_text":"Fri, 19:00–07:00"}'
```

### **Error contract**

* **401** — missing or invalid token
* **409** — duplicate signup email
* **404** — unknown API path

API responses are wrapped as:

```json
{
  "data": "..."
}
```

The frontend API helper automatically unwraps the `data` property.

### **Interactive API documentation**

FastAPI's interactive OpenAPI documentation is available at:

```text
http://localhost:5175/docs
```

## 8. Configuration details

### **Ports**

| **Mode**                | **Frontend** | **API**                |
| ----------------------- | ------------ | ---------------------- |
| `dev.sh` single process | **`:5175`**  | **`:5175`** (`/api/*`) |
| Development mode        | **`:5173`**  | **`:8000`**            |

### **Environment & data**

* No environment variables are required.
* The SQLite database is created automatically.
* Demo data is seeded automatically on first run.
* The database file is named **`medioracle.db`**.
* Session tokens are stored in the **`sessions`** table.
* The browser stores the session token in **`localStorage`** under **`mo_token`**.

### **Resetting the database**

To reset the local database to a fresh state, stop the server and delete:

```text
backend/medioracle.db
```

The database will be recreated automatically on the next run.

### **Rebranding**

The main design tokens are defined in:

```text
frontend/src/styles.css
```

The core values include:

```css
:root {
  --surface: #fcf8f3;
  --ink: #0b0b0b;
  --accent: #c60000;

  --neo-red: #c60000;
  --neo-red-dark: #a30000;
}
```

Changing **`--accent`** and **`--neo-red`** updates the primary product branding across the application.

The MediOracle logotype uses the `neoLogo` markup.

### **Vite configuration**

The Vite configuration maintains the development proxy:

```text
/api → http://localhost:8000
```

The configuration also supports network and preview hosting.

## 9. Verification & testing

The full journey has been verified using scripted browser tests with the real backend.

### **Current verification**

**7/7 checks passing** in the single-process production mode.

Verified scenarios include:

1. `/` renders the styled NEUCONOMI-inspired landing page.
2. Landing page → **Sign in** → dashboard.
3. Dashboard displays the correct hospital identity.
4. Creating a shift adds a new row and persists it in the database.
5. Refreshing `/dashboard` preserves the session and re-renders data.
6. **Sign out** returns the user to the landing page.
7. Registering a second hospital creates an isolated workspace.

### **API-level verification**

The API was also checked for:

* **401** without authentication
* **409** for duplicate email
* Hospital-scoped invoices
* Hospital-scoped operational data
* Health endpoint
* Shift creation
* Authentication flow
* Session invalidation

Backend smoke checks cover the API endpoints described in the API reference.

## 10. Contributing

Contributions are welcome.

The codebase is intentionally small and readable.

### **1. Fork & branch**

```bash
git checkout -b feature/your-feature
```

### **2. Set up**

Follow the setup instructions above.

For development, Option B provides hot reload.

### **3. Keep the conventions**

* Use **TypeScript strict mode**.
* Keep React components functional.
* Route API data through **`lib/api.ts`** and **`useApi()`**.
* Avoid ad-hoc `fetch` calls directly inside pages.
* Do not introduce CSS frameworks.
* Extend **`styles.css`** using the existing token system.
* Do not add sidebars.
* New features should be represented through the dashboard hub.
* Every new data endpoint must filter by the authenticated user's **`hospital_id`**.
* Multi-hospital isolation is **non-negotiable**.

### **4. Verify before opening a PR**

Run:

```bash
cd frontend
npm run build
```

Then exercise the feature in the browser end-to-end.

### **5. Commit conventions**

Use short imperative commit subjects:

```text
Add X
Fix Y
Update Z
```

### **Good first issues**

Potential improvements include:

* Form validation polish
* Pagination on the shift board
* Export-to-CSV on billing
* Dark-mode exploration
* Additional analytics
* More advanced candidate matching
* Expanded integration connectors

## 11. License

Copyright © 2026 MediOracle. All rights reserved.

If you plan to fork or reuse the project, add your preferred license file, such as:

```text
LICENSE
```

Possible choices include:

* MIT
* Apache-2.0

Update this section accordingly if a license is added.

---

## Developer

**Varshith Reddy**
Developer

📧 **Email:** [varshithreddyy6@gmail.com](mailto:varshithreddyy6@gmail.com)
💻 **GitHub:** [varshithreddyy6](https://github.com/varshithreddyy6)
🚀 **Project:** [MediOracle](https://github.com/varshithreddyy6/MediOracle)

---

<div align="center">

**MediOracle** — Healthcare Staffing, Orchestrated. ⚕️

Developed by **Varshith Reddy**

</div>
