# Bug Investigation Prompt Template

## Purpose
Structured prompt for investigating and fixing bugs systematically.

---

## Bug Investigation Prompt

```text
Act as a SENIOR DEBUGGER investigating a bug.

## Bug Report
**Summary**: [One-line description]
**Severity**: [Critical / High / Medium / Low]
**Environment**: [Production / Staging / Local]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Error Message (if any)**:
```
[Paste error message/stack trace]
```

**Relevant Code Files**:
- [file1.tsx]
- [file2.ts]

---

## Investigation Process

### 1. Understand the Bug
- What is the user trying to do?
- At what point does it fail?
- Is it reproducible consistently?

### 2. Identify Potential Causes
List possible root causes in order of likelihood:
1. [Most likely cause]
2. [Second possibility]
3. [Third possibility]

### 3. Form Hypothesis
Based on the error and context, the most likely cause is:
[Hypothesis]

### 4. Verify Hypothesis
To verify, check:
- [ ] [Specific thing to verify]
- [ ] [Specific thing to verify]

### 5. Propose Fix
```tsx
// Before (broken)
[code]

// After (fixed)
[code]
```

### 6. Prevent Regression
- [ ] Add test case for this scenario
- [ ] Consider related edge cases
- [ ] Update error handling if needed

---

Output your investigation following this structure.
```

---

## Quick Debug Prompt

For faster debugging:

```text
Debug this error:

ERROR:
[Paste error message]

CODE:
[Paste relevant code]

CONTEXT:
[What the user was doing]

Identify the root cause and provide a fix.
```

---

## Error-Specific Prompts

### For TypeScript Errors
```text
Fix this TypeScript error:

ERROR:
[Paste TS error]

CODE:
[Paste code with error]

Explain why this error occurs and show the fix.
```

### For Runtime Errors
```text
Debug this runtime error:

STACK TRACE:
[Paste stack trace]

RELEVANT CODE:
[Paste code near the error]

What caused this and how do I fix it?
```

### For API Errors
```text
Debug this API error:

REQUEST:
[Method] [URL]
Body: [request body]

RESPONSE:
Status: [status code]
Body: [response body]

BACKEND CODE:
[Paste API route code]

Why is this failing and how do I fix it?
```

---

## Bug Severity Guide

| Severity | Description | Examples |
|----------|-------------|----------|
| Critical | System unusable, data loss | Can't login, payments broken, data corruption |
| High | Major feature broken | Can't create orders, export fails |
| Medium | Feature degraded | Slow load, UI glitch, workaround exists |
| Low | Minor issue | Typo, cosmetic, edge case |

---

## Investigation Checklist

### Before Debugging
- [ ] Can I reproduce the bug?
- [ ] When did it start happening?
- [ ] Does it affect all users or specific ones?
- [ ] What changed recently? (deploys, configs)

### During Investigation
- [ ] Check browser console for errors
- [ ] Check network tab for failed requests
- [ ] Check server logs for errors
- [ ] Check database for data issues
- [ ] Try in incognito/different browser

### After Finding Fix
- [ ] Does fix address root cause (not just symptom)?
- [ ] Could fix break anything else?
- [ ] Should this have a test?
- [ ] Are there similar bugs elsewhere?

---

## Usage

1. Fill in the bug report template
2. Paste relevant code and errors
3. Let AI investigate systematically
4. Verify the proposed fix
5. Add tests to prevent regression
