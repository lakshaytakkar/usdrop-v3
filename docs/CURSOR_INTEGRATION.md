# Cursor AI Integration Guide

## 🚀 Quick Start

The Prompt Analyzer now integrates with Cursor AI to automatically improve your prompts using:
- ✅ Analysis data (score, strengths, weaknesses)
- ✅ Your project context (tech stack, domain, purpose)
- ✅ The 10 essential prompting rules
- ✅ World-building techniques

## 📋 How to Use

### Method 1: Direct Cursor Chat (Recommended)

1. **Analyze your prompt** in the Prompt Analyzer (`/prompt-analyzer`)
2. **Click "Copy for Cursor Chat"** button
3. **Open Cursor's chat** (Cmd/Ctrl + L)
4. **Paste and send** - Cursor will improve your prompt using project context
5. **Get the improved prompt** ready to use!

### Method 2: Markdown File (For Complex Prompts)

1. **Analyze your prompt** in the Prompt Analyzer
2. **Click "Copy Markdown"** button
3. **Create a new file** (e.g., `prompt-improvement.md`)
4. **Paste the markdown** into the file
5. **In Cursor chat**, type: `@prompt-improvement.md improve this prompt`
6. Cursor will read the file and improve the prompt

### Method 3: Using .cursorrules

The `.cursorrules` file is already configured! Just:

1. **Analyze your prompt** in the Prompt Analyzer
2. **Copy the original prompt**
3. **In Cursor chat**, type:
   ```
   Improve this prompt using the 10 essential prompting rules and project context: [paste prompt]
   ```
4. Cursor will automatically use the rules from `.cursorrules`

## 🎯 What Gets Improved?

The Cursor integration will:

1. **Apply all high-priority suggestions** from the analysis
2. **Incorporate project context:**
   - Tech Stack: Next.js, TypeScript, React, Tailwind CSS
   - Domain: E-commerce / Dropshipping Platform
   - Purpose: AI-powered dropshipping platform

3. **Follow the 10 essential rules:**
   - Collaborative tone
   - Explicit action verbs, quantities, audience
   - Defined boundaries and constraints
   - Structured output requests
   - Context about "why"
   - Appropriate depth level
   - Scaffolds and templates
   - Power phrases and personas
   - Task division for complex prompts
   - World-building context

4. **Make it codebase-specific:**
   - References actual files/patterns
   - Uses project terminology
   - Aligns with existing code structure

## 💡 Example Workflow

### Before:
```
Write a component for product cards
```

### Analysis Shows:
- Score: 25/100
- Missing: Action verbs, structure, constraints, context

### After Cursor Improvement:
```
Act as a senior React developer with expertise in Next.js 16 and TypeScript.

Task: Create a reusable ProductCard component for our e-commerce dropshipping platform.

Requirements:
- Use Next.js 16 App Router patterns
- TypeScript with strict typing
- Tailwind CSS for styling
- Follow existing component structure in src/components/
- Use shadcn/ui Card component as base
- Include: product image, title, price, rating, "Add to Cart" button
- Make it responsive (mobile-first)
- Add hover effects and loading states
- Integrate with our existing product types from src/types/

Structure:
1. Component file: src/components/product-card.tsx
2. Props interface with TypeScript
3. Responsive grid layout
4. Image optimization with Next.js Image
5. Price formatting utility
6. Loading skeleton variant

Constraints:
- Max 200 lines of code
- No external dependencies beyond existing stack
- Follow our naming conventions (kebab-case files, PascalCase components)
- Use our design system colors and spacing

Goal: Create a production-ready, reusable component that matches our platform's design system and integrates seamlessly with existing code.

Think step by step, then provide the complete component code.
```

## 🔧 Customization

### Update Project Context

Edit `src/components/prompt-analyzer.tsx` and update the `handleAnalyze` function:

```typescript
const cursorRequest = generateCursorImprovementRequest(prompt, result, {
  techStack: ['Your', 'Tech', 'Stack'], // Update this
  domain: 'Your Domain', // Update this
  purpose: 'Your Purpose' // Update this
});
```

### Update .cursorrules

Edit `.cursorrules` to add more project-specific rules or context.

## 🎓 Tips

1. **Use Method 1 (Direct Chat)** for quick improvements
2. **Use Method 2 (Markdown)** for complex prompts that need file context
3. **Use Method 3 (.cursorrules)** when you want Cursor to remember the rules across sessions
4. **Combine methods** - analyze first, then use Cursor for final refinement

## 📚 Related Files

- `src/lib/cursor-prompt-improver.ts` - Core integration logic
- `src/components/prompt-analyzer.tsx` - UI component
- `.cursorrules` - Cursor agent rules
- `docs/PROMPT_IMPROVEMENT_GUIDE.md` - Complete prompting guide

---

**Pro Tip:** After Cursor improves your prompt, you can paste it back into the analyzer to see the new score! 🎯


