# Prompt Analyzer & Improver

A comprehensive tool to analyze and improve your AI prompts based on 10 essential prompting rules and world-building techniques.

## 📚 Overview

This tool helps you transform vague, "AI slop" prompts into focused, high-quality prompts that yield better results from AI models like Claude, ChatGPT, and others.

## 🎯 Features

- **Real-time Analysis**: Get instant feedback on your prompts
- **Score System**: 0-100 score based on 10 essential rules
- **Prioritized Suggestions**: High, medium, and low priority improvements
- **Improved Prompt Generation**: Auto-generate enhanced versions of your prompts
- **Interactive Checklist**: Verify your prompt against best practices
- **Quick Tips**: Actionable advice for immediate improvement

## 🚀 Usage

### As a Component

```tsx
import { PromptAnalyzerComponent } from '@/components/prompt-analyzer';

export default function MyPage() {
  return <PromptAnalyzerComponent />;
}
```

### As a Service

```tsx
import { promptAnalyzer } from '@/lib/prompt-analyzer';

const analysis = promptAnalyzer.analyze('Write about marketing');

console.log(analysis.score); // 0-100
console.log(analysis.strengths); // Array of strengths
console.log(analysis.weaknesses); // Array of weaknesses
console.log(analysis.suggestions); // Prioritized suggestions
console.log(analysis.improvedPrompt); // Enhanced prompt
```

### Quick Tips

```tsx
import { promptAnalyzer } from '@/lib/prompt-analyzer';

const tips = promptAnalyzer.getQuickTips('Write about marketing');
// Returns: ["Your prompt needs significant improvement...", "💡 Add specific action verbs..."]
```

## 📋 The 10 Rules Analyzed

1. **Use Collaborative Tone** - Respectful, direct, and specific
2. **Be Explicit** - Action verbs, quantities, target audience
3. **Define Boundaries** - Length, style, constraints
4. **Draft → Plan → Act** - Outline first, then execute
5. **Demand Structured Output** - Tables, lists, specific formats
6. **Explain the "Why"** - Brand, audience, goals
7. **Control Brevity vs Verbosity** - Set depth level explicitly
8. **Provide Scaffolds** - Templates and structures
9. **Use Power Phrases and Personas** - "Think step by step", expert roles
10. **Divide and Conquer** - Break complex tasks into sections

## 🌍 World-Building Checks

The analyzer also checks for:
- Examples and references
- Context and background
- Constraints and boundaries
- Rich detail and specificity

## 📊 Understanding the Score

- **80-100**: Excellent prompt, well-structured
- **60-79**: Good prompt with room for improvement
- **Below 60**: Needs significant work, focus on high-priority suggestions

## 💡 Example

### Before (Weak Prompt)
```
Write about marketing
```
**Score: 15/100**

### After (Improved Prompt)
```
Act as a senior marketing strategist with 15 years of experience.

Task: Generate 5 innovative product launch ideas for a sustainable fashion brand targeting Gen Z consumers aged 18-25.

Structure:
- Introduction: Market context (2 paragraphs)
- 5 Launch Ideas: Each with title, description, and key tactics (1 paragraph each)
- Conclusion: Implementation roadmap (1 paragraph)

Tone & Style:
- Professional but approachable
- Data-driven with examples
- Avoid marketing jargon like "leverage" or "synergy"

Constraints:
- Total length: 1000-1500 words
- Include at least 2 case studies
- Focus on sustainability and authenticity

Goal: Create actionable launch strategies that resonate with environmentally conscious Gen Z while driving brand awareness and sales.

Think step by step, then critique your own response for clarity and feasibility.
```
**Score: 92/100**

## 🔧 Integration

### Add to Navigation

Add the prompt analyzer to your app's navigation:

```tsx
// In your navigation component
{
  title: 'Prompt Analyzer',
  href: '/prompt-analyzer',
  icon: Sparkles,
}
```

### API Endpoint (Optional)

You can create an API endpoint for server-side analysis:

```tsx
// app/api/analyze-prompt/route.ts
import { promptAnalyzer } from '@/lib/prompt-analyzer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const analysis = promptAnalyzer.analyze(prompt);
  return NextResponse.json(analysis);
}
```

## 📖 Related Documentation

- [Complete Prompt Improvement Guide](./PROMPT_IMPROVEMENT_GUIDE.md) - Comprehensive guide with all rules, examples, and techniques
- [10 Essential Rules](./PROMPT_IMPROVEMENT_GUIDE.md#-the-10-essential-prompting-rules) - Detailed breakdown of each rule
- [World-Building Techniques](./PROMPT_IMPROVEMENT_GUIDE.md#-world-building-techniques) - Advanced prompting strategies

## 🎓 Learning Resources

The analyzer is based on:
1. Anthropic's official prompting guidance for Claude
2. World-building techniques for richer AI interactions
3. Best practices from AI prompt engineering communities

## 🤝 Contributing

To improve the analyzer:
1. Update rule checks in `src/lib/prompt-analyzer.ts`
2. Add new rules or techniques
3. Improve suggestion quality and examples
4. Enhance the UI in `src/components/prompt-analyzer.tsx`

## 📝 Notes

- The analyzer uses pattern matching and heuristics, not AI itself
- Scores are relative and should be used as guidance
- Always review suggestions and apply them thoughtfully
- The improved prompt is a starting point - customize it further


