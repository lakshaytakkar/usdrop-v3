# USDrop v3 - Reusable Prompts & Templates

## Purpose
Reusable AI prompts, design rules, code standards, and templates for consistent development.

---

## Directory Structure

```
docs/
├── code/            # Development standards
├── design/          # UI/UX design rules
├── prompts/         # AI prompts & templates
│   ├── rules/       # Prompting guidelines
│   ├── audits/      # Review templates
│   └── generators/  # Content generators
├── marketing/       # Copy & messaging rules
└── README.md
```

---

## Quick Reference

### Code Standards
| File | Use When |
|------|----------|
| [code/COMPONENT_PATTERNS.md](code/COMPONENT_PATTERNS.md) | Building React components |
| [code/API_DESIGN_RULES.md](code/API_DESIGN_RULES.md) | Creating API endpoints |
| [code/TYPESCRIPT_STANDARDS.md](code/TYPESCRIPT_STANDARDS.md) | Writing TypeScript |
| [code/SUPABASE_PATTERNS.md](code/SUPABASE_PATTERNS.md) | Database queries & auth |

### Design Rules
| File | Use When |
|------|----------|
| [design/DESIGN_SYSTEM.md](design/DESIGN_SYSTEM.md) | Styling components, colors, spacing |
| [design/ANIMATION_STANDARDS.md](design/ANIMATION_STANDARDS.md) | Adding motion & transitions |
| [design/EMPTY_STATES.md](design/EMPTY_STATES.md) | Loading, error, empty states |
| [design/RESPONSIVE_RULES.md](design/RESPONSIVE_RULES.md) | Mobile-first responsive design |

### Audit Templates
| File | Use When |
|------|----------|
| [prompts/audits/PAGE_UI_UX_AUDIT.md](prompts/audits/PAGE_UI_UX_AUDIT.md) | Reviewing any page's UI/UX |
| [prompts/audits/LANDING_PAGE_AUDIT.md](prompts/audits/LANDING_PAGE_AUDIT.md) | Landing pages & navigation |
| [prompts/audits/DASHBOARD_AUDIT.md](prompts/audits/DASHBOARD_AUDIT.md) | Dashboard pages |
| [prompts/audits/FORM_AUDIT.md](prompts/audits/FORM_AUDIT.md) | Forms & validation |
| [prompts/audits/TABLE_DATA_AUDIT.md](prompts/audits/TABLE_DATA_AUDIT.md) | Data tables & lists |

### Generator Prompts
| File | Use When |
|------|----------|
| [prompts/generators/FEATURE_SPEC.md](prompts/generators/FEATURE_SPEC.md) | Writing feature specifications |
| [prompts/generators/CODE_REVIEW.md](prompts/generators/CODE_REVIEW.md) | Reviewing pull requests |
| [prompts/generators/BUG_REPORT.md](prompts/generators/BUG_REPORT.md) | Investigating & fixing bugs |

### Prompting Rules
| File | Use When |
|------|----------|
| [prompts/rules/PROMPT_IMPROVEMENT_GUIDE.md](prompts/rules/PROMPT_IMPROVEMENT_GUIDE.md) | Writing better AI prompts |
| [prompts/rules/DESIGN_SYSTEM_PROMPT.md](prompts/rules/DESIGN_SYSTEM_PROMPT.md) | Providing design context |

### Marketing & Copy
| File | Use When |
|------|----------|
| [marketing/COPYWRITING.md](marketing/COPYWRITING.md) | Brand voice & tone |
| [marketing/CTA_PLAYBOOK.md](marketing/CTA_PLAYBOOK.md) | Buttons & calls-to-action |
| [marketing/ERROR_MESSAGES.md](marketing/ERROR_MESSAGES.md) | Toasts, errors, validation |
| [marketing/ONBOARDING_COPY.md](marketing/ONBOARDING_COPY.md) | Welcome flows & tooltips |

---

## Usage by Task

| Task | Load These Docs |
|------|-----------------|
| Building new component | `COMPONENT_PATTERNS` + `DESIGN_SYSTEM` |
| Creating API endpoint | `API_DESIGN_RULES` + `SUPABASE_PATTERNS` |
| Reviewing a page | Use appropriate audit template |
| Writing feature spec | `FEATURE_SPEC` generator |
| Fixing a bug | `BUG_REPORT` generator |
| Adding form | `FORM_AUDIT` + `ERROR_MESSAGES` |
| Empty/loading states | `EMPTY_STATES` |
| Writing UI copy | `COPYWRITING` + `CTA_PLAYBOOK` |

---

## How to Use

### For AI Context
Copy relevant docs into Claude/Cursor context when working on related tasks.

### For Code Reviews
Use audit templates for structured, consistent reviews.

### For New Features
Start with `FEATURE_SPEC` generator, then reference relevant standards.
