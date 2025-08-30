import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingSectionProps {
  title: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
  contentClassName?: string
  showSeparator?: boolean
}

export function SettingSection({
  title,
  description,
  icon: Icon,
  children,
  className,
  contentClassName,
  showSeparator = true,
}: SettingSectionProps) {
  return (
    <>
      <div className={cn("space-y-4", className)}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <h3 className="text-sm font-semibold">{title}</h3>
          </div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>

        <div className={cn("space-y-3 pl-6", contentClassName)}>{children}</div>
      </div>

      {showSeparator && <Separator />}
    </>
  )
}

interface SettingItemProps {
  label: string
  description?: string
  children: React.ReactNode
  className?: string
  labelClassName?: string
  contentClassName?: string
}

export function SettingItem({
  label,
  description,
  children,
  className,
  labelClassName,
  contentClassName,
}: SettingItemProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="space-y-1">
        <label className={cn("text-sm font-medium leading-none", labelClassName)}>{label}</label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className={contentClassName}>{children}</div>
    </div>
  )
}

interface SettingGroupProps {
  children: React.ReactNode
  className?: string
}

export function SettingGroup({ children, className }: SettingGroupProps) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  )
}

// Specialized component for toggle settings
interface ToggleSettingProps {
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function ToggleSetting({
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: ToggleSettingProps) {
  return (
    <SettingItem label={label} description={description} className={className}>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </SettingItem>
  )
}

// Specialized component for number input settings
interface NumberSettingProps {
  label: string
  description?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  inputClassName?: string
}

export function NumberSetting({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  className,
  inputClassName,
}: NumberSettingProps) {
  return (
    <SettingItem label={label} description={description} className={className}>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        disabled={disabled}
        autoFocus={false}
        tabIndex={-1}
        className={cn("w-24", inputClassName)}
      />
    </SettingItem>
  )
}

// Specialized component for select settings
interface SelectSettingProps {
  label: string
  description?: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  disabled?: boolean
  className?: string
  selectClassName?: string
}

export function SelectSetting({
  label,
  description,
  value,
  onChange,
  options,
  disabled = false,
  className,
  selectClassName,
}: SelectSettingProps) {
  return (
    <SettingItem label={label} description={description} className={className}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoFocus={false}
        tabIndex={-1}
        className={cn(
          "w-32 h-9 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          selectClassName
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </SettingItem>
  )
}

// Import missing components
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
