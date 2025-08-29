import { z } from "zod"

// Base validation schemas
export const viewModeSchema = z.enum(["grid", "list", "details"] as const)
export const themeSchema = z.enum(["light", "dark", "system"] as const)

// Settings validation schemas
export const dateSyncDefaultsSchema = z.object({
  setCreationDate: z.boolean(),
  setModifiedDate: z.boolean(),
})

export const dateDifferenceDefaultsSchema = z.object({
  checkCreationDate: z.boolean(),
  checkModifiedDate: z.boolean(),
  maxDifferenceInDays: z.number().min(1).max(365),
})

export const windowBoundsSchema = z.object({
  width: z.number().min(400).max(3840),
  height: z.number().min(300).max(2160),
  x: z.number().optional(),
  y: z.number().optional(),
})

// Main settings schema
export const appSettingsSchema = z.object({
  viewMode: viewModeSchema,
  lastPath: z.string().optional(),
  windowBounds: windowBoundsSchema.optional(),
  sidebarWidth: z.number().min(150).max(500),
  theme: themeSchema,
  dateSyncDefaults: dateSyncDefaultsSchema,
  dateDifferenceDefaults: dateDifferenceDefaultsSchema,
})

// Form data validation schemas
export const settingsFormDataSchema = z.object({
  viewMode: viewModeSchema,
  sidebarWidth: z.number().min(150).max(500),
  selectedTheme: themeSchema,
  dateSyncCreation: z.boolean(),
  dateSyncModified: z.boolean(),
  dateDiffCreation: z.boolean(),
  dateDiffModified: z.boolean(),
  dateDiffMaxDays: z.number().min(1).max(365),
})

// File operation schemas
export const fileOperationResultSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  path: z.string(),
})

// Utility functions for validation
export function validateSettings(settings: unknown) {
  try {
    return {
      success: true,
      data: appSettingsSchema.parse(settings),
    } as const
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
          code: err.code,
        })),
      } as const
    }
    return {
      success: false,
      errors: [{ path: "unknown", message: "Invalid settings format", code: "custom" }],
    } as const
  }
}

export function validateSettingsFormData(formData: unknown) {
  try {
    return {
      success: true,
      data: settingsFormDataSchema.parse(formData),
    } as const
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
          code: err.code,
        })),
      } as const
    }
    return {
      success: false,
      errors: [{ path: "unknown", message: "Invalid form data format", code: "custom" }],
    } as const
  }
}

export function validateFileOperationResult(result: unknown) {
  try {
    return {
      success: true,
      data: fileOperationResultSchema.parse(result),
    } as const
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
          code: err.code,
        })),
      } as const
    }
    return {
      success: false,
      errors: [{ path: "unknown", message: "Invalid file operation result", code: "custom" }],
    } as const
  }
}

// Type inference helpers
export type ValidatedSettings = z.infer<typeof appSettingsSchema>
export type ValidatedSettingsFormData = z.infer<typeof settingsFormDataSchema>
export type ValidatedFileOperationResult = z.infer<typeof fileOperationResultSchema>

// Validation error types
export interface ValidationError {
  path: string
  message: string
  code: string
}

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: ValidationError[]
}
