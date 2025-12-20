# Feature Spec Generator Prompt

## Purpose
Template prompt for generating comprehensive feature specifications from high-level requirements.

---

## Prompt

```text
Act as a SENIOR PRODUCT MANAGER + TECHNICAL ARCHITECT.

Your task is to generate a comprehensive feature specification from the following requirement:

---
REQUIREMENT:
[Paste requirement here]
---

Generate a complete spec using this structure:

## 1. Overview
- **Feature Name**: Clear, descriptive name
- **One-liner**: Single sentence describing the feature
- **Problem Statement**: What user problem does this solve?
- **Success Metrics**: How do we measure success?

## 2. User Stories
Write 3-5 user stories in this format:
- As a [user type], I want to [action], so that [benefit]

## 3. Requirements

### Functional Requirements
- [ ] FR1: [Specific requirement]
- [ ] FR2: [Specific requirement]
- [ ] FR3: [Specific requirement]

### Non-Functional Requirements
- Performance: [Loading time, response time]
- Security: [Auth, permissions, data handling]
- Accessibility: [WCAG level, keyboard nav]

## 4. User Flow
Describe the step-by-step user journey:
1. User navigates to...
2. User clicks...
3. System displays...
4. User completes...

## 5. UI Components Needed
- [ ] Component 1: [Description]
- [ ] Component 2: [Description]
- [ ] Component 3: [Description]

## 6. API Endpoints Needed
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/... | Fetch... |
| POST | /api/... | Create... |

## 7. Database Changes
- [ ] New table: [table_name]
- [ ] New column: [table.column]
- [ ] New index: [index description]

## 8. Edge Cases
- What happens if...?
- What happens when...?
- Error states to handle:

## 9. Out of Scope
Explicitly list what this feature does NOT include.

## 10. Dependencies
- Depends on: [other features/systems]
- Blocked by: [any blockers]

## 11. Implementation Notes
Technical considerations, suggested approach, or warnings.

---

After generating, ask clarifying questions if any requirements are ambiguous.
```

---

## Usage

1. Copy the prompt above
2. Replace `[Paste requirement here]` with your feature request
3. Paste into Claude/Cursor
4. Review and refine the generated spec

---

## Example Input

```
REQUIREMENT:
Add ability for users to export their product catalog to CSV
```

---

## Example Output Structure

The AI will generate a complete spec covering:
- Clear feature definition
- User stories and acceptance criteria
- Technical requirements
- UI and API needs
- Edge cases and scope boundaries
