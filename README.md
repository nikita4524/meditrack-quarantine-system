# MediTrack – Virus Quarantine & Treatment Management System

> **Technical Product Manager (TPM) Assessment Deliverable**  
> A high-reliability clinical containment SaaS application engineered to streamline patient quarantine tracking, enforce strict protocol compliance across nursing and medical teams, coordinate timely patient discharges, and monitor institutional mortality thresholds.

---

## 🏥 Product Overview & Core Architecture

MediTrack is an enterprise-grade web application built to coordinate pandemic containment operations across negative-pressure quarantine wards. It enforces strict clinical governance, prevents duplicate entries, guarantees room capacity limits (74 beds), and orchestrates multi-stakeholder discharge workflows.

### Technology Stack
- **Framework:** React 19 + TypeScript (Strict mode)
- **Bundler & Build Tool:** Vite
- **Styling:** Tailwind CSS (Navy Blue, Teal, Amber, Rose healthcare palette)
- **Icons:** Lucide React
- **Analytics & Visualizations:** Recharts (Area charts, Bar charts, Pie charts, Trend lines)
- **Persistence:** LocalStorage with dynamic schema management and complete demo state restoration

---

## 🌐 Public Landing Page & User Journey

When someone opens MediTrack, they land on the modern, healthcare-themed **Landing Page** featuring:
1. **Header Navigation:** Brand logo, links to `Home`, `Features`, `How It Works`, `User Roles`, and `About`, plus **Sign In** and **Get Started** action buttons.
2. **Hero Section:**
   - Heading: *"Smarter Quarantine Management. Better Patient Care."*
   - Subtitle: *"An integrated platform to manage patient admissions, monitor daily vitals, coordinate clinical examinations and streamline discharge workflows."*
   - Dual Call-to-Actions: **Get Started / Demo Access** & **Explore Features**.
   - Interactive Live Quarantine Ward preview mockup.
3. **Key Architecture Statistics:** 74 Isolation Beds, 3 Consecutive Fever-Free Days Required, 15% Mortality Benchmark Ceiling, and 3 Dedicated User Roles (clearly marked as system configuration parameters).
4. **Interactive Features Grid:** 8 cards detailing Room Allocation, Daily Vitals, Doctor Exams, 3-Day Fever-Free tracking, Two-Stage Discharge, Mortality Analytics, RBAC, and Automated Alerts.
5. **How It Works (5-Step Lifecycle):** Patient Admission $\rightarrow$ Nurse Records Temp $\rightarrow$ Doctor Examination $\rightarrow$ Medical Clearance $\rightarrow$ Admin Final Discharge.
6. **User Roles:** Dedicated breakdown of Admin, Nurse, and Doctor personas with 1-click launch buttons.
7. **Footer:** Comprehensive site directory with product mission and academic technical assessment notice.
8. **Seamless Navigation:** Clicking **Get Started** or **Sign In** opens the clinical login screen. Users can navigate back to the landing page at any time via the `"← Landing Page"` link.

---

## 👥 Authentication & Demo Login Credentials

The application enforces session security with role-based routing. Unauthenticated users are directed to the healthcare-themed login page.

| Role | Authorized Name & Title | Email / Username | Password | Post-Login Landing View |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | **Sarah Connor, RN MHA**<br>Quarantine Facility Director | `admin@meditrack.com` | `Admin@123` | **Quarantine Command Center** |
| **Nurse** | **David Patel, BSN**<br>Senior Triage Nurse | `nurse@meditrack.com` | `Nurse@123` | **Nurse Vitals Station** |
| **Doctor** | **Dr. Evelyn Reed, MD FIDSA**<br>Chief Infectious Disease Specialist | `doctor@meditrack.com` | `Doctor@123` | **Doctor Examination Suite** |

### Login & Registration Features:
- **Staff Sign In & Create Account Tabs:** Effortlessly switch between authenticating existing credentials or onboarding a new clinical team member.
- **Account Registration Fields:** Full Legal Name, Institutional Email, Clinical Role selection (`Nurse`, `Doctor`, or `Admin`), Password (min 6 characters), and optional Professional Title.
- **Auto-Login on Registration:** Newly registered accounts are instantly authenticated, stored persistently in `LocalStorage` (`meditrack_custom_users_v1`), and routed to their role's designated station.
- **Password Show/Hide Toggle:** Convenient visibility control during credential entry.
- **1-Click Demo Accounts Autofill:** Instant autofill for Admin, Nurse, and Doctor testing.
- **Input Validation:** Guardrails for duplicate emails, invalid formats, empty fields, and unauthorized access attempts.
- **Persistent Sessions:** Sessions survive page refreshes via LocalStorage (`meditrack_auth_user_v1`).
- **Role-Based Protection:** Enforces granular access controls based on the active user's assigned role.
- **Logout Action:** Top navigation logout button cleans the session and returns to the login screen.
- **Optional Demo Mode:** An explicit "Demo Mode: ON/OFF" switch in the header allows rapid persona switching during live evaluations without logging out.

---

## 🛡️ Business Rules & Clinical Logic Engine

### 1. The 3 Full Consecutive Fever-Free Days Rule
- **Statutory Criterion:** A patient is medically eligible for discharge **only after 3 full consecutive calendar days without fever**.
- **Fever Threshold:** Default is `< 37.5°C`. Any reading $\ge 37.5^\circ\text{C}$ is evaluated as fever.
- **Streak Reset:** Any temperature reading meeting or exceeding the threshold immediately resets the consecutive count to `0/3`.
- **Missing Data Rule:** Missing temperature data breaks continuity and does **not** count toward the 3-day streak.
- **Calibration Governance:** Modifying the fever threshold in Facility Settings requires Chief Medical Officer (Head Doctor) validation.

### 2. Discharge Gatekeeping Workflow
1. **Nurse Vitals:** Record daily temperature (one per patient per calendar day enforced).
2. **Afebrile Streak Reaches 3/3:** System automatically flags patient as "Eligible for Doctor Review".
3. **Doctor Review Gate:** Doctor evaluates clinical progress, examines patient, and signs **Medical Discharge Clearance**.
4. **Admin Release Gate:** Admin confirms **Final Facility Discharge**, which marks the patient as `DISCHARGED` and automatically frees the negative-pressure room back into available capacity.
5. *Preventive Safeguard:* The system prohibits discharge if the 3-day criterion is unmet or doctor clearance is missing.

### 3. Capacity Safeguards (74 Beds)
- Fixed facility capacity of **74 isolation rooms** (`R-101` through `R-174`).
- Duplicate room assignments are automatically rejected.
- Admissions are locked with an active alert when all 74 beds are occupied.


### 4. Emergency Clinical Override
- Routine doctor examinations require morning vitals to be logged first.
- If an urgent evaluation is required before nurse rounds, doctors can activate an **Emergency Clinical Override** by submitting a mandatory medical justification (minimum 5 characters).

---

## 🧪 Comprehensive Sample Dataset (10 Patients)

The preloaded database features 10 real-world clinical scenarios:

1. **PT-1001 (Marcus Vance - R-101):** Active high fever (38.6°C today, 0/3 fever-free count).
2. **PT-1002 (Elena Rostova - R-102):** 1 afebrile day (36.8°C yesterday, pending today's check).
3. **PT-1003 (Lucas Campbell - R-103):** 2 afebrile days (36.6°C today, 2/3 progress).
4. **PT-1004 (Aisha Al-Mansoor - R-104):** 3 afebrile days complete (3/3), awaiting Doctor signoff.
5. **PT-1005 (Arthur Pendelton - R-105):** Doctor signed clearance, awaiting Admin final discharge.
6. **PT-1006 (Siddharth Rao - R-106):** Pending temperature check today and pending doctor visit.
7. **PT-1007 (Chloe Tremblay - R-107):** Temperature taken today, awaiting routine doctor visit.
8. **PT-1008 (Dmitri Volkov - R-108):** Gap in temperature logs (demonstrating streak reset on missing data).
9. **PT-1009 (Fatima Zahra - Released):** Successfully discharged recovery case (historical outcome).
10. **PT-1010 (George Henderson - Released):** Deceased case (severe ARDS, historical outcome).

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Clone & Install
```bash
git clone <repository-url>
cd TPM
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```
Generates an optimized bundle in `/dist` ready for static serving.

### 4. Preview Production Build
```bash
npm run preview
```

---

## ☁️ Vercel Deployment

This project includes a configured `vercel.json` and is ready for one-click deployment:

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In the Vercel dashboard, click **"Add New Project"** and select the repository.
3. Vercel will automatically detect the Vite build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

