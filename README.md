## 🔄 Git Branch Strategy

This repository follows a structured Git workflow to ensure clean collaboration, stability, and scalability during development.

### Branches

- **main**  
  Stable, demo-ready code used for final evaluation and submission.

- **develop**  
  Integration branch where all tested features are merged before release.

- **feature/***  
  Individual feature branches created and assigned per team member.

### Feature Branches

- `feature/devops-infra`
- `feature/simulation-engine`
- `feature/optimization-engine`
- `feature/fronted-dashboard`
- `feature/gis-data`

---

## 👥 Team Development Workflow

1. The **team leader** creates and manages all branches.
2. Each team member works only on their **assigned feature branch**.
3. Code changes are pushed to the respective `feature/*` branch.
4. A **Pull Request (PR)** is created from `feature/*` → `develop`.
5. The team leader reviews and merges approved PRs into `develop`.
6. After final testing, the team leader merges `develop` → `main`.

🚫 Direct commits to `main` and `develop` are restricted to ensure code stability.

---

http://localhost:8005/docs