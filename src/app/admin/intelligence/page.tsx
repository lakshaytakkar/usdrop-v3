"use client"

import { useState, useMemo, useEffect } from "react"
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
import { Plus, Trash2, Download, Eye, Archive, Calendar, Star, Pin, TrendingUp, FileText } from "lucide-react"
import { AdminArticleCard } from "./components/admin-article-card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Loader } from "@/components/ui/loader"
import { Article } from "./data/articles"
import { sampleArticles } from "./data/articles"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { ArticleDetailDrawer } from "./components/article-detail-drawer"

export default function AdminIntelligencePage() {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()
  
  // Permission checks
  const { hasPermission: canView } = useHasPermission("usdropintelligence.view")
  const { hasPermission: canCreate } = useHasPermission("usdropintelligence.create")
  const { hasPermission: canEdit } = useHasPermission("usdropintelligence.edit")
  const { hasPermission: canDelete } = useHasPermission("usdropintelligence.delete")
  const { hasPermission: canPublish } = useHasPermission("usdropintelligence.edit") // Use edit for publish
  
  const [articles] = useState<Article[]>(sampleArticles)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([])
  const [statusTab, setStatusTab] = useState<"all" | "draft" | "published" | "scheduled" | "archived">("all")
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  // Calculate status counts
  const statusCounts = useMemo(() => {
    return {
      all: articles.length,
      draft: articles.filter(a => a.status === "draft").length,
      published: articles.filter(a => a.status === "published").length,
      scheduled: articles.filter(a => a.status === "scheduled").length,
      archived: articles.filter(a => a.status === "archived").length,
    }
  }, [articles])

  // Filter articles based on search, filters, status tab, and quick filter
  const filteredArticles = useMemo(() => {
    let result = articles

    // Apply status tab filter
    if (statusTab !== "all") {
      result = result.filter(article => article.status === statusTab)
    }

    // Apply quick filters
    if (quickFilter) {
      switch (quickFilter) {
        case "featured":
          result = result.filter(a => a.is_featured)
          break
        case "pinned":
          result = result.filter(a => a.is_pinned)
          break
        case "recent":
          result = result.filter(a => {
            const created = new Date(a.created_at)
            const now = new Date()
            const daysDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
            return daysDiff <= 7
          })
          break
        case "high-views":
          result = result.filter(a => a.views > 1000)
          break
        case "needs-review":
          result = result.filter(a => a.status === "draft" && new Date(a.created_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
          break
      }
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.author?.name.toLowerCase().includes(searchLower) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          article.category?.toLowerCase().includes(searchLower)
      )
    }

    // Apply column filters
    filters.forEach((filter) => {
      if (filter.id === "status" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        result = result.filter((article) => filterValues.includes(article.status))
      }
      if (filter.id === "category" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        result = result.filter((article) => article.category && filterValues.includes(article.category))
      }
      if (filter.id === "author" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        result = result.filter((article) => article.author_id && filterValues.includes(article.author_id))
      }
    })

    return result
  }, [articles, search, filters, statusTab, quickFilter])

  // Paginate filtered articles
  const paginatedArticles = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredArticles.slice(start, end)
  }, [filteredArticles, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredArticles.length / pageSize))
    setInitialLoading(false)
  }, [filteredArticles.length, pageSize])

  // Handlers
  const handleViewDetails = (article: Article) => {
    setSelectedArticle(article)
    setDetailDrawerOpen(true)
  }

  const handleRowClick = (article: Article) => {
    router.push(`/admin/intelligence/${article.id}`)
  }

  const handleEdit = (article: Article) => {
    router.push(`/admin/intelligence/${article.id}`)
  }

  const handlePublish = async (article: Article) => {
    if (!canPublish) {
      showError("You don't have permission to publish articles")
      return
    }
    setLoading(true)
    showInfo(`Publishing ${article.title}...`)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    showSuccess(`${article.title} has been published`)
  }

  const handleUnpublish = async (article: Article) => {
    if (!canPublish) {
      showError("You don't have permission to unpublish articles")
      return
    }
    setLoading(true)
    showInfo(`Unpublishing ${article.title}...`)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    showSuccess(`${article.title} has been unpublished`)
  }

  const handleDuplicate = (article: Article) => {
    showInfo(`Duplicating ${article.title}...`)
    // TODO: Implement duplicate
  }

  const handleDelete = (article: Article) => {
    setArticleToDelete(article)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!articleToDelete) return
    if (!canDelete) {
      showError("You don't have permission to delete articles")
      return
    }
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    setDeleteConfirmOpen(false)
    showSuccess(`${articleToDelete.title} has been deleted`)
    setArticleToDelete(null)
  }

  const handleCopyLink = (article: Article) => {
    const url = `${window.location.origin}/intelligence/${article.slug}`
    navigator.clipboard.writeText(url)
    showSuccess("Link copied to clipboard")
  }

  // Bulk actions
  const handleBulkPublish = async () => {
    if (selectedArticles.length === 0) return
    if (!canPublish) {
      showError("You don't have permission to publish articles")
      return
    }
    setLoading(true)
    showInfo(`Publishing ${selectedArticles.length} articles...`)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    setSelectedArticles([])
    showSuccess(`${selectedArticles.length} articles published successfully`)
  }

  const handleBulkUnpublish = async () => {
    if (selectedArticles.length === 0) return
    if (!canPublish) {
      showError("You don't have permission to unpublish articles")
      return
    }
    setLoading(true)
    showInfo(`Unpublishing ${selectedArticles.length} articles...`)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setSelectedArticles([])
    showSuccess(`${selectedArticles.length} articles unpublished`)
  }

  const handleBulkDelete = () => {
    if (selectedArticles.length === 0) return
    setArticleToDelete(selectedArticles[0])
    setDeleteConfirmOpen(true)
  }

  const handleBulkArchive = async () => {
    if (selectedArticles.length === 0) return
    setLoading(true)
    showInfo(`Archiving ${selectedArticles.length} articles...`)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setSelectedArticles([])
    showSuccess(`${selectedArticles.length} articles archived`)
  }

  const handleBulkExport = () => {
    if (selectedArticles.length === 0) return
    showInfo(`Exporting ${selectedArticles.length} articles to CSV...`)
    // TODO: Implement CSV export
  }


  const filterConfig = [
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Scheduled", value: "scheduled" },
        { label: "Archived", value: "archived" },
      ],
    },
    {
      columnId: "category",
      title: "Category",
      options: Array.from(new Set(articles.map(a => a.category).filter(Boolean))).map(cat => ({
        label: cat!,
        value: cat!,
      })),
    },
  ]

  const quickFilters = [
    { id: "featured", label: "Featured", count: 0 },
    { id: "pinned", label: "Pinned", count: 0 },
    { id: "recent", label: "Recent", count: 0 },
    { id: "high-views", label: "High Views", count: 0 },
    { id: "needs-review", label: "Needs Review", count: 0 },
  ]

  if (!canView) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">You don't have permission to view articles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="bg-primary/85 text-primary-foreground rounded-md px-4 py-3 mb-3 flex-shrink-0 w-full">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-white" />
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">USDrop Intelligence</h1>
              <p className="text-xs text-white/90 mt-0.5">
                Manage blog articles and content
              </p>
            </div>
          </div>
          {canCreate && (
            <Button
              size="sm"
              onClick={() => router.push("/admin/intelligence/new")}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          )}
        </div>
      </div>

      {/* Status Tabs */}
      <div className="mb-4 flex-shrink-0">
        <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as typeof statusTab)}>
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {statusCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft
              <Badge variant="secondary" className="ml-2">
                {statusCounts.draft}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="published">
              Published
              <Badge variant="secondary" className="ml-2">
                {statusCounts.published}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              Scheduled
              <Badge variant="secondary" className="ml-2">
                {statusCounts.scheduled}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="archived">
              Archived
              <Badge variant="secondary" className="ml-2">
                {statusCounts.archived}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bulk Actions Bar */}
      {selectedArticles.length > 0 && (
        <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between flex-shrink-0">
          <span className="text-sm font-medium">
            {selectedArticles.length} article{selectedArticles.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            {canPublish && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkPublish}
                  disabled={loading}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Publish Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkUnpublish}
                  disabled={loading}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Unpublish Selected
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkArchive}
              disabled={loading}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            {canDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedArticles([])}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <Input
            placeholder="Search articles, authors, tags, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full sm:w-[140px] flex-shrink-0 text-sm"
          />
          {quickFilters.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={quickFilter ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-2"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {quickFilters.map((filter) => (
                  <DropdownMenuItem
                    key={filter.id}
                    onClick={() => setQuickFilter(quickFilter === filter.id ? null : filter.id)}
                    className={cn(
                      "cursor-pointer",
                      quickFilter === filter.id && "bg-accent"
                    )}
                  >
                    <span>{filter.label}</span>
                    {quickFilter === filter.id && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </DropdownMenuItem>
                ))}
                {quickFilter && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setQuickFilter(null)}
                      className="cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filter
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {canCreate && (
            <Button
              onClick={() => router.push("/admin/intelligence/new")}
              size="sm"
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          )}
        </div>
      </div>

      {/* Grid View */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {initialLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader size="sm" />
              <span>Loading articles...</span>
            </div>
          </div>
        ) : paginatedArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">No articles found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedArticles.map((article) => (
              <AdminArticleCard
                key={article.id}
                article={article}
                onEdit={handleEdit}
                onViewDetails={handleViewDetails}
                onDelete={handleDelete}
                onPublish={article.status === "published" ? handleUnpublish : handlePublish}
                onDuplicate={handleDuplicate}
                canEdit={canEdit}
                canDelete={canDelete}
                canPublish={canPublish}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!initialLoading && paginatedArticles.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredArticles.length)} of {filteredArticles.length} articles
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {page} of {pageCount}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article{selectedArticles.length > 1 ? "s" : ""}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedArticles.length > 1 ? `these ${selectedArticles.length} articles` : "this article"}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {articleToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Article:</span> {articleToDelete.title}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Drawer */}
      {selectedArticle && (
        <ArticleDetailDrawer
          open={detailDrawerOpen}
          onOpenChange={setDetailDrawerOpen}
          article={selectedArticle}
          onEdit={handleEdit}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          onDelete={handleDelete}
          onCopyLink={handleCopyLink}
        />
      )}
    </div>
  )
}

