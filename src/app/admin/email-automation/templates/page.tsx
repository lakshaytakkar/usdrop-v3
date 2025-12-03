"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, Eye, UserPlus, Check, EyeOff, Edit, FileText, Calendar, Download } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createTemplateColumns } from "./components/template-columns"
import { EmailTemplate } from "@/types/admin/email-automation"
import { sampleTemplates } from "./data/templates"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { LargeModal } from "@/components/ui/large-modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sampleInternalUsers } from "@/app/admin/internal-users/data/users"
import { InternalUser } from "@/types/admin/users"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"
import { renderTemplate, getSampleVariables } from "@/lib/email/template-engine"

export default function TemplatesPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  
  const [templates, setTemplates] = useState<EmailTemplate[]>(sampleTemplates)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<EmailTemplate | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedTemplateForQuickView, setSelectedTemplateForQuickView] = useState<EmailTemplate | null>(null)
  const [selectedTemplates, setSelectedTemplates] = useState<EmailTemplate[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [assigneeModalOpen, setAssigneeModalOpen] = useState(false)
  const [assignedOwner, setAssignedOwner] = useState<string | null>(null)
  const [assignedMembers, setAssignedMembers] = useState<string[]>([])
  const [memberSearch, setMemberSearch] = useState("")
  const [tempOwner, setTempOwner] = useState<string | null>(null)
  const [tempMembers, setTempMembers] = useState<string[]>([])

  const internalUsers = sampleInternalUsers

  // Filter members based on search
  const filteredMembers = useMemo(() => {
    if (!memberSearch) return internalUsers
    const searchLower = memberSearch.toLowerCase()
    return internalUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    )
  }, [memberSearch, internalUsers])

  // Available members (excluding owner and already selected members)
  const availableMembers = useMemo(() => {
    return filteredMembers.filter(
      (user) => user.id !== tempOwner && !tempMembers.includes(user.id)
    )
  }, [filteredMembers, tempOwner, tempMembers])

  const handleOpenAssigneeModal = () => {
    setTempOwner(assignedOwner)
    setTempMembers([...assignedMembers])
    setMemberSearch("")
    setAssigneeModalOpen(true)
  }

  const handleSaveAssignees = () => {
    setAssignedOwner(tempOwner)
    setAssignedMembers(tempMembers)
    setAssigneeModalOpen(false)
  }

  const handleAddMember = (memberId: string) => {
    if (!tempMembers.includes(memberId)) {
      setTempMembers([...tempMembers, memberId])
    }
    setMemberSearch("")
  }

  const handleRemoveMember = (memberId: string) => {
    setTempMembers(tempMembers.filter(id => id !== memberId))
  }

  // Filter templates based on search and filters
  const filteredTemplates = useMemo(() => {
    let result = templates

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (template) =>
          template.name.toLowerCase().includes(searchLower) ||
          template.subject.toLowerCase().includes(searchLower) ||
          (template.description && template.description.toLowerCase().includes(searchLower))
      )
    }

    // Apply column filters
    filters.forEach((filter) => {
      if (filter.id === "status" && Array.isArray(filter.value) && filter.value.length > 0) {
        const statusValues = filter.value as string[]
        const isActive = statusValues.includes("active")
        const isInactive = statusValues.includes("inactive")
        result = result.filter((template) => {
          if (isActive && !template.isActive) return false
          if (isInactive && template.isActive) return false
          return true
        })
      }
      if (filter.id === "type" && Array.isArray(filter.value) && filter.value.length > 0) {
        const typeValues = filter.value as string[]
        result = result.filter((template) => typeValues.includes(template.type))
      }
      if (filter.id === "category" && Array.isArray(filter.value) && filter.value.length > 0) {
        const categoryValues = filter.value as string[]
        result = result.filter((template) => categoryValues.includes(template.category))
      }
    })

    return result
  }, [templates, search, filters])

  // Paginate filtered templates
  const paginatedTemplates = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredTemplates.slice(start, end)
  }, [filteredTemplates, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredTemplates.length / pageSize))
    setInitialLoading(false)
  }, [filteredTemplates.length, pageSize])

  const handleViewDetails = useCallback((template: EmailTemplate) => {
    setSelectedTemplateForQuickView(template)
    setQuickViewOpen(true)
  }, [])

  const handleRowClick = useCallback((template: EmailTemplate) => {
    setSelectedTemplateForQuickView(template)
    setQuickViewOpen(true)
  }, [])

  const handleNameClick = useCallback((template: EmailTemplate) => {
    setSelectedTemplateForQuickView(template)
    setQuickViewOpen(true)
  }, [])

  const handleEdit = (template: EmailTemplate) => {
    router.push(`/admin/email-automation/templates/${template.id}`)
  }

  const handleDelete = (template: EmailTemplate) => {
    setTemplateToDelete(template)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!templateToDelete) return
    setActionLoading("delete")
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const deletedTemplateName = templateToDelete.name
      setTemplates(templates.filter((t) => t.id !== templateToDelete.id))
      setDeleteConfirmOpen(false)
      setTemplateToDelete(null)
      showSuccess(`Template "${deletedTemplateName}" has been deleted successfully`)
    } catch (err) {
      console.error("Error deleting template:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to delete template. Please try again."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleActive = async (template: EmailTemplate) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setTemplates(templates.map((t) => (t.id === template.id ? { ...t, isActive: !t.isActive } : t)))
  }

  const handleDuplicate = async (template: EmailTemplate) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTemplates([...templates, newTemplate])
    showSuccess(`Template "${template.name}" has been duplicated`)
  }

  const columns = useMemo(
    () =>
      createTemplateColumns({
        onViewDetails: handleViewDetails,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleActive: handleToggleActive,
        onDuplicate: handleDuplicate,
        onNameClick: handleNameClick,
      }),
    [handleViewDetails, handleNameClick, handleEdit, handleDelete, handleToggleActive, handleDuplicate]
  )

  const handlePaginationChange = useCallback((p: number, s: number) => {
    if (p !== page) setPage(p)
    if (s !== pageSize) {
      setPageSize(s)
      setPage(1)
    }
  }, [page, pageSize])

  const handleRowSelectionChange = useCallback((selectedRows: EmailTemplate[]) => {
    setSelectedTemplates(selectedRows)
  }, [])

  // Prepare toolbar buttons based on selection
  const toolbarButtons = useMemo(() => {
    if (selectedTemplates.length > 0) {
      return [
        {
          label: actionLoading === "delete" ? "Deleting..." : "Delete Selected",
          icon: actionLoading === "delete" ? <Loader size="sm" className="mr-2" /> : <Trash2 className="h-4 w-4" />,
          onClick: async () => {
            setActionLoading("delete")
            try {
              await new Promise((resolve) => setTimeout(resolve, 500))
              const selectedIds = selectedTemplates.map((t) => t.id)
              const deletedCount = selectedTemplates.length
              setTemplates(templates.filter((t) => !selectedIds.includes(t.id)))
              setSelectedTemplates([])
              showSuccess(`${deletedCount} template(s) deleted successfully`)
            } catch (err) {
              console.error("Error deleting templates:", err)
              const errorMessage = err instanceof Error ? err.message : "Failed to delete templates. Please try again."
              showError(errorMessage)
            } finally {
              setActionLoading(null)
            }
          },
          variant: "outline" as const,
        },
        {
          label: "Clear Selection",
          onClick: () => setSelectedTemplates([]),
          variant: "ghost" as const,
        },
      ]
    } else {
      return []
    }
  }, [selectedTemplates, actionLoading, templates, showSuccess, showError])

  const filterConfig = [
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      columnId: "type",
      title: "Type",
      options: [
        { label: "Utility", value: "utility" },
        { label: "Marketing", value: "marketing" },
        { label: "Transactional", value: "transactional" },
      ],
    },
  ]

  useEffect(() => {
    const totalPages = Math.ceil(filteredTemplates.length / pageSize)
    const calculatedPageCount = totalPages > 0 ? totalPages : 1
    setPageCount(calculatedPageCount)
    if (page > calculatedPageCount && calculatedPageCount > 0) {
      setPage(1)
    }
  }, [filteredTemplates.length, pageSize, page])

  useEffect(() => {
    setInitialLoading(false)
  }, [])

  const sampleVariables = getSampleVariables()

  const handleDownloadPDF = async () => {
    if (!selectedTemplateForQuickView) return
    
    try {
      // Dynamically import html2pdf.js
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default || html2pdfModule
      
      // Get the rendered email content
      const renderedContent = renderTemplate(selectedTemplateForQuickView.htmlContent, sampleVariables)
      
      // Create an isolated iframe to render the email without parent page styles
      const iframe = document.createElement('iframe')
      iframe.style.position = 'absolute'
      iframe.style.left = '-9999px'
      iframe.style.top = '-9999px'
      iframe.style.width = '624px' // Standard email width
      iframe.style.height = '1000px'
      iframe.style.border = 'none'
      document.body.appendChild(iframe)
      
      // Wait for iframe to load
      await new Promise<void>((resolve) => {
        iframe.onload = () => resolve()
        iframe.src = 'about:blank'
      })
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) {
        throw new Error('Could not access iframe document')
      }
      
      // Get the base URL for images
      const baseUrl = window.location.origin || 'http://localhost:3000'
      
      // Replace image paths in the rendered content to use absolute URLs
      const contentWithImages = renderedContent.replace(
        /src="([^"]+)"/g,
        (match, src) => {
          // If it's already an absolute URL, keep it
          if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
            return match
          }
          // If it's a relative path starting with /, use baseUrl
          if (src.startsWith('/')) {
            return `src="${baseUrl}${src}"`
          }
          // Otherwise, assume it's relative to baseUrl
          return `src="${baseUrl}/${src}"`
        }
      )
      
      // Write the email HTML to the iframe with minimal styles
      iframeDoc.open()
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: 'DM Sans', Arial, sans-serif;
                background-color: #F6F7F7;
                padding: 20px;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            </style>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
          </head>
          <body>
            ${contentWithImages}
          </body>
        </html>
      `)
      iframeDoc.close()
      
      // Wait for fonts and images to load
      await new Promise<void>((resolve) => {
        const images = iframeDoc.querySelectorAll('img')
        let loadedCount = 0
        const totalImages = images.length
        
        if (totalImages === 0) {
          setTimeout(resolve, 300)
          return
        }
        
        const checkComplete = () => {
          loadedCount++
          if (loadedCount === totalImages) {
            setTimeout(resolve, 200) // Small delay after all images load
          }
        }
        
        images.forEach((img) => {
          if (img.complete) {
            checkComplete()
          } else {
            img.onload = checkComplete
            img.onerror = checkComplete // Continue even if image fails
          }
        })
        
        // Timeout after 3 seconds
        setTimeout(resolve, 3000)
      })
      
      const bodyElement = iframeDoc.body
      if (!bodyElement) {
        throw new Error('Could not access iframe body')
      }

      // Configure PDF options
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `${selectedTemplateForQuickView.name.replace(/\s+/g, '-')}-preview.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          backgroundColor: '#F6F7F7',
          windowWidth: iframe.contentWindow?.innerWidth || 624,
          windowHeight: bodyElement.scrollHeight,
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as const
        }
      }

      // Generate and download PDF from the isolated iframe
      await html2pdf().set(opt).from(bodyElement).save()
      
      // Clean up
      document.body.removeChild(iframe)
      
      showSuccess('PDF downloaded successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      showError('Failed to generate PDF. Please try again.')
    }
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="bg-primary/85 text-primary-foreground rounded-md px-4 py-3 mb-3 flex-shrink-0 w-full">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">Email Templates</h1>
            <p className="text-xs text-white/90 mt-0.5">
              Manage email templates for automations and campaigns. Create, edit, and organize your email templates.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
          {assignedOwner || assignedMembers.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-2">
                {assignedOwner && (() => {
                  const owner = internalUsers.find(u => u.id === assignedOwner)
                  return (
                    <Avatar className="h-8 w-8 border-2 border-white/20">
                      <AvatarImage src={getAvatarUrl(assignedOwner, owner?.email)} />
                      <AvatarFallback className="text-xs bg-white/20 text-white">
                        {owner?.name.charAt(0) || "O"}
                      </AvatarFallback>
                    </Avatar>
                  )
                })()}
                {assignedMembers.slice(0, 3).map((memberId) => {
                  const member = internalUsers.find(u => u.id === memberId)
                  return (
                    <Avatar key={memberId} className="h-8 w-8 border-2 border-white/20">
                      <AvatarImage src={getAvatarUrl(memberId, member?.email)} />
                      <AvatarFallback className="text-xs bg-white/20 text-white">
                        {member?.name.charAt(0) || "M"}
                      </AvatarFallback>
                    </Avatar>
                  )
                })}
                {assignedMembers.length > 3 && (
                  <div className="h-8 w-8 rounded-full border-2 border-white/20 bg-white/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">+{assignedMembers.length - 3}</span>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOpenAssigneeModal}
                className="whitespace-nowrap cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Assignee
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleOpenAssigneeModal}
              className="whitespace-nowrap cursor-pointer"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Assignee
            </Button>
          )}
          </div>
        </div>
      </div>

      {selectedTemplates.length > 0 && (
        <div className="mb-2">
          <span className="text-sm font-medium">
            {selectedTemplates.length} template{selectedTemplates.length !== 1 ? "s" : ""} selected
          </span>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading templates...</div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedTemplates}
          pageCount={Math.max(1, pageCount)}
          onPaginationChange={handlePaginationChange}
          onSortingChange={setSorting}
          onFilterChange={setFilters}
          onSearchChange={setSearch}
          loading={loading}
          initialLoading={initialLoading}
          filterConfig={filterConfig}
          searchPlaceholder="Search templates..."
          page={page}
          pageSize={pageSize}
          onAdd={() => {
            router.push('/admin/email-automation/templates/new')
          }}
          addButtonText="Create Template"
          addButtonIcon={<Plus className="h-4 w-4" />}
          enableRowSelection={true}
          onRowSelectionChange={handleRowSelectionChange}
          onRowClick={handleRowClick}
          secondaryButtons={toolbarButtons}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {templateToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Template:</span> {templateToDelete.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Subject:</span> {templateToDelete.subject}
              </p>
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"} className="cursor-pointer">
              {actionLoading === "delete" ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Details Large Modal */}
      {selectedTemplateForQuickView && (
        <LargeModal
          open={quickViewOpen}
          onOpenChange={(open) => {
            setQuickViewOpen(open)
            if (!open) {
              setSelectedTemplateForQuickView(null)
            }
          }}
          title={
            <div className="flex items-center justify-between w-full pr-4">
              <span>{selectedTemplateForQuickView.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                className="cursor-pointer"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          }
          footer={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleEdit(selectedTemplateForQuickView)
                }}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setQuickViewOpen(false)}
                className="cursor-pointer"
              >
                Close
              </Button>
            </div>
          }
          maxWidth="95vw"
        >
          <div className="flex gap-4 h-full min-h-[70vh] max-h-[80vh]">
            {/* Left Side: Template Details (50%) */}
            <div className="w-1/2 border-r pr-4 overflow-y-auto max-h-full">
              <div className="space-y-4">
                {/* Template Header */}
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <CardTitle className="text-lg mb-0">{selectedTemplateForQuickView.name}</CardTitle>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge variant={selectedTemplateForQuickView.isActive ? "default" : "secondary"} className="text-xs">
                              {selectedTemplateForQuickView.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant={selectedTemplateForQuickView.isPublic ? "outline" : "secondary"} className="text-xs">
                              {selectedTemplateForQuickView.isPublic ? "Public" : "Private"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {selectedTemplateForQuickView.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {selectedTemplateForQuickView.category}
                            </Badge>
                            {selectedTemplateForQuickView.level && (
                              <Badge variant="outline" className="text-xs">
                                {selectedTemplateForQuickView.level}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList>
                    <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
                    <TabsTrigger value="content" className="cursor-pointer">Content</TabsTrigger>
                    <TabsTrigger value="variables" className="cursor-pointer">Variables</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-2 mt-4">
                    <Card>
                      <CardHeader className="pb-2 px-4 pt-3">
                        <CardTitle className="text-sm font-semibold">Template Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 pt-0 px-4 pb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Subject</span>
                          <span className="text-sm font-medium">{selectedTemplateForQuickView.subject}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Type</span>
                          <Badge variant="outline" className="text-xs">
                            {selectedTemplateForQuickView.type}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Category</span>
                          <Badge variant="outline" className="text-xs">
                            {selectedTemplateForQuickView.category}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Status</span>
                          <Badge variant={selectedTemplateForQuickView.isActive ? "default" : "secondary"} className="text-xs">
                            {selectedTemplateForQuickView.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {selectedTemplateForQuickView.description && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground mb-1">Description</p>
                            <p className="text-sm">{selectedTemplateForQuickView.description}</p>
                          </div>
                        )}
                        {selectedTemplateForQuickView.createdAt && (
                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Created At</p>
                              <p className="text-sm font-medium">
                                {new Date(selectedTemplateForQuickView.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedTemplateForQuickView.updatedAt && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Last Updated</p>
                              <p className="text-sm font-medium">
                                {new Date(selectedTemplateForQuickView.updatedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-2 mt-4">
                    <Card>
                      <CardHeader className="pb-2 px-4 pt-3">
                        <CardTitle className="text-sm font-semibold">HTML Content</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 px-4 pb-3">
                        <div className="border rounded-lg p-4 bg-muted/30 max-h-96 overflow-y-auto">
                          <pre className="text-xs whitespace-pre-wrap font-mono">
                            {selectedTemplateForQuickView.htmlContent}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                    {selectedTemplateForQuickView.textContent && (
                      <Card>
                        <CardHeader className="pb-2 px-4 pt-3">
                          <CardTitle className="text-sm font-semibold">Text Content</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 px-4 pb-3">
                          <div className="border rounded-lg p-4 bg-muted/30 max-h-96 overflow-y-auto">
                            <p className="text-sm whitespace-pre-wrap">{selectedTemplateForQuickView.textContent}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="variables" className="space-y-2 mt-4">
                    <Card>
                      <CardHeader className="pb-2 px-4 pt-3">
                        <CardTitle className="text-sm font-semibold">Template Variables</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 px-4 pb-3">
                        {selectedTemplateForQuickView.variables && selectedTemplateForQuickView.variables.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedTemplateForQuickView.variables.map((variable, index) => (
                              <Badge key={index} variant="outline" className="font-mono text-xs">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No variables used in this template</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Right Side: Email Preview (50%) */}
            <div className="w-1/2 pl-4 flex flex-col min-h-0 max-h-full overflow-hidden">
              {/* Email Client Preview */}
              <div className="flex-1 bg-gray-50 rounded-lg border-2 border-gray-200 shadow-lg overflow-hidden flex flex-col min-h-0 max-h-full">
                {/* Email Header Simulation */}
                <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {sampleVariables['company.name']?.toString().charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{String(sampleVariables['company.name'] || 'USDrop')}</p>
                          <p className="text-xs text-muted-foreground">{String(sampleVariables['company.email'] || 'support@usdrop.com')}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">To: {String(sampleVariables['user.email'] || 'recipient@example.com')}</p>
                      <p className="text-sm font-medium">{renderTemplate(selectedTemplateForQuickView.subject, sampleVariables)}</p>
                    </div>
                  </div>
                </div>

                {/* Email Body Preview - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-white min-h-0" style={{ maxHeight: '100%' }}>
                  <div 
                    className="email-preview-container"
                    style={{
                      fontFamily: 'Arial, sans-serif',
                      maxWidth: '100%',
                      margin: '0 auto',
                      width: '100%',
                      isolation: 'isolate' as const,
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: (() => {
                        const rendered = renderTemplate(selectedTemplateForQuickView.htmlContent, sampleVariables)
                        // Ensure image paths are absolute for preview
                        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
                        return rendered.replace(
                          /src="([^"]+)"/g,
                          (match, src) => {
                            // If it's already an absolute URL or data URI, keep it
                            if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
                              return match
                            }
                            // If it's a relative path starting with /, use baseUrl
                            if (src.startsWith('/')) {
                              return `src="${baseUrl}${src}"`
                            }
                            // Otherwise, assume it's relative to baseUrl
                            return `src="${baseUrl}/${src}"`
                          }
                        )
                      })()
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </LargeModal>
      )}

      {/* Add Assignee Modal */}
      <Dialog open={assigneeModalOpen} onOpenChange={setAssigneeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Page Access Control</DialogTitle>
            <DialogDescription>
              Manage ownership and access for this page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Owner Section */}
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Select value={tempOwner || ""} onValueChange={setTempOwner}>
                <SelectTrigger id="owner" className="w-full">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {internalUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The owner is responsible for maintaining this page
              </p>
            </div>

            {/* Members Section */}
            <div className="space-y-2">
              <Label htmlFor="members">Members</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-start"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {memberSearch || "Search users to add..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search users..." 
                      value={memberSearch}
                      onValueChange={setMemberSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {availableMembers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.id}
                            onSelect={() => handleAddMember(user.id)}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={getAvatarUrl(user.id, user.email)} />
                                <AvatarFallback className="text-xs">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {/* Selected Members */}
              {tempMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tempMembers.map((memberId) => {
                    const member = internalUsers.find(u => u.id === memberId)
                    if (!member) return null
                    return (
                      <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={getAvatarUrl(memberId, member.email)} />
                          <AvatarFallback className="text-xs">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {member.name}
                        <button
                          onClick={() => handleRemoveMember(memberId)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigneeModalOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleSaveAssignees} className="cursor-pointer">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

