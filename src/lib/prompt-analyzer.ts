/**
 * Prompt Analyzer & Improver
 * 
 * Analyzes prompts against the 10 essential rules and world-building techniques
 * to suggest improvements and provide actionable feedback.
 */

export interface PromptAnalysis {
  score: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  suggestions: PromptSuggestion[];
  improvedPrompt?: string;
  checklist: ChecklistItem[];
}

export interface PromptSuggestion {
  rule: string;
  priority: 'high' | 'medium' | 'low';
  currentState: string;
  suggestion: string;
  example?: string;
}

export interface ChecklistItem {
  category: string;
  item: string;
  checked: boolean;
  explanation?: string;
}

export class PromptAnalyzer {
  private rules = [
    {
      id: 'collaborative-tone',
      name: 'Use Collaborative Tone',
      keywords: ['please', 'help', 'we', 'together', 'collaborate', 'let\'s'],
      check: (prompt: string) => {
        const hasCollaborative = /(please|help|we|together|collaborate|let's)/i.test(prompt);
        const hasBarking = /(do this|make|write|create)(?!\s+(?:a|an|the|me|us|together))/i.test(prompt);
        return { hasCollaborative, hasBarking };
      }
    },
    {
      id: 'explicit',
      name: 'Be Explicit',
      keywords: ['generate', 'analyze', 'create', 'write', 'compare', 'explain'],
      check: (prompt: string) => {
        const hasActionVerb = /\b(generate|analyze|create|write|compare|explain|build|design|develop|evaluate)\b/i.test(prompt);
        const hasQuantity = /\b(\d+)\s+(ideas|examples|paragraphs|sentences|points|items|sections|words|characters)\b/i.test(prompt);
        const hasAudience = /\b(for|targeting|audience|users|readers|customers|clients)\s+([a-z\s]+(?:aged|years|old|professionals|students|developers|managers|users)?)/i.test(prompt);
        return { hasActionVerb, hasQuantity, hasAudience };
      }
    },
    {
      id: 'boundaries',
      name: 'Define Boundaries',
      keywords: ['length', 'style', 'tone', 'avoid', 'do not', 'banned', 'constraint'],
      check: (prompt: string) => {
        const hasLength = /\b(\d+)\s*(words|characters|paragraphs|sentences|pages|lines)\b/i.test(prompt);
        const hasStyle = /\b(style|tone|format|formal|casual|professional|academic|conversational)\b/i.test(prompt);
        const hasConstraints = /\b(avoid|do not|don't|banned|constraint|limit|restrict|excluding)\b/i.test(prompt);
        return { hasLength, hasStyle, hasConstraints };
      }
    },
    {
      id: 'draft-plan-act',
      name: 'Draft → Plan → Act',
      keywords: ['outline', 'structure', 'plan', 'first', 'then', 'step'],
      check: (prompt: string) => {
        const hasOutline = /\b(outline|structure|plan|blueprint|framework|skeleton)\b/i.test(prompt);
        const hasSteps = /\b(first|then|next|step|phase|stage)\b/i.test(prompt);
        return { hasOutline, hasSteps };
      }
    },
    {
      id: 'structured-output',
      name: 'Demand Structured Output',
      keywords: ['table', 'list', 'bullet', 'markdown', 'json', 'format', 'columns'],
      check: (prompt: string) => {
        const hasFormat = /\b(table|list|bullet|markdown|json|format|columns|rows|schema)\b/i.test(prompt);
        const hasStructure = /\b(with|including|containing)\s+(columns|rows|sections|fields|keys)\b/i.test(prompt);
        return { hasFormat, hasStructure };
      }
    },
    {
      id: 'explain-why',
      name: 'Explain the "Why"',
      keywords: ['brand', 'audience', 'goal', 'purpose', 'target', 'positioning'],
      check: (prompt: string) => {
        const hasBrand = /\b(brand|voice|identity|values|positioning)\b/i.test(prompt);
        const hasGoal = /\b(goal|purpose|objective|aim|target|intention)\b/i.test(prompt);
        const hasContext = /\b(context|background|situation|scenario)\b/i.test(prompt);
        return { hasBrand, hasGoal, hasContext };
      }
    },
    {
      id: 'brevity-verbosity',
      name: 'Control Brevity vs Verbosity',
      keywords: ['brief', 'detailed', 'explain like', 'expert', 'beginner', 'summary'],
      check: (prompt: string) => {
        const hasDepth = /\b(brief|detailed|expert|beginner|intermediate|summary|deep|shallow|explain like i'm|eli5)\b/i.test(prompt);
        return { hasDepth };
      }
    },
    {
      id: 'scaffolds',
      name: 'Provide Scaffolds',
      keywords: ['template', 'structure', 'heading', 'section', 'format'],
      check: (prompt: string) => {
        const hasTemplate = /\b(template|structure|heading|section|format|skeleton|outline)\b/i.test(prompt);
        const hasSections = /(section|paragraph|point|part)\s+\d+/i.test(prompt);
        return { hasTemplate, hasSections };
      }
    },
    {
      id: 'power-phrases',
      name: 'Use Power Phrases and Personas',
      keywords: ['act as', 'think step', 'persona', 'expert', 'critique', 'role'],
      check: (prompt: string) => {
        const hasPersona = /\b(act as|you are|persona|role|expert|professional|specialist)\b/i.test(prompt);
        const hasPowerPhrase = /\b(think step by step|critique|analyze|reason|consider|evaluate)\b/i.test(prompt);
        return { hasPersona, hasPowerPhrase };
      }
    },
    {
      id: 'divide-conquer',
      name: 'Divide and Conquer',
      keywords: ['section', 'part', 'phase', 'step', 'break', 'divide'],
      check: (prompt: string) => {
        const hasDivision = /\b(section|part|phase|step|break|divide|split|chunk)\b/i.test(prompt);
        const hasMultiple = /(section|part|phase)\s+\d+/i.test(prompt);
        return { hasDivision, hasMultiple };
      }
    }
  ];

  analyze(prompt: string): PromptAnalysis {
    const suggestions: PromptSuggestion[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const checklist: ChecklistItem[] = [];

    let score = 0;
    const maxScore = 100;
    const pointsPerRule = maxScore / this.rules.length;

    // Analyze each rule
    this.rules.forEach(rule => {
      const result = rule.check(prompt);
      const ruleScore = this.calculateRuleScore(result, rule);
      score += ruleScore;

      if (ruleScore >= pointsPerRule * 0.7) {
        strengths.push(rule.name);
      } else {
        weaknesses.push(rule.name);
        suggestions.push(this.generateSuggestion(rule, result, prompt));
      }

      // Add to checklist
      checklist.push(...this.generateChecklistItems(rule, result));
    });

    // World-building checks
    const worldBuildingScore = this.checkWorldBuilding(prompt);
    score += worldBuildingScore;

    return {
      score: Math.round(score),
      strengths,
      weaknesses,
      suggestions: suggestions.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }),
      improvedPrompt: this.generateImprovedPrompt(prompt, suggestions),
      checklist
    };
  }

  private calculateRuleScore(result: any, rule: any): number {
    const pointsPerRule = 100 / this.rules.length;
    let score = 0;

    switch (rule.id) {
      case 'collaborative-tone':
        if (result.hasCollaborative && !result.hasBarking) score = pointsPerRule;
        else if (result.hasCollaborative) score = pointsPerRule * 0.5;
        break;

      case 'explicit':
        score = (result.hasActionVerb ? pointsPerRule * 0.4 : 0) +
                (result.hasQuantity ? pointsPerRule * 0.3 : 0) +
                (result.hasAudience ? pointsPerRule * 0.3 : 0);
        break;

      case 'boundaries':
        score = (result.hasLength ? pointsPerRule * 0.4 : 0) +
                (result.hasStyle ? pointsPerRule * 0.3 : 0) +
                (result.hasConstraints ? pointsPerRule * 0.3 : 0);
        break;

      case 'draft-plan-act':
        score = (result.hasOutline ? pointsPerRule * 0.5 : 0) +
                (result.hasSteps ? pointsPerRule * 0.5 : 0);
        break;

      case 'structured-output':
        score = (result.hasFormat ? pointsPerRule * 0.6 : 0) +
                (result.hasStructure ? pointsPerRule * 0.4 : 0);
        break;

      case 'explain-why':
        score = (result.hasBrand ? pointsPerRule * 0.33 : 0) +
                (result.hasGoal ? pointsPerRule * 0.33 : 0) +
                (result.hasContext ? pointsPerRule * 0.34 : 0);
        break;

      case 'brevity-verbosity':
        score = result.hasDepth ? pointsPerRule : 0;
        break;

      case 'scaffolds':
        score = (result.hasTemplate ? pointsPerRule * 0.5 : 0) +
                (result.hasSections ? pointsPerRule * 0.5 : 0);
        break;

      case 'power-phrases':
        score = (result.hasPersona ? pointsPerRule * 0.5 : 0) +
                (result.hasPowerPhrase ? pointsPerRule * 0.5 : 0);
        break;

      case 'divide-conquer':
        score = (result.hasDivision ? pointsPerRule * 0.5 : 0) +
                (result.hasMultiple ? pointsPerRule * 0.5 : 0);
        break;
    }

    return score;
  }

  private checkWorldBuilding(prompt: string): number {
    let score = 0;
    const maxWorldBuildingScore = 20; // Bonus points

    // Check for examples
    if (/\b(example|instance|case|sample|reference)\b/i.test(prompt)) {
      score += 5;
    }

    // Check for context
    if (/\b(context|background|situation|scenario|setting)\b/i.test(prompt)) {
      score += 5;
    }

    // Check for references
    if (/\b(reference|cite|source|based on|inspired by)\b/i.test(prompt)) {
      score += 5;
    }

    // Check for constraints
    if (/\b(constraint|limit|boundary|rule|guideline)\b/i.test(prompt)) {
      score += 5;
    }

    return Math.min(score, maxWorldBuildingScore);
  }

  private generateSuggestion(rule: any, result: any, prompt: string): PromptSuggestion {
    let priority: 'high' | 'medium' | 'low' = 'medium';
    let currentState = '';
    let suggestion = '';
    let example = '';

    switch (rule.id) {
      case 'collaborative-tone':
        priority = 'high';
        currentState = 'Prompt may sound too demanding or vague';
        suggestion = 'Use collaborative language like "Let\'s work together" or "I need your help"';
        example = 'Instead of "Write this", try "Let\'s create a comprehensive document together"';
        break;

      case 'explicit':
        priority = 'high';
        currentState = 'Missing action verbs, quantities, or target audience';
        suggestion = 'Add explicit action verbs, specify quantities (e.g., "5 examples"), and name your target audience';
        example = 'Instead of "Give me ideas", try "Generate 5 innovative product launch ideas for Gen Z consumers aged 18-25"';
        break;

      case 'boundaries':
        priority = 'high';
        currentState = 'No length, style, or constraint specifications';
        suggestion = 'Define length (word count), style (tone), and constraints (banned words, format)';
        example = 'Add: "Write 500 words in a friendly tone, avoiding marketing jargon"';
        break;

      case 'draft-plan-act':
        priority = 'medium';
        currentState = 'No planning phase mentioned';
        suggestion = 'Break into phases: first request an outline, then refine, then execute';
        example = 'Start with: "First, create an outline for [task]. Then we\'ll refine it together."';
        break;

      case 'structured-output':
        priority = 'high';
        currentState = 'No output format specified';
        suggestion = 'Request specific format: table, bullet list, markdown, JSON, etc.';
        example = 'Add: "Present findings in a markdown table with columns: [X, Y, Z]"';
        break;

      case 'explain-why':
        priority = 'medium';
        currentState = 'Missing brand context, goals, or audience explanation';
        suggestion = 'Explain your brand voice, target audience, and goals';
        example = 'Add: "Our brand voice is [X], targeting [Y], with the goal of [Z]"';
        break;

      case 'brevity-verbosity':
        priority = 'medium';
        currentState = 'Depth level not specified';
        suggestion = 'Specify depth: "brief summary", "expert detailed explanation", or "explain like I\'m 5"';
        example = 'Add: "Provide an expert-level detailed explanation" or "Explain like I\'m 10 years old"';
        break;

      case 'scaffolds':
        priority = 'medium';
        currentState = 'No template or structure provided';
        suggestion = 'Provide a template or structure with headings/sections';
        example = 'Add: "Structure: Introduction (1 paragraph), Main points (3 paragraphs), Conclusion (1 paragraph)"';
        break;

      case 'power-phrases':
        priority = 'high';
        currentState = 'No persona or power phrases used';
        suggestion = 'Add persona ("Act as [expert]") and power phrases ("think step by step", "critique your response")';
        example = 'Add: "Act as a senior marketing strategist. Think step by step, then critique your response."';
        break;

      case 'divide-conquer':
        priority = 'low';
        currentState = 'Complex task not broken into sections';
        suggestion = 'For complex tasks, break into sections and work section-by-section';
        example = 'Add: "Break this into 5 sections. We\'ll work on each section separately."';
        break;
    }

    return {
      rule: rule.name,
      priority,
      currentState,
      suggestion,
      example
    };
  }

  private generateChecklistItems(rule: any, result: any): ChecklistItem[] {
    const items: ChecklistItem[] = [];

    switch (rule.id) {
      case 'collaborative-tone':
        items.push({
          category: 'Structure & Clarity',
          item: 'Is the prompt collaborative and respectful?',
          checked: result.hasCollaborative && !result.hasBarking,
          explanation: result.hasCollaborative ? 'Good collaborative tone' : 'Add collaborative language'
        });
        break;

      case 'explicit':
        items.push(
          {
            category: 'Structure & Clarity',
            item: 'Uses explicit action verbs',
            checked: result.hasActionVerb,
            explanation: result.hasActionVerb ? 'Action verb found' : 'Add action verbs like "generate", "analyze", "create"'
          },
          {
            category: 'Structure & Clarity',
            item: 'Specifies quantities',
            checked: result.hasQuantity,
            explanation: result.hasQuantity ? 'Quantity specified' : 'Add specific numbers (e.g., "5 examples")'
          },
          {
            category: 'Structure & Clarity',
            item: 'Defines target audience',
            checked: result.hasAudience,
            explanation: result.hasAudience ? 'Audience defined' : 'Name your target audience explicitly'
          }
        );
        break;

      case 'boundaries':
        items.push(
          {
            category: 'Context & Boundaries',
            item: 'Defines length constraints',
            checked: result.hasLength,
            explanation: result.hasLength ? 'Length specified' : 'Add word/character/paragraph count'
          },
          {
            category: 'Context & Boundaries',
            item: 'Specifies style/tone',
            checked: result.hasStyle,
            explanation: result.hasStyle ? 'Style specified' : 'Define tone (formal, casual, professional, etc.)'
          },
          {
            category: 'Context & Boundaries',
            item: 'Sets constraints/boundaries',
            checked: result.hasConstraints,
            explanation: result.hasConstraints ? 'Constraints defined' : 'Add what to avoid or limit'
          }
        );
        break;

      case 'power-phrases':
        items.push(
          {
            category: 'Depth & Persona',
            item: 'Uses persona or expert role',
            checked: result.hasPersona,
            explanation: result.hasPersona ? 'Persona defined' : 'Add "Act as [expert role]"'
          },
          {
            category: 'Depth & Persona',
            item: 'Includes power phrases',
            checked: result.hasPowerPhrase,
            explanation: result.hasPowerPhrase ? 'Power phrases found' : 'Add "think step by step" or "critique your response"'
          }
        );
        break;
    }

    return items;
  }

  private generateImprovedPrompt(originalPrompt: string, suggestions: PromptSuggestion[]): string {
    let improved = originalPrompt;
    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high').slice(0, 3);

    // Add persona if missing
    if (highPrioritySuggestions.some(s => s.rule.includes('Power Phrases'))) {
      improved = `Act as an expert in this field. ${improved}`;
    }

    // Add structure request if missing
    if (highPrioritySuggestions.some(s => s.rule.includes('Structured Output'))) {
      improved += '\n\nPlease format the response as a structured output (use tables, lists, or clear sections as appropriate).';
    }

    // Add explicit quantities if missing
    if (highPrioritySuggestions.some(s => s.rule.includes('Explicit'))) {
      // Try to add quantity hints
      if (!/\d+/.test(improved)) {
        improved = improved.replace(/\b(ideas|examples|points|items)\b/i, '5 $1');
      }
    }

    // Add collaborative tone
    if (highPrioritySuggestions.some(s => s.rule.includes('Collaborative'))) {
      improved = `Let's work together to ${improved.toLowerCase()}`;
    }

    // Add thinking instruction
    improved += '\n\nThink step by step, then provide your response.';

    return improved;
  }

  /**
   * Get quick tips for improving a prompt
   */
  getQuickTips(prompt: string): string[] {
    const analysis = this.analyze(prompt);
    const tips: string[] = [];

    if (analysis.score < 50) {
      tips.push('Your prompt needs significant improvement. Focus on the high-priority suggestions.');
    } else if (analysis.score < 70) {
      tips.push('Your prompt is decent but can be improved. Address the medium-priority suggestions.');
    } else {
      tips.push('Your prompt is well-structured! Consider fine-tuning with the remaining suggestions.');
    }

    // Add specific tips based on weaknesses
    if (analysis.weaknesses.includes('Be Explicit')) {
      tips.push('💡 Add specific action verbs, quantities, and target audience');
    }
    if (analysis.weaknesses.includes('Define Boundaries')) {
      tips.push('💡 Specify length, style, and constraints to avoid generic output');
    }
    if (analysis.weaknesses.includes('Use Power Phrases and Personas')) {
      tips.push('💡 Add a persona ("Act as...") and power phrases ("think step by step")');
    }

    return tips;
  }
}

// Export singleton instance
export const promptAnalyzer = new PromptAnalyzer();


