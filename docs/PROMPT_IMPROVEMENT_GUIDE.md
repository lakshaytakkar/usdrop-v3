# Prompt Improvement Guide: From AI Slop to High-Quality Outputs

## 🎯 Core Philosophy

Stop tossing casual, underspecified prompts at AI. Instead, use **"architected briefs"** that specify tone, audience, constraints, and structure. Treat AI like a smart teammate: be friendly, clear, and firm, and give it enough context and boundaries to actually think with you.

**Key Concept: World-Building**
Good prompting is about "world-building": giving the AI many specific puzzle pieces (context, constraints, references, examples) so it can faithfully "fill in" the rest instead of defaulting to generic outputs.

---

## 📋 The 10 Essential Prompting Rules

### 1. Use a Collaborative Tone
**❌ Bad:** "Write me something about marketing"
**✅ Good:** "I need a marketing strategy document. Let's work together to create something comprehensive."

**Why:** Respectful, direct, and specific prompts reduce hedging and "de-escalation" behavior, yielding more decisive answers.

**Key Takeaways:**
- Be respectful but direct
- Avoid barked orders or over-polite vagueness
- Use "we" language to create partnership
- Be specific about what you need

---

### 2. Be Explicit
**❌ Bad:** "Give me ideas"
**✅ Good:** "Generate 5 innovative product launch ideas for a sustainable fashion brand targeting Gen Z consumers aged 18-25"

**Why:** Action verbs, quantities, and target audiences prevent generic output.

**Key Takeaways:**
- Use action verbs: "generate", "analyze", "create", "compare"
- Specify exact quantities: "5 examples", "3 paragraphs", "10 bullet points"
- Name the target audience explicitly
- Define the scope clearly

**Examples:**
- "Analyze the top 3 competitors in the SaaS space and create a comparison table"
- "Generate 10 social media post ideas for a fitness brand targeting busy professionals"
- "Write 3 email subject lines for a product launch campaign"

---

### 3. Define Boundaries
**❌ Bad:** "Write a story"
**✅ Good:** "Write a 500-word science fiction story set in 2050, featuring a female protagonist, avoiding clichés about AI rebellion. Do not use the words 'dystopian', 'ominous', or 'fate'."

**Why:** Constraints force creative, non-cliché results.

**Key Takeaways:**
- Constrain length (word count, character limit)
- Specify style (formal, casual, technical)
- Define setting, characters, or context
- Ban overused words or phrases
- Set format requirements

**Examples:**
- "Create a 200-word product description in a friendly, conversational tone, avoiding marketing jargon"
- "Write a technical blog post under 1000 words, suitable for senior developers, without using 'leverage' or 'synergy'"
- "Generate a 5-sentence email in a professional tone, avoiding exclamation marks"

---

### 4. Draft → Plan → Act
**❌ Bad:** "Write my business plan" (then endless revisions)
**✅ Good:** 
1. "First, create an outline for a business plan for a SaaS startup"
2. "Review and refine this outline with me"
3. "Now execute: write the full business plan following this structure"

**Why:** Getting an outline first avoids endless reprompting on a bad first shot.

**Key Takeaways:**
- First ask for an outline or structure
- Review and refine the plan together
- Then execute the full content
- Break complex tasks into phases

**Workflow:**
1. **Blueprint Phase:** "Create an outline for [task]"
2. **Review Phase:** "Refine this outline: [specific feedback]"
3. **Execution Phase:** "Now write the full [content] following this structure"

---

### 5. Demand Structured Output
**❌ Bad:** "Tell me about competitors"
**✅ Good:** "Analyze our top 3 competitors and present the findings in a markdown table with columns: Company Name, Strengths, Weaknesses, Market Share, Pricing Strategy"

**Why:** Structured output is immediately usable and easier to work with.

**Key Takeaways:**
- Request specific formats: tables, bullet lists, JSON, markdown
- Define column headers or structure
- Ask for numbered lists or sections
- Specify output schema

**Examples:**
- "Create a comparison table with columns: Feature, Our Product, Competitor A, Competitor B"
- "List 10 benefits as a numbered list with 2-sentence explanations"
- "Format the response as JSON with keys: title, description, tags, date"

---

### 6. Explain the "Why"
**❌ Bad:** "Write product copy"
**✅ Good:** "Write product copy for our eco-friendly water bottle. Our brand voice is authentic and science-backed, targeting environmentally conscious millennials who value transparency. The goal is to highlight sustainability without greenwashing."

**Why:** Understanding brand, audience, and goals aligns responses with your positioning instead of generic slogans.

**Key Takeaways:**
- Describe your brand voice and values
- Explain the target audience's mindset
- Share the goal or desired outcome
- Provide context about positioning
- Mention what to avoid (e.g., greenwashing, jargon)

**Examples:**
- "Write a landing page headline. Our brand is premium but approachable, targeting small business owners who are tech-savvy but time-poor. Goal: emphasize time-saving without sounding robotic."
- "Create social media copy. Brand voice: witty and irreverent, targeting Gen Z. Avoid corporate speak. Goal: drive engagement, not just awareness."

---

### 7. Control Brevity vs Verbosity
**❌ Bad:** "Explain quantum computing"
**✅ Good:** "Explain quantum computing like I'm 5 years old" OR "Provide an expert-level detailed explanation of quantum computing with technical depth"

**Why:** Explicitly setting depth prevents either too-shallow or too-technical responses.

**Key Takeaways:**
- Use phrases like "explain like I'm 5"
- Request "expert detailed explanation"
- Ask for "brief bullets" or "executive summary"
- Specify depth level: beginner, intermediate, expert

**Examples:**
- "Give me a 2-sentence summary of machine learning"
- "Explain blockchain in 3 paragraphs for a business audience"
- "Provide a detailed technical deep-dive on React hooks for senior developers"

---

### 8. Provide Scaffolds
**❌ Bad:** "Write an essay"
**✅ Good:** "Write an essay with this structure: 
- Thesis statement (1 paragraph)
- 3 key supporting points (1 paragraph each)
- Counterargument (1 paragraph)
- Conclusion (1 paragraph)"

**Why:** Templates and headings help Claude fill in a skeleton instead of free-forming.

**Key Takeaways:**
- Give template structures
- Provide section headings
- Define paragraph count per section
- Specify required elements

**Examples:**
- "Write a blog post with: Hook (1 paragraph), Problem (2 paragraphs), Solution (3 paragraphs), CTA (1 paragraph)"
- "Create a product description: Overview (2 sentences), Features (bullet list), Benefits (3 sentences), Call-to-action (1 sentence)"

---

### 9. Use Power Phrases and Personas
**❌ Bad:** "Write about Stoicism"
**✅ Good:** "Act as a philosophy professor with 20 years of experience. Think step by step, then critique your own response. Write a lecture on Stoicism for undergraduate students, explaining core concepts with historical context and modern applications."

**Why:** Power phrases unlock better reasoning and domain depth.

**Key Takeaways:**
- Use "think step by step"
- Ask to "critique your own response"
- Use personas: "Act as [expert role]"
- Combine multiple techniques

**Power Phrases:**
- "Think step by step"
- "Critique your own response"
- "Act as [expert role]"
- "Take a deep breath and think carefully"
- "What are the potential weaknesses in this approach?"
- "Explain your reasoning"

**Persona Examples:**
- "Act as a senior software architect"
- "You are a marketing strategist with 15 years of experience"
- "Write as if you're a Pulitzer Prize-winning journalist"
- "Think like a startup founder who's raised $10M"

---

### 10. Divide and Conquer
**❌ Bad:** "Write my 50-page business plan"
**✅ Good:** 
1. "Create a detailed blueprint for a 50-page business plan"
2. "Write Section 1: Executive Summary (2 pages)"
3. "Write Section 2: Market Analysis (5 pages)"
4. [Continue section by section]
5. "Synthesize all sections into a cohesive final document"

**Why:** Breaking complex projects ensures consistency and quality.

**Key Takeaways:**
- Break large tasks into sections
- Work section-by-section
- Maintain consistency across sections
- Synthesize at the end

**Workflow:**
1. **Blueprint:** Create overall structure
2. **Section-by-section:** Draft each part separately
3. **Synthesis:** Combine and refine the final output

---

## 🌍 World-Building Techniques

### Deep Research Prompting
**❌ Bad:** "Summarize this topic"
**✅ Good:** "Research [topic] deeply. Provide not just a summary, but also:
- Contrarian or 'red pill' insights that challenge conventional wisdom
- Actionable takeaways I can implement immediately
- Key gaps in current understanding
- What experts disagree about"

**Why:** This goes beyond surface-level summaries to reveal deeper insights.

---

### Meta-Prompting
**Example:** "Write a better prompt for Midjourney to generate [specific image]. The current prompt is: '[weak prompt]'. Improve it by adding style references, technical parameters, and composition details."

**Why:** Use AI to improve prompts for other AI tools.

---

### Personas and Difficulty Levels
**Examples:**
- "Explain [topic] as a professor would to a graduate student"
- "Explain [topic] as if I'm 10 years old"
- "Explain [topic] as if I'm 25 and have a business degree"
- "Explain [topic] in the style of [specific writer/thinker]"

**Why:** Different personas and difficulty levels yield different perspectives and depths.

---

### Gap Finding
**Prompt:** "Based on what you know about me from our conversation, what should I learn next?" OR "Where are the gaps in my knowledge about [topic]?"

**Why:** Continuously identify blind spots and learning opportunities.

---

### Emotional Prompting
**Examples:**
- "Take a deep breath and think step by step"
- "This is urgent and critical - accuracy is essential"
- "I need your best work on this - think carefully"

**Why:** Emotional cues and pressure can improve reasoning and accuracy, especially for math and structured tasks.

---

### Voice Notes Over Text
**Tip:** Use long-form voice notes instead of short typed prompts. Speaking for minutes naturally packs in far more world-building detail.

**Why:** Voice naturally includes more context, nuance, and detail than brief text prompts.

---

### Avoiding AI Writing Style
**Techniques:**
- Ban common LLM sentence patterns: "In today's fast-paced world...", "Dive into...", "Unlock the power of..."
- Mix multiple author styles: "Write in a style that combines Hemingway's brevity with David Foster Wallace's footnotes"
- Train on your own pre-AI content: "Analyze my writing style from [samples] and match it"

**Why:** Prevents obvious "AI writing" that sounds generic.

---

## 📊 Prompt Analysis Checklist

Use this checklist to evaluate your prompts:

### Structure & Clarity
- [ ] Is the prompt explicit with action verbs?
- [ ] Are quantities specified (how many, how long)?
- [ ] Is the target audience clearly defined?
- [ ] Is the output format specified?

### Context & Boundaries
- [ ] Are constraints defined (length, style, banned words)?
- [ ] Is the "why" explained (brand, goals, audience)?
- [ ] Are boundaries set (what to avoid, what to include)?

### Process & Structure
- [ ] Is this a draft → plan → act workflow?
- [ ] Is structured output requested (tables, lists, formats)?
- [ ] Are scaffolds or templates provided?
- [ ] Is the task divided into manageable sections?

### Depth & Persona
- [ ] Is the depth level specified (beginner/expert/ELI5)?
- [ ] Is a persona or expert role defined?
- [ ] Are power phrases used ("think step by step", etc.)?

### World-Building
- [ ] Is sufficient context provided?
- [ ] Are examples or references included?
- [ ] Is the tone collaborative and respectful?
- [ ] Are there specific constraints to avoid generic output?

---

## 🎯 Complete Example: Before & After

### ❌ Before (Weak Prompt)
"Write about Stoicism"

### ✅ After (Architected Brief)
"Act as a philosophy professor with 20 years of experience teaching ancient philosophy. 

**Task:** Write a lecture on Stoicism for undergraduate students (ages 18-22) who are new to philosophy.

**Structure:**
1. Introduction: What is Stoicism? (2 paragraphs)
2. Historical Context: Origins and key figures (3 paragraphs)
3. Core Principles: The three main tenets (1 paragraph each)
4. Modern Applications: How Stoicism applies today (2 paragraphs)
5. Conclusion: Key takeaways (1 paragraph)

**Tone & Style:**
- Academic but accessible
- Use examples from both ancient and modern contexts
- Avoid jargon without explanation
- Do not use the phrases 'in today's world' or 'dive deep'

**Constraints:**
- Total length: 1500-2000 words
- Include at least 3 specific historical examples
- Connect to at least 2 modern applications (therapy, business, etc.)

**Goal:** Students should understand both the historical significance and practical relevance of Stoic philosophy.

Think step by step, then critique your own response for clarity and accuracy."

---

## 🚀 Quick Reference: Power Prompts Template

```
Act as [EXPERT PERSONA] with [EXPERIENCE LEVEL].

**Task:** [EXPLICIT ACTION] for [TARGET AUDIENCE].

**Structure:**
- [Section 1]: [Description] ([Length])
- [Section 2]: [Description] ([Length])
- [etc.]

**Tone & Style:**
- [Specific tone requirements]
- [What to avoid]
- [What to include]

**Constraints:**
- Length: [Specific]
- Format: [Table/List/Paragraph/etc.]
- Banned words/phrases: [List]

**Goal:** [The "why" - brand, positioning, desired outcome]

Think step by step, then [POWER PHRASE].
```

---

## 💡 Key Takeaways Summary

1. **Be Collaborative:** Treat AI as a teammate, not a servant
2. **Be Explicit:** Use action verbs, specify quantities, name audiences
3. **Set Boundaries:** Constrain length, style, and banned elements
4. **Plan First:** Draft → Plan → Act workflow prevents endless revisions
5. **Demand Structure:** Request specific formats (tables, lists, schemas)
6. **Explain Why:** Share brand, audience, and goals for alignment
7. **Control Depth:** Explicitly set beginner/expert/ELI5 levels
8. **Provide Scaffolds:** Give templates and structures to fill
9. **Use Power Phrases:** "Think step by step", personas, critique requests
10. **Divide & Conquer:** Break complex tasks into sections
11. **World-Build:** Provide rich context, examples, and constraints
12. **Avoid AI Slop:** Ban clichés, mix styles, train on your voice

---

## 🔄 Continuous Improvement

Regularly ask AI:
- "Based on what you know about me, what should I learn next?"
- "Where are the gaps in my knowledge about [topic]?"
- "What are the weaknesses in my reasoning here?"
- "What would an expert critique about this approach?"

This turns AI into a genuine thinking partner for continuous learning and improvement.

