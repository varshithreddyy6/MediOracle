# MediOracle

> ***The operating system for healthcare workforce. A full-stack platform that helps hospitals, clinics and care facilities orchestrate staffing — from the first open shift to the final payment.***

MediOracle is a complete, deploy-ready healthcare workforce management platform that combines **secure multi-hospital authentication**, **workforce operations**, **candidate matching**, **compliance management**, **timesheets**, **billing**, **payments**, **analytics**, and more in one unified workspace.

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
11. [**Developer**](#11-developer)
12. [**License**](#12-license)

---

## 1. What MediOracle does

Healthcare facilities constantly juggle open shifts, agency costs, credential compliance and workforce payments across disconnected tools such as spreadsheets, phone calls and agency portals.

MediOracle consolidates that workflow into **one platform with three connected layers**:

| **Layer**                                    | **What it gives you**                                                                                                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Public site (`/`)**                        | A professional healthcare workforce landing page explaining the platform, its capabilities, workflow, solutions and value proposition.                                         |
| **Hospital accounts (`/signup`, `/signin`)** | Hospital-first registration, secure authentication and isolated workspaces for each hospital.                                                                                  |
| **Operations workspace (`/dashboard`)**      | A centralized workspace containing modules for staffing, shifts, scheduling, candidates, compliance, timesheets, billing, payments, integrations, professionals and analytics. |

### Core workflow

```text
Post an open shift
        ↓
See ranked candidates
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

Everything in that workflow is backed by the FastAPI + SQLite backend.

Creating a shift in the UI performs a real **`POST /api/shifts`** request, persists the row in the database, and the data remains available after refreshing the application.

---

## 2. Technologies used

### **Backend**

* [**FastAPI**](https://fastapi.tiangolo.com/) (Python) — REST API, request validation and OpenAPI documentation
* [**SQLite**](https://www.sqlite.org/) — zero-configuration relational database
* [**Uvicorn**](https://www.uvicorn.org/) — ASGI server
* **PBKDF2-SHA256** — password hashing with 120,000 iterations and per-user salt
* **Bearer authentication** — server-side session tokens

### **Frontend**

* [**React 19**](https://react.dev/) — frontend framework
* [**TypeScript**](https://www.typescriptlang.org/) — type-safe development
* [**Vite**](https://vite.dev/) — development server and production bundler
* [**React Router**](https://reactrouter.com/) — client-side routing and protected routes
* [**lucide-react**](https://lucide.dev/) — icon library
* [**Recharts**](https://recharts.org/) — charts and data visualization
* **Hand-rolled CSS** — custom design system without Tailwind or a UI kit

### **MediOracle design system**

* Ivory **`#fcf8f3`** surfaces
* Accent red **`#c60000`**
* Ink **`#0b0b0b`**
* **Montserrat** for logotype and body text
* **Spinnaker** for display headings
* Consistent typography, spacing and visual tokens throughout the application
* No sidebars — feature navigation is handled through the dashboard hub

---

## 3. How to run the project

### **Prerequisites**

| **Tool** | **Version**      | **Check with**      |
| -------- | ---------------- | ------------------- |
| Python   | 3.11+            | `python3 --version` |
| Node.js  | 20.19+ or 22.12+ | `node --version`    |
| npm      | 10+              | `npm --version`     |

No external database or services are required. SQLite ships with Python.

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

`dev.sh` performs three operations:

1. Installs the Python dependencies from `requirements.txt`.
2. Builds the frontend if **`frontend/dist/`** does not exist.
3. Starts one process serving the frontend and API on the same origin.

The API is available under:

```text
/api/*
```

### **Option B — Development mode with hot reload**

#### Terminal 1 — Backend API

```bash
cd backend
pip install -r requirements.txt
./run.sh
```

Or:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite development server runs on:

```text
http://localhost:5173
```

Vite proxies `/api` requests to the backend on port `8000`.

### **Option C — Production build**

```bash
cd frontend
npm install
npm run build

cd ../backend
uvicorn app.main:app --host 0.0.0.0 --port 5175
```

The FastAPI application automatically detects **`frontend/dist/`** and serves the compiled frontend.

SPA fallback support allows routes such as:

```text
/dashboard
/shifts
/candidates
/analytics
```

to continue working after a page refresh.

### **Rebuilding after frontend changes**

```bash
cd frontend
npm run build
```

Then restart the server.

---

## **Demo accounts**

Two hospitals are pre-seeded for demonstrating multi-hospital isolation.

| **Hospital**           | **Email**                | **Password**   |
| ---------------------- | ------------------------ | -------------- |
| AVT Hospitals          | `anna@avthospitals.demo` | `Demo@2026`    |
| Sunrise Multispecialty | `ravi@sunrise.demo`      | `Sunrise@2026` |

You can also select **Get started** and register a completely new hospital.

A newly registered hospital receives its own seeded dataset containing ward information, shifts, candidates, timesheets and invoices personalized with the hospital name.

---

## 4. What was worked on

The project was developed as a complete vertical slice covering the public website, design system, authentication, backend, database and operational workspace.

### **1. UI & design system**

A complete healthcare-focused visual system was implemented using:

* Ivory, red and black color palette
* Montserrat + Spinnaker typography
* Consistent spacing and layout tokens
* Custom CSS
* Consistent branding across the landing page, authentication screens and dashboard
* Responsive application structure

### **2. Public landing page**

The landing page includes:

* Hero section
* Healthcare workforce messaging
* Staffing ecosystem diagram
* Professionals, facilities, agencies and insurers
* Who-we-are section
* What-we-do section
* Platform metrics
* Solutions grid
* Call-to-action section
* Footer

### **3. Backend from scratch**

The backend includes:

* FastAPI application
* SQLite database
* 12 database tables
* Password hashing
* Server-side sessions
* Hospital-scoped queries
* Per-hospital demo data
* Workforce analytics
* REST API endpoints
* OpenAPI documentation

### **4. Authentication & multi-hospital architecture**

MediOracle uses a hospital-first account architecture.

The flow is:

```text
Register hospital
       ↓
Register user
       ↓
Create hospital workspace
       ↓
Seed hospital data
       ↓
Authenticate user
       ↓
Access isolated workspace
```

A dedicated **`hospitals`** table establishes ownership of records.

Every data endpoint filters by the authenticated user's **`hospital_id`** so hospitals cannot access each other's operational data.

### **5. Workspace dashboard**

The dashboard acts as the central hub for the platform.

Workforce KPIs are powered by:

```text
/api/analytics/workforce
```

The dashboard provides access to the platform's operational modules without relying on a sidebar-based navigation structure.

### **6. Real database-backed operations**

Operational actions are connected to the backend.

For example, creating a shift from the UI performs:

```text
POST /api/shifts
```

The shift is persisted in SQLite and remains available after refreshing the application.

### **7. Single-origin serving**

The backend can serve the compiled frontend and API from the same port.

This provides a simple deployment architecture with:

```text
Frontend
   +
Backend API
   +
Database
   ↓
Single application origin
```

### **8. End-to-end verification**

The application was tested through the complete workflow:

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
Hospital-scoped data
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
Verify isolated data
```

---

## 5. Features

### **Public site**

* **Professional healthcare workforce landing page** at **`/`**
* Red MediOracle logotype
* Navigation
* Hero section
* Staffing ecosystem diagram
* Capability sections
* Platform metrics
* Solutions grid
* CTA section
* Footer
* Sign in / Get started buttons

### **Accounts & hospitals**

* **Hospital-first sign-up**
* Hospital registration
* User registration
* Secure authentication
* **PBKDF2-SHA256** password hashing
* Opaque session tokens
* **`Authorization: Bearer`** authentication
* Server-side logout
* Session persistence
* Multi-hospital data isolation

### **Operations workspace**

| **Module**     | **Route**             | **What it does**                                      |
| -------------- | --------------------- | ----------------------------------------------------- |
| Overview       | **`/dashboard`**      | Coverage KPIs, open-shift alerts and quick statistics |
| Floor staffing | **`/floor-staffing`** | Ward-by-ward filled / required coverage               |
| Shifts         | **`/shifts`**         | Open-shift board and shift creation                   |
| Schedule       | **`/schedule`**       | Weekly schedule for wards                             |
| Candidates     | **`/candidates`**     | Ranked professionals with matching information        |
| Compliance     | **`/compliance`**     | Credential status and expiry tracking                 |
| Timesheets     | **`/timesheets`**     | Worked hours and approval states                      |
| Billing        | **`/billing`**        | Invoices and receivables                              |
| Payments       | **`/payments`**       | Professional payouts                                  |
| Integrations   | **`/integrations`**   | HR, payroll, credential and billing connectors        |
| Professionals  | **`/professional`**   | Talent directory                                      |
| Analytics      | **`/analytics`**      | Workforce performance metrics                         |

### **Platform behaviours**

* **Protected routes** — unauthenticated visitors are redirected to sign-in.
* **Session persistence** — the token is stored in **`localStorage`** under **`mo_token`**.
* **SPA deep links** — application routes remain accessible after refresh.
* **Hospital-scoped data** — API queries are filtered by the authenticated user's **`hospital_id`**.
* **Real API-backed data** — operational values are retrieved from the backend.
* **Persistent operations** — created records are stored in SQLite.
* **Consistent identity** — unified typography, colors and branding across the application.

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

* `main.py` handles authentication, hospital scoping, API endpoints and static serving.
* `db.py` contains the SQLite connection helper and database schema.
* `seed.py` provides hospital-specific demo data.
* Feature pages are organized under **`pages/features/`**.
* **`lib/api.ts`** provides the shared API wrapper.
* **`lib/auth.tsx`** manages authentication state.
* **`lib/data.ts`** contains feature registry and module data.
* **`styles.css`** is the central source for the application's design system.

The architecture is intentionally small and readable so that new modules can be added without significantly changing the existing structure.

---

## 7. API reference & usage examples

### **Base URL**

Single-origin mode:

```text
http://localhost:5175/api
```

Authenticated requests require:

```http
Authorization: Bearer <token>
```

### **API endpoints**

| **Method** | **Endpoint**                   | **Auth** | **Purpose**                                |
| ---------- | ------------------------------ | -------- | ------------------------------------------ |
| **POST**   | **`/api/auth/signup`**         | —        | Create hospital + owner and seed demo data |
| **POST**   | **`/api/auth/login`**          | —        | Authenticate user and return token         |
| **POST**   | **`/api/auth/logout`**         | ✓        | Invalidate session                         |
| **GET**    | **`/api/auth/me`**             | ✓        | Return current user and hospital           |
| **GET**    | **`/api/analytics/workforce`** | ✓        | Workforce fill rate and coverage           |
| **GET**    | **`/api/shifts`**              | ✓        | Hospital shift board                       |
| **POST**   | **`/api/shifts`**              | ✓        | Create and persist a shift                 |
| **GET**    | **`/api/wards`**               | ✓        | Ward coverage                              |
| **GET**    | **`/api/candidates`**          | ✓        | Ranked candidate pool                      |
| **GET**    | **`/api/timesheets`**          | ✓        | Timesheets and approval states             |
| **GET**    | **`/api/invoices`**            | ✓        | Hospital-scoped invoices                   |
| **GET**    | **`/api/payments`**            | ✓        | Professional payouts                       |
| **GET**    | **`/api/professionals`**       | ✓        | Talent directory                           |
| **GET**    | **`/api/compliance`**          | ✓        | Credential and expiry status               |
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

---

## 8. Configuration details

### **Ports**

| **Mode**                | **Frontend** | **API**                |
| ----------------------- | ------------ | ---------------------- |
| `dev.sh` single process | **`:5175`**  | **`:5175`** (`/api/*`) |
| Development mode        | **`:5173`**  | **`:8000`**            |

### **Environment & data**

* No environment variables are required.
* SQLite is used as the database.
* The database is created automatically.
* Demo data is seeded automatically.
* The database file is **`medioracle.db`**.
* Session tokens are stored in the **`sessions`** table.
* The browser stores the session token in **`localStorage`** under **`mo_token`**.

### **Resetting the database**

Stop the server and delete:

```text
backend/medioracle.db
```

The database will be recreated automatically on the next run.

### **Rebranding**

The primary design tokens are located in:

```text
frontend/src/styles.css
```

Example:

```css
:root {
  --surface: #fcf8f3;
  --ink: #0b0b0b;
  --accent: #c60000;

  --neo-red: #c60000;
  --neo-red-dark: #a30000;
}
```

Changing the primary color variables updates the core product branding.

---

## 9. Verification & testing

The application was verified through scripted browser tests against the real backend.

### **Verified scenarios**

* Landing page renders correctly
* Sign-in flow works
* Dashboard loads the authenticated hospital
* Shift creation works
* Created shifts persist in the database
* Dashboard refresh preserves the session
* Sign-out returns to the landing page
* New hospital registration works
* Newly registered hospitals receive their own dataset
* Hospital data remains isolated

### **API verification**

The API was also tested for:

* **401** without authentication
* **401** with invalid authentication
* **409** for duplicate email
* Hospital-scoped invoices
* Hospital-scoped operational data
* Shift creation
* Authentication
* Session invalidation
* Health endpoint

### **Build verification**

The frontend should build successfully using:

```bash
cd frontend
npm run build
```

---

## 10. Contributing

Contributions are welcome.

The codebase is intentionally small and readable.

### **1. Create a feature branch**

```bash
git checkout -b feature/your-feature
```

### **2. Set up the project**

Follow the installation instructions in the **How to run the project** section.

For development, use the two-terminal setup for hot reload.

### **3. Development conventions**

* Use **TypeScript strict mode**.
* Keep React components functional.
* Route API data through **`lib/api.ts`** and **`useApi()`**.
* Avoid ad-hoc `fetch` calls directly inside page components.
* Do not introduce unnecessary CSS frameworks.
* Extend **`styles.css`** using the existing design tokens.
* Keep dashboard-based navigation consistent.
* Every new data endpoint must filter by the authenticated user's **`hospital_id`**.
* Maintain strict multi-hospital data isolation.

### **4. Verify before submitting**

Run:

```bash
cd frontend
npm run build
```

Then test the feature in the browser end-to-end.

### **5. Commit conventions**

Use short, imperative commit messages:

```text
Add X
Fix Y
Update Z
Improve Z
```

### **Potential improvements**

Some possible future enhancements include:

* Form validation improvements
* Shift-board pagination
* Billing CSV export
* Advanced candidate matching
* More workforce analytics
* Additional healthcare integrations
* Expanded notification system
* Role-based permissions
* Production-grade database support
* Dark mode

## 11. Developer

**Varshith Reddy**
Developer

📧 **Email:** [varshithreddyy6@gmail.com](mailto:varshithreddyy6@gmail.com)

💻 **GitHub:** [varshithreddyy6](https://github.com/varshithreddyy6)

🚀 **MediOracle Repository:** [github.com/varshithreddyy6/MediOracle](https://github.com/varshithreddyy6/MediOracle)

## 12. License

Copyright © 2026 **MediOracle**. All rights reserved.

If you plan to fork or reuse the project, add an appropriate license file such as:

```text
LICENSE
```

Possible options include:

* MIT
* Apache-2.0

Update this section once a license has been selected.

---

<div align="center">

**MediOracle** — Healthcare Staffing, Orchestrated. ⚕️

**Developed by Varshith Reddy**

</div>
