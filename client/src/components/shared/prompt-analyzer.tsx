

import React, { useState } from 'react';
import { PromptAnalyzer, PromptAnalysis } from '@/lib/prompt-analyzer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Lightbulb, TrendingUp, Copy, Sparkles } from 'lucide-react';
import { generateCursorImprovementRequest, generateCursorMarkdown, generateCursorCommand } from '@/lib/cursor-prompt-improver';

const analyzer = new PromptAnalyzer();

export function PromptAnalyzerComponent() {
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [showImproved, setShowImproved] = useState(false);
  const [cursorPrompt, setCursorPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    if (!prompt.trim()) return;
    const result = analyzer.analyze(prompt);
    setAnalysis(result);
    setShowImproved(false);
    
    // Generate Cursor-ready prompt
    const cursorRequest = generateCursorImprovementRequest(prompt, result, {
      techStack: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS'],
      domain: 'E-commerce / Dropshipping Platform',
      purpose: 'AI-powered dropshipping platform with content generation tools'
    });
    setCursorPrompt(cursorRequest.fullPrompt);
  };

  const handleCopyCursorPrompt = async () => {
    if (!cursorPrompt) return;
    await navigator.clipboard.writeText(cursorPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCursorMarkdown = async () => {
    if (!analysis) return;
    const markdown = generateCursorMarkdown(prompt, analysis, {
      techStack: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS'],
      domain: 'E-commerce / Dropshipping Platform',
      purpose: 'AI-powered dropshipping platform with content generation tools'
    });
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Prompt Analyzer</h1>
          <p className="text-sm text-muted-foreground">
            Analyze and improve your prompts
          </p>
        </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Enter Your Prompt</CardTitle>
          <CardDescription>
            Paste your prompt below to analyze it and get improvement suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here... For example: 'Write about marketing'"
            className="min-h-[150px]"
          />
          <Button onClick={handleAnalyze} className="w-full" disabled={!prompt.trim()}>
            Analyze Prompt
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Score Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Analysis Results</CardTitle>
                <div className={`text-4xl font-bold ${getScoreColor(analysis.score)} ${getScoreBgColor(analysis.score)} px-4 py-2 rounded-lg`}>
                  {analysis.score}/100
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Progress value={analysis.score} className="h-3" />
                </div>
                
                {analysis.strengths.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Strengths
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.strengths.map((strength, idx) => (
                        <Badge key={idx} variant="outline" className="bg-green-50 text-green-700">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.weaknesses.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      Areas for Improvement
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.weaknesses.map((weakness, idx) => (
                        <Badge key={idx} variant="outline" className="bg-red-50 text-red-700">
                          {weakness}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Improvement Suggestions
              </CardTitle>
              <CardDescription>
                Prioritized suggestions to enhance your prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="high" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="high">
                    High Priority ({analysis.suggestions.filter(s => s.priority === 'high').length})
                  </TabsTrigger>
                  <TabsTrigger value="medium">
                    Medium ({analysis.suggestions.filter(s => s.priority === 'medium').length})
                  </TabsTrigger>
                  <TabsTrigger value="low">
                    Low ({analysis.suggestions.filter(s => s.priority === 'low').length})
                  </TabsTrigger>
                </TabsList>

                {['high', 'medium', 'low'].map((priority) => {
                  const filtered = analysis.suggestions.filter(s => s.priority === priority);
                  if (filtered.length === 0) return null;

                  return (
                    <TabsContent key={priority} value={priority} className="space-y-4 mt-4">
                      {filtered.map((suggestion, idx) => (
                        <Card key={idx}>
                          <CardHeader>
                            <CardTitle className="text-lg">{suggestion.rule}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Current State:</p>
                              <p className="text-sm">{suggestion.currentState}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Suggestion:</p>
                              <p className="text-sm">{suggestion.suggestion}</p>
                            </div>
                            {suggestion.example && (
                              <Alert>
                                <AlertDescription>
                                  <strong>Example:</strong> {suggestion.example}
                                </AlertDescription>
                              </Alert>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>

          {/* Cursor AI Integration */}
          {cursorPrompt && (
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Use with Cursor AI
                </CardTitle>
                <CardDescription>
                  Copy this prompt and paste it into Cursor's chat to get an AI-improved version using your project context
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopyCursorPrompt}
                    className="flex-1"
                    variant="default"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy for Cursor Chat'}
                  </Button>
                  <Button
                    onClick={handleCopyCursorMarkdown}
                    variant="outline"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Markdown
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>How to use:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Click "Copy for Cursor Chat" above</li>
                    <li>Open Cursor's chat (Cmd/Ctrl + L)</li>
                    <li>Paste and send - Cursor will improve your prompt using project context</li>
                    <li>Or use "Copy Markdown" to paste into a file and @mention it</li>
                  </ol>
                </div>
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    Preview Cursor prompt
                  </summary>
                  <Textarea
                    value={cursorPrompt}
                    readOnly
                    className="min-h-[300px] font-mono text-xs mt-2"
                  />
                </details>
              </CardContent>
            </Card>
          )}

          {/* Improved Prompt */}
          {analysis.improvedPrompt && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Auto-Improved Prompt
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowImproved(!showImproved)}
                  >
                    {showImproved ? 'Hide' : 'Show'}
                  </Button>
                </div>
                <CardDescription>
                  Basic improved version (use Cursor AI above for better results with project context)
                </CardDescription>
              </CardHeader>
              {showImproved && (
                <CardContent>
                  <Textarea
                    value={analysis.improvedPrompt}
                    readOnly
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <Button
                    className="mt-4"
                    onClick={() => {
                      navigator.clipboard.writeText(analysis.improvedPrompt ?? '');
                    }}
                  >
                    Copy Improved Prompt
                  </Button>
                </CardContent>
              )}
            </Card>
          )}

          {/* Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Prompt Checklist</CardTitle>
              <CardDescription>
                Verify your prompt against best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  analysis.checklist.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, typeof analysis.checklist>)
                ).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-2">{category}</h3>
                    <div className="space-y-2">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Checkbox checked={item.checked} disabled className="mt-1" />
                          <div className="flex-1">
                            <p className={`text-sm ${item.checked ? 'text-green-700' : 'text-red-700'}`}>
                              {item.item}
                            </p>
                            {item.explanation && (
                              <p className="text-xs text-muted-foreground mt-1">{item.explanation}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Quick Tips:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {analyzer.getQuickTips(prompt).map((tip, idx) => (
                  <li key={idx} className="text-sm">{tip}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}
      </div>
    </div>
  );
}

