"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { 
  MoreVertical, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Edit,
  Copy,
  ExternalLink,
  Calendar,
  FileText,
  Star,
  Pin,
} from "lucide-react"
import { Article } from "../data/articles"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createAvatar } from "@dicebear/core"
import { glass } from "@dicebear/collection"

interface CreateIntelligenceColumnsProps {
  onViewDetails: (article: Article) => void
  onEdit: (article: Article) => void
  onPublish: (article: Article) => void
  onUnpublish: (article: Article) => void
  onDuplicate: (article: Article) => void
  onDelete: (article: Article) => void
  onCopyLink: (article: Article) => void
}

export function createIntelligenceColumns({
  onViewDetails,
  onEdit,
  onPublish,
  onUnpublish,
  onDuplicate,
  onDelete,
  onCopyLink,
}: CreateIntelligenceColumnsProps): ColumnDef<Article>[] {
  const formatRelativeTime = (date: string | null) => {
    if (!date) return "Never"
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
    return `${Math.floor(diffInSeconds / 31536000)}y ago`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const getDicebearAvatar = (seed: string) => {
    const avatar = createAvatar(glass, {
      seed: seed,
      size: 48,
    })
    return avatar.toDataUri()
  }

  return [
    {
      accessorKey: "title",
      id: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Article" />,
      cell: ({ row }) => {
        const article = row.original
        return (
          <div className="flex items-center gap-3 min-w-0" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
              <Image
                src={getDicebearAvatar(article.id || article.title)}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{article.title}</span>
                {article.is_featured && (
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                )}
                {article.is_pinned && (
                  <Pin className="h-3 w-3 text-blue-500 fill-blue-500 flex-shrink-0" />
                )}
              </div>
              <span className="text-xs text-muted-foreground truncate" title={article.excerpt}>
                {article.excerpt}
              </span>
            </div>
          </div>
        )
      },
      size: 300,
    },
    {
      accessorKey: "author",
      id: "author",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Author" />,
      cell: ({ row }) => {
        const author = row.original.author
        if (!author) return <span className="text-xs text-muted-foreground">—</span>
        return (
          <Link
            href={`/admin/internal-users?userId=${author.id}`}
            className="flex items-center gap-2 hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={author.avatar} />
              <AvatarFallback className="text-xs">
                {author.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium truncate max-w-[120px]">{author.name}</span>
          </Link>
        )
      },
      size: 150,
    },
    {
      accessorKey: "status",
      id: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          published: "default",
          draft: "secondary",
          scheduled: "outline",
          archived: "secondary",
        }
        const icons = {
          published: CheckCircle2,
          draft: FileText,
          scheduled: Calendar,
          archived: XCircle,
        }
        const labels = {
          published: "Published",
          draft: "Draft",
          scheduled: "Scheduled",
          archived: "Archived",
        }
        const Icon = icons[status]
        return (
          <Badge
            variant={variants[status]}
            className="gap-1 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon className="h-3 w-3" />
            {labels[status]}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      size: 110,
    },
    {
      accessorKey: "category",
      id: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => {
        const category = row.original.category
        if (!category) return <span className="text-xs text-muted-foreground">—</span>
        return (
          <Badge variant="outline" className="text-xs" onClick={(e) => e.stopPropagation()}>
            {category}
          </Badge>
        )
      },
      size: 130,
    },
    {
      accessorKey: "views",
      id: "views",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Views" />,
      cell: ({ row }) => (
        <span className="text-xs font-medium" onClick={(e) => e.stopPropagation()}>
          {formatNumber(row.original.views)}
        </span>
      ),
      size: 80,
    },
    {
      accessorKey: "reading_time",
      id: "reading_time",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Reading" />,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
          {row.original.reading_time} min
        </span>
      ),
      size: 80,
    },
    {
      accessorKey: "published_at",
      id: "published_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Published" />,
      cell: ({ row }) => {
        const article = row.original
        const date = article.published_at || article.created_at
        return (
          <span className="text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
            {formatRelativeTime(date)}
          </span>
        )
      },
      size: 100,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const article = row.original

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onViewDetails(article)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(article)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {article.status === "published" ? (
                  <DropdownMenuItem onClick={() => onUnpublish(article)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Unpublish
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onPublish(article)}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Publish
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDuplicate(article)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onCopyLink(article)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.open(`/intelligence/${article.slug}`, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Site
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(article)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      size: 50,
    },
  ]
}

