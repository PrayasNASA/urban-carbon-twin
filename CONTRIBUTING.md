# Urban Carbon Twin – Contribution Guidelines

Thank you for contributing to Urban Carbon Twin.
This document defines how team members must work, which branches to use, and how code is reviewed and merged.

These rules ensure:

- `Clean collaboration`
- `No accidental code breakage`
- `Demo-ready stability for SIH`

## Project Structure Overview
This is a monorepo with clearly defined ownership:

```text
frontend/              → Next.js Dashboard
services/              → Backend Microservices
infra/                 → Kubernetes & DevOps
observability/         → Monitoring & Metrics
data/                  → GIS & City Data

```
Each team member owns specific folders and workflows.

## Branching Strategy (MANDATORY)

### Protected Branches
These branches are read-only for team members:

- `main → Stable demo / final submission`
- `develop → Integration branch`

🚫 **Do NOT push directly to these branches**

Only the Team Lead can merge into them.

## 🌿 Feature Branches (Member-Specific)

Each contributor must work **only in their assigned feature branch**.  
Direct work on other branches is strictly prohibited.

### Branch Assignment

| Member Role | Assigned Branch |
|------------|-----------------|
| DevOps / Team Lead | `feature/devops-infra` |
| Simulation Engineer | `feature/simulation-engine` |
| Optimization Engineer | `feature/optimization-engine` |
| Frontend Engineer | `feature/frontend-dashboard` |
| GIS & Data Engineer | `feature/gis-data` |

🚫 **Pushing to any branch other than the assigned feature branch is not allowed.**

All changes must be submitted via **Pull Requests** from the assigned `feature/*` branch to `develop`.

## 🧑‍💻 Development Workflow

### Step 1️⃣ – Pull Latest Changes
```bash
git checkout feature/<your-branch>
git pull origin feature/<your-branch>
```

### Step 2️⃣ – Make Small, Focused Changes

- ✔ One feature per commit  
- ✔ Clear commit messages  

**Example:**
```bash
git commit -m "Add traffic emission model for peak hours"
```

### Step 3️⃣ – Push to Your Feature Branch
```bash
git push origin feature/<your-branch>
```

### Step 4️⃣ – Create Pull Request

- **Source:** `feature/<your-branch>`
- **Target:** `develop`

**Add:**
- Description of changes
- Screenshots / outputs (if applicable)

🚫 **Never open Pull Requests directly to `main`.**

## 🔍 Pull Request Rules

A Pull Request (PR) will be merged only if all the following conditions are met:

- ✔ Code builds successfully  
- ✔ No unrelated files are modified  
- ✔ A clear and detailed description is provided  
- ✔ Team Lead approval is received  

## 📂 Folder Ownership Rules

Contributors must **only modify folders they own** as per the table below.

### Folder Ownership

| Folder | Owner |
|------|------|
| `frontend/next-dashboard/` | Frontend Engineer |
| `services/emission-engine/` | Simulation Engineer |
| `services/dispersion-engine/` | Simulation Engineer |
| `services/optimizer-service/` | Optimization Engineer |
| `services/intervention-engine/` | Optimization Engineer |
| `services/gis-service/` | GIS Engineer |
| `infra/`, `.github/` | Team Lead |

🚫 **Cross-folder changes without prior approval are not allowed.**


## 🧪 Code Quality Expectations

All contributors must adhere to the following code quality standards:

- Follow the existing code style and conventions  
- Use meaningful and descriptive variable names  
- Avoid hard-coded values wherever possible  
- Add comments for complex or non-obvious logic  

---

## 🐛 Reporting Issues

If you encounter any of the following:

- Bugs  
- Performance issues  
- Integration conflicts  

👉 Open a **GitHub Issue** instead of pushing random or unreviewed fixes.

---

## 🔐 Security & Stability Rules

To maintain repository security and stability:

- No secrets or API keys should be committed to the codebase  
- No force pushes to any branch  
- No rebasing of shared branches  
- No deleting branches without prior approval  

---

## 🏆 Why This Process Matters

This workflow:

- Prevents merge conflicts  
- Enables parallel development  
- Ensures demo and deployment stability  
- Reflects real-world, industry-standard practices  

---

## 📌 Final Reminder

Write code as if this project will be **deployed by a government agency**.

---

## ✅ Maintained By

**Team Lead – Urban Carbon Twin**

