import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  children,
  onSubmit,
  submitLabel = "Save",
  isSubmitting = false,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold font-heading">{title}</DialogTitle>
          <DialogDescription className="sr-only">Fill in the form below</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          {children}
        </div>
        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            data-testid="button-form-cancel"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
            data-testid="button-form-submit"
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
