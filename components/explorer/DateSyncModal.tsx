"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarClock, AlertCircle } from "lucide-react"

interface DateSyncModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: (options: { setCreationDate: boolean; setModifiedDate: boolean }) => void
}

export function DateSyncModal({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
}: DateSyncModalProps) {
  const [setCreationDate, setSetCreationDate] = useState(true)
  const [setModifiedDate, setSetModifiedDate] = useState(true)

  const handleConfirm = () => {
    if (!setCreationDate && !setModifiedDate) {
      return // Nothing to do
    }
    
    onConfirm({ setCreationDate, setModifiedDate })
    onOpenChange(false)
    
    // Reset for next time
    setSetCreationDate(true)
    setSetModifiedDate(true)
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Reset for next time
    setSetCreationDate(true)
    setSetModifiedDate(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Sync File Dates with Encoded Date
          </DialogTitle>
          <DialogDescription>
            Set file system dates to match the encoded date from media metadata.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
            <span className="text-sm font-medium">
              {selectedCount} {selectedCount === 1 ? 'file' : 'files'} selected
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={setCreationDate}
                onCheckedChange={(checked) => setSetCreationDate(checked as boolean)}
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Set Creation Date
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={setModifiedDate}
                onCheckedChange={(checked) => setSetModifiedDate(checked as boolean)}
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Set Modified Date
              </label>
            </div>
          </div>
          
          <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-amber-600 dark:text-amber-400">Warning</p>
              <p>This action will permanently modify the file system dates. This operation cannot be undone.</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!setCreationDate && !setModifiedDate}
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}