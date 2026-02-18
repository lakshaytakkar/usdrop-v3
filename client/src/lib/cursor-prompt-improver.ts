/**
 * Cursor Prompt Improver
 * 
 * Generates prompts that can be used with Cursor AI to improve prompts
 * using project context and analysis data.
 */

import { PromptAnalysis, PromptSuggestion } from './prompt-analyzer';

export interface CursorImprovementRequest {
  systemPrompt: string;
  userPrompt: string;
  contextPrompt: string;
  fullPrompt: string;
}

/**
 * Generate a Cursor-ready prompt improvement request
 */
export function generateCursorImprovementRequest(
  originalPrompt: string,
  analysis: PromptAnalysis,
  projectContext?: {
    techStack?: string[];
    purpose?: string;
    domain?: string;
  }
): CursorImprovementRequest {
  const weaknesses = analysis.weaknesses.join(', ');
  const highPrioritySuggestions = analysis.suggestions
    .filter(s => s.priority === 'high')
    .map(s => `- ${s.rule}: ${s.suggestion}`)
    .join('\n');

  const projectContextText = projectContext
    ? `
**Project Context:**
- Tech Stack: ${projectContext.techStack?.join(', ') || 'Not specified'}
- Domain: ${projectContext.domain || 'Not specified'}
- Purpose: ${projectContext.purpose || 'Not specified'}
`
    : '';

  const systemPrompt = `You are an expert prompt engineer specializing in creating high-quality, actionable prompts for AI models. You understand the 10 essential prompting rules and world-building techniques. Your goal is to transform weak prompts into powerful, context-aware prompts that yield excellent results.`;

  const contextPrompt = `**Analysis Results:**
- Score: ${analysis.score}/100
- Strengths: ${analysis.strengths.join(', ')}
- Weaknesses: ${weaknesses}
${projectContextText}
**High-Priority Improvements Needed:**
${highPrioritySuggestions}

**Original Prompt:**
${originalPrompt}`;

  const userPrompt = `Using the analysis above and the project context, improve the original prompt by:

1. **Applying all high-priority suggestions** from the analysis
2. **Incorporating project context** (tech stack, domain, purpose) where relevant
3. **Following the 10 essential prompting rules:**
   - Use collaborative tone
   - Be explicit (action verbs, quantities, audience)
   - Define boundaries (length, style, constraints)
   - Request structured output
   - Explain the "why" (brand, goals, audience)
   - Control brevity vs verbosity
   - Provide scaffolds/templates
   - Use power phrases and personas
   - Divide complex tasks
   - Add world-building context

4. **Make it specific to this codebase** - reference actual files, patterns, or structures if relevant

Return ONLY the improved prompt, no explanations. The improved prompt should be ready to use immediately.`;

  const fullPrompt = `${systemPrompt}

${contextPrompt}

${userPrompt}`;

  return {
    systemPrompt,
    userPrompt,
    contextPrompt,
    fullPrompt,
  };
}

/**
 * Generate a quick Cursor command that can be used directly
 */
export function generateCursorCommand(
  originalPrompt: string,
  analysis: PromptAnalysis
): string {
  const improvements = analysis.suggestions
    .filter(s => s.priority === 'high')
    .map(s => s.suggestion)
    .join('; ');

  return `Improve this prompt using the 10 essential prompting rules. Current score: ${analysis.score}/100. Key improvements needed: ${improvements}. Original prompt: "${originalPrompt}"`;
}

/**
 * Generate a markdown-formatted improvement request for Cursor
 */
export function generateCursorMarkdown(
  originalPrompt: string,
  analysis: PromptAnalysis,
  projectContext?: {
    techStack?: string[];
    purpose?: string;
    domain?: string;
  }
): string {
  const request = generateCursorImprovementRequest(originalPrompt, analysis, projectContext);
  
  return `# Prompt Improvement Request

## Original Prompt
\`\`\`
${originalPrompt}
\`\`\`

## Analysis
- **Score:** ${analysis.score}/100
- **Strengths:** ${analysis.strengths.join(', ')}
- **Weaknesses:** ${analysis.weaknesses.join(', ')}

## Improvement Request

${request.userPrompt}

## Context
${request.contextPrompt}

---

**Please improve the prompt above and return only the enhanced version.**`;
}


