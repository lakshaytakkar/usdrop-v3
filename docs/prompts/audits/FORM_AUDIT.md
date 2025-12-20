# Form UI/UX Audit Template

## Purpose
Atomic prompt for auditing forms, inputs, and validation patterns.

---

## Prompt

```text
Act as a SENIOR UX DESIGNER + FRONTEND ENGINEER auditing a form.

You are reviewing a form in the USDrop platform. Focus on:
- Input clarity and labeling
- Validation and error handling
- Submission flow and feedback
- Accessibility and keyboard navigation
- Mobile usability

---

## AUDIT CHECKLIST

### 1. Form Structure
- [ ] Clear form title/purpose
- [ ] Logical field ordering (most important first)
- [ ] Related fields grouped together
- [ ] Minimal fields (only ask what's needed)
- [ ] Progressive disclosure for advanced options
- [ ] Clear visual separation between sections

### 2. Labels & Instructions
- [ ] Every input has a visible label
- [ ] Labels are above or beside inputs (not placeholder-only)
- [ ] Required fields are marked (asterisk or "Required")
- [ ] Helper text for complex fields
- [ ] Format hints where needed ("MM/DD/YYYY", "example@email.com")
- [ ] Character counts for limited fields

### 3. Input Types
- [ ] Correct input type for data (email, tel, number, date)
- [ ] Appropriate input component (select, radio, checkbox, textarea)
- [ ] Autocomplete attributes set correctly
- [ ] Input masks for formatted data (phone, credit card)
- [ ] Proper keyboard on mobile (numeric, email, etc.)

### 4. Validation
- [ ] Real-time validation (on blur, not just submit)
- [ ] Clear error messages next to relevant field
- [ ] Error messages explain how to fix (not just "Invalid")
- [ ] Success indicators for valid fields (optional)
- [ ] Form-level errors displayed prominently
- [ ] Errors are announced to screen readers

### 5. Submit Button
- [ ] Clear, action-oriented label ("Create Account" not "Submit")
- [ ] Disabled state when form is invalid or submitting
- [ ] Loading indicator during submission
- [ ] Positioned consistently (bottom right or full width)
- [ ] Secondary action available (Cancel, Reset)

### 6. Feedback & Confirmation
- [ ] Success message/toast after submission
- [ ] Redirect or next step is clear
- [ ] Error recovery: form state preserved on failure
- [ ] Confirmation for destructive actions (delete, overwrite)

### 7. Accessibility
- [ ] All inputs have associated labels (htmlFor/id)
- [ ] Error messages linked via aria-describedby
- [ ] Focus moves to first error on submit failure
- [ ] Tab order is logical
- [ ] Color is not the only error indicator
- [ ] Form can be completed with keyboard only

### 8. Responsive
- [ ] Inputs are full-width on mobile
- [ ] Labels don't truncate
- [ ] Submit button is easily tappable (min 44px height)
- [ ] Form doesn't require horizontal scrolling
- [ ] Keyboard doesn't obscure inputs on mobile

---

## COMMON ISSUES TO CHECK

| Issue | Fix |
|-------|-----|
| Placeholder-only labels | Add visible label above input |
| Generic error "Invalid input" | Specify what's wrong and how to fix |
| No loading state on submit | Add spinner + disable button |
| Losing form data on error | Preserve state, show error |
| Tiny tap targets on mobile | Min 44px height for inputs/buttons |
| No autocomplete | Add autocomplete="email", "name", etc. |

---

## OUTPUT FORMAT

Provide your audit as:

1. **Summary**: Overall form UX assessment
2. **Critical Issues**: Blocking problems
3. **Accessibility Fixes**: A11y improvements needed
4. **UX Improvements**: Enhanced user experience
5. **Code Snippets**: Specific implementation fixes
```

---

## Usage
Copy the prompt above into Cursor/Claude when reviewing any form component.
