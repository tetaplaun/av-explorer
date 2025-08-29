"use client"

import { useState, useEffect } from "react"
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
import { CalendarSearch } from "lucide-react"
import { useSettings } from "@/hooks/useSettings"

interface DateDifferenceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (options: { 
    checkCreationDate: boolean
    checkModifiedDate: boolean
    maxDifferenceInDays: number 
  }) => void
}

export function DateDifferenceModal({
  open,
  onOpenChange,
  onConfirm,
}: DateDifferenceModalProps) {
  const { settings } = useSettings()
  const [checkCreationDate, setCheckCreationDate] = useState(true)
  const [checkModifiedDate, setCheckModifiedDate] = useState(true)
  const [maxDifferenceInDays, setMaxDifferenceInDays] = useState(1)
  
  // Load defaults from settings when modal opens
  useEffect(() => {
    if (open && settings?.dateDifferenceDefaults) {
      setCheckCreationDate(settings.dateDifferenceDefaults.checkCreationDate)
      setCheckModifiedDate(settings.dateDifferenceDefaults.checkModifiedDate)
      setMaxDifferenceInDays(settings.dateDifferenceDefaults.maxDifferenceInDays)
    }
  }, [open, settings])

  const handleConfirm = () => {
    if (!checkCreationDate && !checkModifiedDate) {
      return // Nothing to check
    }
    
    onConfirm({ 
      checkCreationDate, 
      checkModifiedDate, 
      maxDifferenceInDays 
    })
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Reset to defaults for next time
    setCheckCreationDate(true)
    setCheckModifiedDate(true)
    setMaxDifferenceInDays(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarSearch className="h-5 w-5" />
            Select Files with Date Differences
          </DialogTitle>
          <DialogDescription>
            Select files where the filesystem dates differ from the encoded date by more than the specified threshold.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={checkCreationDate}
                onCheckedChange={(checked) => setCheckCreationDate(checked as boolean)}
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Check Creation Date Difference
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={checkModifiedDate}
                onCheckedChange={(checked) => setCheckModifiedDate(checked as boolean)}
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Check Modified Date Difference
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="max-difference" className="text-sm font-medium">
              Maximum Difference (days)
            </label>
            <input
              id="max-difference"
              type="number"
              min="0"
              step="0.5"
              value={maxDifferenceInDays}
              onChange={(e) => setMaxDifferenceInDays(parseFloat(e.target.value) || 0)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              Files with a difference greater than this value will be selected
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!checkCreationDate && !checkModifiedDate}
          >
            Apply Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}