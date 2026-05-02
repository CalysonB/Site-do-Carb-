# Specs: Documentation Suite

## Requirements

### R1: Main Portal (README.md)
- MUST contain a project overview.
- MUST link to all documents in the `docs/` folder.
- MUST include quick start instructions (npm install, npm run dev).

### R2: Technical Clarity (ARCHITECTURE.md, DATABASE.md, API.md)
- ARCHITECTURE.md MUST describe the Full Stack flow.
- DATABASE.md MUST list current Sequelize models and their relationships.
- API.md MUST document all endpoints found in `backend/src/app.js`.

### R3: Governance (CONTRIBUTING.md, CODE_OF_CONDUCT.md)
- MUST define standard Git Flow (feature branches, PRs).
- MUST define commit message conventions (Conventional Commits).

### R4: Product Vision (VISION.md, USER_STORIES.md)
- MUST outline the goal of the CARB portal.
- MUST include at least 3 initial User Stories based on current features (Ouvidoria, Notícias, Admin).

## Scenarios

### Scenario 1: Onboarding a new developer
- **Given** a new developer joins the project.
- **When** they read `README.md`.
- **Then** they MUST be able to find how to set up the environment and where to find the API documentation.
