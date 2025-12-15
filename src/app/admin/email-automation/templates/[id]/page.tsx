"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye, Code } from "lucide-react"
import { EmailTemplate, EmailTemplateType, EmailTemplateCategory } from "@/types/admin/email-automation"
import { sampleTemplates } from "../data/templates"
import { EmailPreview } from "@/components/email/email-preview"
import { EmailVariableSelector } from "@/components/email/email-variable-selector"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"

export default function TemplateEditorPage() {
  const router = useRouter()
  const params = useParams()
  const { showSuccess, showError } = useToast()
  const templateId = params.id as string
  const isNew = templateId === 'new'

  const [template, setTemplate] = useState<Partial<EmailTemplate>>({
    name: '',
    subject: '',
    type: 'utility',
    category: 'custom',
    description: null,
    htmlContent: '',
    textContent: null,
    variables: [],
    isActive: true,
    isPublic: true,
    level: 'free',
  })
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState<'editor' | 'preview'>('editor')

  useEffect(() => {
    if (!isNew) {
      const existingTemplate = sampleTemplates.find(t => t.id === templateId)
      if (existingTemplate) {
        setTemplate(existingTemplate)
      }
    }
  }, [templateId, isNew])

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      showSuccess(`Template ${isNew ? 'created' : 'updated'} successfully`)
      router.push('/admin/email-automation/templates')
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  const handleVariableSelect = (variable: string) => {
    const currentContent = template.htmlContent || ''
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = currentContent.substring(0, start) + variable + currentContent.substring(end)
      setTemplate({ ...template, htmlContent: newContent })
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length, start + variable.length)
      }, 0)
    }
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              {isNew ? 'Create Template' : 'Edit Template'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isNew ? 'Create a new email template' : 'Edit email template details and content'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(previewMode === 'editor' ? 'preview' : 'editor')}
            className="cursor-pointer"
          >
            {previewMode === 'editor' ? (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            ) : (
              <>
                <Code className="h-4 w-4 mr-2" />
                Editor
              </>
            )}
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? (
              <>
                <Loader size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Template Details */}
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={template.name}
                  onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  placeholder="Welcome Email"
                />
              </div>
              <div>
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={template.subject}
                  onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
                  placeholder="Welcome to USDrop!"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={template.type}
                  onValueChange={(v) => setTemplate({ ...template, type: v as EmailTemplateType })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utility">Utility</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={template.category}
                  onValueChange={(v) => setTemplate({ ...template, category: v as EmailTemplateCategory })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="password-reset">Password Reset</SelectItem>
                    <SelectItem value="order-confirmation">Order Confirmation</SelectItem>
                    <SelectItem value="shipping-notification">Shipping Notification</SelectItem>
                    <SelectItem value="abandoned-cart">Abandoned Cart</SelectItem>
                    <SelectItem value="re-engagement">Re-engagement</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={template.description || ''}
                onChange={(e) => setTemplate({ ...template, description: e.target.value || null })}
                placeholder="Template description..."
                rows={2}
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={template.isActive}
                  onCheckedChange={(checked) => setTemplate({ ...template, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isPublic"
                  checked={template.isPublic}
                  onCheckedChange={(checked) => setTemplate({ ...template, isPublic: checked })}
                />
                <Label htmlFor="isPublic">Public</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Template Content */}
        <Card>
          <CardHeader>
            <CardTitle>Template Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="html">
              <TabsList>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="variables">Variables</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="htmlContent">HTML Content</Label>
                  <Textarea
                    id="htmlContent"
                    value={template.htmlContent}
                    onChange={(e) => setTemplate({ ...template, htmlContent: e.target.value })}
                    className="font-mono text-sm min-h-[400px]"
                    placeholder="Enter HTML content or use variables like {{user.name}}"
                  />
                </div>
              </TabsContent>

              <TabsContent value="variables" className="mt-4">
                <EmailVariableSelector onVariableSelect={handleVariableSelect} />
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                {template.htmlContent ? (
                  <EmailPreview htmlContent={template.htmlContent} />
                ) : (
                  <p className="text-sm text-muted-foreground">Add HTML content to see preview</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}














