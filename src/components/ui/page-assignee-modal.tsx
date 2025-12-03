"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, X } from "lucide-react"
import { getAvatarUrl } from "@/lib/utils/avatar"

interface InternalUser {
  id: string
  name: string
  email: string
}

interface PageAssigneeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  internalUsers: InternalUser[]
  assignedOwner: string | null
  assignedMembers: string[]
  onSave: (owner: string | null, members: string[]) => void
}

export function PageAssigneeModal({
  open,
  onOpenChange,
  internalUsers,
  assignedOwner,
  assignedMembers,
  onSave,
}: PageAssigneeModalProps) {
  const [tempOwner, setTempOwner] = useState<string | null>(assignedOwner)
  const [tempMembers, setTempMembers] = useState<string[]>(assignedMembers)
  const [memberSearch, setMemberSearch] = useState("")

  // Reset temp values when modal opens
  useEffect(() => {
    if (open) {
      setTempOwner(assignedOwner)
      setTempMembers([...assignedMembers])
      setMemberSearch("")
    }
  }, [open, assignedOwner, assignedMembers])

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

  const handleAddMember = (memberId: string) => {
    if (!tempMembers.includes(memberId)) {
      setTempMembers([...tempMembers, memberId])
    }
    setMemberSearch("")
  }
  
  const handleRemoveMember = (memberId: string) => {
    setTempMembers(tempMembers.filter(id => id !== memberId))
  }

  const handleSave = () => {
    onSave(tempOwner, tempMembers)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTempOwner(assignedOwner)
    setTempMembers([...assignedMembers])
    setMemberSearch("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  <Search className="mr-2 h-4 w-4" />
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
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                        aria-label={`Remove ${member.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

