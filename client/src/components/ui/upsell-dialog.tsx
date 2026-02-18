

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface UpsellDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function UpsellDialog({ isOpen, onClose }: UpsellDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade</DialogTitle>
          <DialogDescription>
            Please contact your POC
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

