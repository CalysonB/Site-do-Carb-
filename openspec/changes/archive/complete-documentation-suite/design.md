# Design: Documentation Structure

## Folder Hierarchy

```text
/ (root)
├── README.md                (Main Portal)
└── docs/
    ├── principal/           (VISION, ROADMAP, CHANGELOG)
    ├── organizacao/         (CONTRIBUTING, CODE_OF_CONDUCT, PROJECT_STRUCTURE, TEAM)
    ├── tecnica/             (ARCHITECTURE, DATABASE, API, ENVIRONMENT, DEPLOYMENT, SECURITY)
    ├── gestao/              (DECISIONS/ADRs, MEETINGS, TASKS)
    ├── qualidade/           (TESTING, BUG_REPORT, FEATURE_REQUEST, MAINTENANCE)
    └── produto/             (USER_STORIES, USE_CASES, UX_UI_GUIDE, FAQ)
```

## Document Templates

- **API.md**: Will use a table format for endpoints (Method, Path, Description, Auth required).
- **DATABASE.md**: Will list models as tables with Column, Type, and Notes.
- **ARCHITECTURE.md**: Will include a mermaid diagram of the stack.
