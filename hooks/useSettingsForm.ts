import { useState, useEffect, useCallback } from "react"
import { AppSettings, Theme, ViewMode } from "@/types/explorer"
import { useSettings } from "./useSettings"
import { validateSettingsFormData, ValidationError } from "@/lib/validation"

interface SettingsFormData {
  viewMode: ViewMode
  sidebarWidth: number
  selectedTheme: Theme
  dateSyncCreation: boolean
  dateSyncModified: boolean
  dateDiffCreation: boolean
  dateDiffModified: boolean
  dateDiffMaxDays: number
}

interface UseSettingsFormReturn {
  formData: SettingsFormData
  isDirty: boolean
  isSubmitting: boolean
  validationErrors: ValidationError[]
  isValid: boolean
  updateField: <K extends keyof SettingsFormData>(field: K, value: SettingsFormData[K]) => void
  resetForm: () => void
  saveChanges: () => Promise<void>
  hasChanges: () => boolean
  validateForm: () => boolean
  clearValidationErrors: () => void
}

const defaultFormData: SettingsFormData = {
  viewMode: "grid",
  sidebarWidth: 250,
  selectedTheme: "dark",
  dateSyncCreation: true,
  dateSyncModified: true,
  dateDiffCreation: true,
  dateDiffModified: true,
  dateDiffMaxDays: 7,
}

export function useSettingsForm(): UseSettingsFormReturn {
  const { settings, setSetting, loading } = useSettings()
  const [formData, setFormData] = useState<SettingsFormData>(defaultFormData)
  const [originalData, setOriginalData] = useState<SettingsFormData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  // Initialize form data when settings are loaded
  useEffect(() => {
    if (!loading && settings) {
      const newFormData: SettingsFormData = {
        viewMode: settings.viewMode || "grid",
        sidebarWidth: settings.sidebarWidth || 250,
        selectedTheme: settings.theme || "dark",
        dateSyncCreation: settings.dateSyncDefaults?.setCreationDate ?? true,
        dateSyncModified: settings.dateSyncDefaults?.setModifiedDate ?? true,
        dateDiffCreation: settings.dateDifferenceDefaults?.checkCreationDate ?? true,
        dateDiffModified: settings.dateDifferenceDefaults?.checkModifiedDate ?? true,
        dateDiffMaxDays: settings.dateDifferenceDefaults?.maxDifferenceInDays || 7,
      }

      setFormData(newFormData)
      setOriginalData(newFormData)
    }
  }, [settings, loading])

  const updateField = useCallback(
    <K extends keyof SettingsFormData>(field: K, value: SettingsFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }))

      // Clear validation errors for this field when user starts typing
      setValidationErrors((prev) => prev.filter((error) => !error.path.startsWith(field)))
    },
    []
  )

  const hasChanges = useCallback(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData)
  }, [formData, originalData])

  const isDirty = hasChanges()

  const resetForm = useCallback(() => {
    setFormData(originalData)
    setValidationErrors([])
  }, [originalData])

  const validateForm = useCallback(() => {
    const result = validateSettingsFormData(formData)

    if (!result.success) {
      setValidationErrors(result.errors!)
      return false
    }

    setValidationErrors([])
    return true
  }, [formData])

  const clearValidationErrors = useCallback(() => {
    setValidationErrors([])
  }, [])

  const saveChanges = useCallback(async () => {
    if (!hasChanges() || isSubmitting) return

    // Validate form before saving
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Save all settings in parallel for better performance
      const promises = [
        setSetting("viewMode", formData.viewMode),
        setSetting("sidebarWidth", formData.sidebarWidth),
        setSetting("theme", formData.selectedTheme),
        setSetting("dateSyncDefaults", {
          setCreationDate: formData.dateSyncCreation,
          setModifiedDate: formData.dateSyncModified,
        }),
        setSetting("dateDifferenceDefaults", {
          checkCreationDate: formData.dateDiffCreation,
          checkModifiedDate: formData.dateDiffModified,
          maxDifferenceInDays: formData.dateDiffMaxDays,
        }),
      ]

      await Promise.all(promises)

      // Update original data to reflect saved state
      setOriginalData(formData)
    } catch (error) {
      console.error("Failed to save settings:", error)
      // Reset form data on failure to maintain consistency
      resetForm()
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, hasChanges, isSubmitting, setSetting, resetForm])

  return {
    formData,
    isDirty,
    isSubmitting,
    validationErrors,
    isValid: validationErrors.length === 0,
    updateField,
    resetForm,
    saveChanges,
    hasChanges,
    validateForm,
    clearValidationErrors,
  }
}
