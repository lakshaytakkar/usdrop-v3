# Prompt Analyzer - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Access the Tool

Navigate to: **`/prompt-analyzer`** in your browser

Or add it to your navigation menu.

### 2. Enter Your Prompt

Paste your prompt into the text area and click "Analyze Prompt"

### 3. Review & Improve

- Check your **score** (0-100)
- Review **strengths** and **weaknesses**
- Read **prioritized suggestions**
- Copy the **improved prompt** if provided

## 📊 What You'll See

### Score Card
- Overall score out of 100
- Visual progress bar
- Strengths (green badges)
- Weaknesses (red badges)

### Suggestions
Organized by priority:
- **High Priority**: Critical improvements (action verbs, boundaries, structure)
- **Medium Priority**: Important enhancements (context, depth, scaffolds)
- **Low Priority**: Nice-to-have improvements (division, advanced techniques)

### Improved Prompt
An auto-generated enhanced version of your prompt with key improvements applied.

### Checklist
Interactive checklist showing which best practices your prompt follows.

## 💡 Quick Tips

1. **Start with a weak prompt** to see the full power of the analyzer
2. **Focus on high-priority suggestions first** - they have the biggest impact
3. **Use the improved prompt as a starting point**, then customize further
4. **Check the guide** (`PROMPT_IMPROVEMENT_GUIDE.md`) for detailed explanations

## 🎯 Example Workflow

1. **Original Prompt**: "Write about marketing"
   - Score: 15/100
   - Missing: Action verbs, audience, structure, boundaries

2. **Apply High-Priority Suggestions**:
   - Add action verb: "Generate"
   - Add quantity: "5 ideas"
   - Add audience: "for Gen Z consumers"
   - Add structure: "Format as a table"

3. **Result**: "Generate 5 marketing ideas for Gen Z consumers, formatted as a table with columns: Idea, Description, Target Channel"
   - Score: 75/100

4. **Apply Medium-Priority Suggestions**:
   - Add persona: "Act as a senior marketing strategist"
   - Add context: "for a sustainable fashion brand"
   - Add power phrase: "Think step by step"

5. **Final Result**: Score 90+/100

## 📚 Learn More

- **Full Guide**: See `PROMPT_IMPROVEMENT_GUIDE.md` for comprehensive rules and examples
- **API Usage**: See `PROMPT_ANALYZER_README.md` for programmatic usage
- **10 Rules**: Each rule is explained with before/after examples

## 🔧 For Developers

### Use Programmatically

```tsx
import { promptAnalyzer } from '@/lib/prompt-analyzer';

const analysis = promptAnalyzer.analyze('Your prompt here');
console.log(analysis.score, analysis.suggestions);
```

### Customize Rules

Edit `src/lib/prompt-analyzer.ts` to:
- Adjust scoring weights
- Add new rules
- Modify suggestion logic
- Enhance world-building checks

## ❓ Common Questions

**Q: Why is my score low?**
A: Focus on high-priority suggestions. Most low scores are due to missing action verbs, quantities, or structure.

**Q: Should I use the improved prompt as-is?**
A: Use it as a starting point. The improved prompt applies basic improvements, but you should customize it further based on your specific needs.

**Q: Can I analyze prompts for different AI models?**
A: Yes! The rules apply to most AI models (Claude, ChatGPT, Gemini, etc.). Some models may benefit from model-specific adjustments.

**Q: How accurate is the scoring?**
A: The scoring is heuristic-based and provides guidance. Use it as a tool to identify areas for improvement, not as an absolute measure.

## 🎓 Next Steps

1. ✅ Try analyzing a few of your existing prompts
2. ✅ Read the full guide to understand each rule deeply
3. ✅ Practice writing prompts using the 10 rules
4. ✅ Use world-building techniques for complex tasks
5. ✅ Share improved prompts with your team

---

**Remember**: Good prompting is about world-building - give the AI rich context, clear boundaries, and specific structure to get better results!


