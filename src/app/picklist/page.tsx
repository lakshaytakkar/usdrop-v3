"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import { picklistItems } from "./data/items"
import { 
  Bookmark, 
  Trash2,
  Eye,
  Search,
  MoreVertical
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PicklistPage() {
  const [items, setItems] = useState(picklistItems)
  const [searchQuery, setSearchQuery] = useState("")

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items
    const query = searchQuery.toLowerCase()
    return items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  }, [items, searchQuery])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Topbar />
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-gray-50/50">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Picklist</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Your saved products
                </p>
              </div>

              {/* Search */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Button variant="outline" asChild>
                  <a href="/winning-products">
                    Browse Products
                  </a>
                </Button>
              </div>
            </div>

            {/* Table */}
            {filteredItems.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No products in picklist</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "No products match your search."
                      : "Start adding products to your picklist to save them for later."}
                  </p>
                  {!searchQuery && (
                    <Button asChild>
                      <a href="/winning-products">Browse Products</a>
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Added On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden border flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.title}</p>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {item.source.replace("-", " ")}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.category}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(item.addedDate)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              View
                            </Button>
                            <Button size="sm" className="h-8 text-xs bg-[#95BF47] hover:bg-[#7FA737] text-white border-0">
                              <Image
                                src="/shopify_glyph.svg"
                                alt="Shopify"
                                width={14}
                                height={14}
                                className="mr-1.5"
                              />
                              Import to Shopify
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleRemove(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
