"use client"

import * as React from "react"
import { CheckSquare2, Square, MinusSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps {
  checked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Checkbox({ 
  checked = false, 
  onCheckedChange, 
  disabled = false,
  className 
}: CheckboxProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled && onCheckedChange) {
      onCheckedChange(checked === "indeterminate" ? true : !checked)
    }
  }

  const Icon = checked === "indeterminate" 
    ? MinusSquare 
    : checked 
    ? CheckSquare2 
    : Square

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked === "indeterminate" ? "mixed" : checked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-sm",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <Icon className={cn(
        "h-4 w-4",
        checked && checked !== "indeterminate" ? "text-primary" : "text-muted-foreground",
        checked === "indeterminate" && "text-primary"
      )} />
    </button>
  )
}