# Code Review Prompt Template

## Purpose
Structured prompt for comprehensive code reviews focused on quality, patterns, and best practices.

---

## Prompt

```text
Act as a SENIOR SOFTWARE ENGINEER conducting a thorough code review.

Review the following code for:
1. Correctness and logic errors
2. Code style and consistency
3. Performance concerns
4. Security vulnerabilities
5. Best practices adherence
6. Testability

---
CODE TO REVIEW:
[Paste code here]
---

CONTEXT (if any):
[Describe what this code does, PR description, etc.]
---

## Review Format

### Summary
[1-2 sentence overall assessment]

### Critical Issues 🔴
Issues that MUST be fixed before merging:
- Issue 1: [Description + suggested fix]
- Issue 2: [Description + suggested fix]

### Improvements 🟡
Recommended changes for better code quality:
- Improvement 1: [Description + suggested fix]
- Improvement 2: [Description + suggested fix]

### Suggestions 🟢
Nice-to-haves and minor enhancements:
- Suggestion 1: [Description]
- Suggestion 2: [Description]

### What's Good ✅
Positive aspects worth acknowledging:
- [Positive 1]
- [Positive 2]

### Questions ❓
Clarifications needed:
- [Question 1]
- [Question 2]

---

## Specific Checks

### For React/Next.js Components:
- [ ] Proper TypeScript types
- [ ] No unnecessary re-renders
- [ ] Proper hook dependencies
- [ ] Accessible markup (ARIA, semantic HTML)
- [ ] Error boundaries where needed
- [ ] Loading/error states handled

### For API Routes:
- [ ] Input validation
- [ ] Proper error handling
- [ ] Authentication/authorization checks
- [ ] Response format consistency
- [ ] No sensitive data exposure

### For Database Queries:
- [ ] SQL injection prevention
- [ ] Proper indexing considerations
- [ ] N+1 query prevention
- [ ] Transaction handling if needed

### For General Code:
- [ ] No hardcoded secrets/credentials
- [ ] Proper error handling
- [ ] Clear naming conventions
- [ ] Appropriate comments (not excessive)
- [ ] No dead code
- [ ] DRY principle followed

---

Provide code snippets showing the fix for any Critical or Improvement issues.
```

---

## Quick Review Variant

For faster reviews, use this condensed version:

```text
Review this code. Flag any:
- 🔴 Bugs or security issues
- 🟡 Performance problems
- 🟢 Style/best practice violations

CODE:
[Paste code]

Be concise. Show fixes for critical issues only.
```

---

## Usage

1. Copy the appropriate prompt
2. Paste the code to review
3. Add context if helpful
4. Review AI suggestions critically
5. Apply relevant feedback

---

## Review Priorities

| Priority | Focus | Examples |
|----------|-------|----------|
| P0 | Security | SQL injection, XSS, auth bypass |
| P1 | Bugs | Logic errors, null refs, race conditions |
| P2 | Performance | N+1 queries, memory leaks, blocking calls |
| P3 | Maintainability | Naming, structure, documentation |
| P4 | Style | Formatting, conventions |
