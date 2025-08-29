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
import { CalendarClock, AlertCircle, Loader2, CheckCircle, XCircle } from "lucide-react"

interface DateSyncModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onConfirm: (options: { setCreationDate: boolean; setModifiedDate: boolean }) => void
  isProcessing?: boolean
  processedCount?: number
  successCount?: number
  failureCount?: number
}

export function DateSyncModal({
  open,
  onOpenChange,
  selectedCount,
  onConfirm,
  isProcessing = false,
  processedCount = 0,
  successCount = 0,
  failureCount = 0,
}: DateSyncModalProps) {
  const [setCreationDate, setSetCreationDate] = useState(true)
  const [setModifiedDate, setSetModifiedDate] = useState(true)
  
  const isComplete = isProcessing && processedCount === selectedCount

  const handleConfirm = () => {
    if (!setCreationDate && !setModifiedDate) {
      return // Nothing to do
    }
    
    onConfirm({ setCreationDate, setModifiedDate })
    // Don't close modal - let parent handle it after processing
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Reset for next time
    setSetCreationDate(true)
    setSetModifiedDate(true)
  }
  
  const handleClose = () => {
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
            {isProcessing ? (
              <>
                {isComplete ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin" />
                )}
                {isComplete ? 'Date Sync Complete' : 'Syncing File Dates...'}
              </>
            ) : (
              <>
                <CalendarClock className="h-5 w-5" />
                Sync File Dates with Encoded Date
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isProcessing 
              ? isComplete 
                ? 'File dates have been updated.' 
                : `Processing ${processedCount} of ${selectedCount} files...`
              : 'Set file system dates to match the encoded date from media metadata.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {isProcessing ? (
            <>
              {/* Progress Display */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{Math.round((processedCount / selectedCount) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(processedCount / selectedCount) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Status Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Success</p>
                    <p className="text-sm font-medium">{successCount} files</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Failed</p>
                    <p className="text-sm font-medium">{failureCount} files</p>
                  </div>
                </div>
              </div>
              
              {isComplete && failureCount > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-amber-600 dark:text-amber-400">Some files failed</p>
                    <p>Check the console for details about failed files.</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
        
        <DialogFooter>
          {isProcessing ? (
            isComplete ? (
              <Button onClick={handleClose}>
                Close
              </Button>
            ) : (
              <Button disabled variant="ghost">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </Button>
            )
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={!setCreationDate && !setModifiedDate}
              >
                Apply Changes
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}