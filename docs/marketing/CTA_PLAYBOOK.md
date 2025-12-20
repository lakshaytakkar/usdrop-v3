# CTA (Call-to-Action) Playbook

## Purpose
Rules for writing and placing CTAs that convert across the USDrop platform.

---

## CTA Hierarchy

### Primary CTA
- **One per page/section** - Main action you want users to take
- **Visually dominant** - Filled button, brand color
- **Action-oriented copy** - Verb + Object

### Secondary CTA
- **Supporting action** - Alternative path
- **Less prominent** - Outline or ghost button
- **Complements primary** - "Learn more", "See pricing"

### Tertiary CTA
- **Optional actions** - Links, not buttons
- **Minimal emphasis** - Text link style

---

## Copy Formula

### Structure
```
[Verb] + [Object/Benefit]
```

### Power Verbs (by intent)
| Intent | Verbs |
|--------|-------|
| Start/Create | Start, Create, Build, Launch |
| Get/Access | Get, Claim, Access, Unlock |
| Learn/Discover | Discover, Explore, See, Learn |
| Try/Test | Try, Test, Experience |
| Save/Optimize | Save, Boost, Maximize |

### Examples
| Weak | Strong | Why |
|------|--------|-----|
| Submit | Create Account | Specific outcome |
| Click Here | Start Free Trial | Action + benefit |
| Learn More | See How It Works | Specific action |
| Buy Now | Get Started Free | Lower friction |
| Next | Continue to Dashboard | Clear destination |

---

## Button Sizing Rules

| Context | Size | Tailwind |
|---------|------|----------|
| Hero section | Large | `h-12 px-8 text-lg` |
| Cards/Sections | Default | `h-10 px-6` |
| Inline/Tables | Small | `h-8 px-4 text-sm` |
| Mobile (all) | Min 44px | `min-h-[44px]` |

---

## Placement Rules

### Hero Section
```
┌─────────────────────────────────────┐
│  Headline                           │
│  Subheadline                        │
│                                     │
│  [ Primary CTA ]  Secondary Link    │
└─────────────────────────────────────┘
```

### Feature Section
```
┌─────────────────────────────────────┐
│  Feature description...             │
│                                     │
│  [ CTA aligned to content ]         │
└─────────────────────────────────────┘
```

### Card
```
┌─────────────┐
│  Content    │
│             │
│  [ CTA ]    │  ← Bottom of card
└─────────────┘
```

### Sticky/Fixed
```
┌─────────────────────────────────────┐
│  Content that scrolls...            │
│                                     │
├─────────────────────────────────────┤
│  [ Fixed CTA Bar ]                  │ ← Mobile
└─────────────────────────────────────┘
```

---

## Context-Specific CTAs

### Signup/Auth
| Page | Primary CTA | Secondary |
|------|-------------|-----------|
| Landing | Start Free Trial | See Pricing |
| Signup | Create Account | Sign in instead |
| Login | Sign In | Forgot password? |
| Pricing | Get Started | Contact Sales |

### Dashboard/App
| Context | Primary CTA | Secondary |
|---------|-------------|-----------|
| Empty state | Add First [Item] | Import |
| List view | Create New | Export |
| Detail view | Save Changes | Cancel |
| Modal | Confirm | Cancel |

### Ecommerce
| Context | Primary CTA | Secondary |
|---------|-------------|-----------|
| Product card | Add to Cart | Quick View |
| Product page | Add to Cart | Save for Later |
| Cart | Checkout | Continue Shopping |
| Checkout | Place Order | Back to Cart |

---

## Urgency & Scarcity (Use Sparingly)

### Legitimate Urgency
```
"Start Free Trial" → "Start Free — 14 Days Left"
"Get Access" → "Get Early Access"
"Join Now" → "Join 2,847 sellers"
```

### Social Proof Integration
```
[ Start Free Trial ]
★★★★★ Trusted by 10,000+ sellers
```

---

## A/B Testing Priorities

### High Impact Tests
1. Verb choice (Start vs Get vs Try)
2. Benefit inclusion (Free, Fast, Easy)
3. Button color (brand vs contrasting)
4. Size and placement
5. With/without social proof

### Test One Variable at a Time
```
Control: "Start Free Trial"
Test A:  "Get Started Free"
Test B:  "Try Free for 14 Days"
```

---

## Constraints

### DO
- Use action verbs, not nouns
- Be specific about what happens next
- Match CTA to user's stage (awareness → decision)
- Ensure mobile tap target is 44px+
- Test different copy variations

### DON'T
- Use "Click Here" or "Submit"
- Have competing CTAs of equal weight
- Hide primary CTA below the fold on landing
- Use scary words for sign-up ("Buy", "Pay", "Commit")
- Mislead about what happens next

---

## Button Component Variants

```tsx
// Primary - main action
<Button variant="default">Start Free Trial</Button>

// Secondary - alternative action
<Button variant="outline">Learn More</Button>

// Ghost - tertiary/subtle
<Button variant="ghost">Skip for Now</Button>

// Destructive - dangerous action
<Button variant="destructive">Delete Account</Button>

// Link - inline text action
<Button variant="link">Forgot password?</Button>
```

---

## References
- [COPYWRITING.md](COPYWRITING.md)
- [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md)
