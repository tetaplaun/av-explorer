import { useState, useEffect, useCallback } from 'react'
import { AppSettings } from '@/types/explorer'

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const allSettings = await window.electronAPI.settings.getAll()
      setSettings(allSettings)
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const setSetting = useCallback(async <K extends keyof AppSettings>(
    key: K, 
    value: AppSettings[K]
  ) => {
    try {
      await window.electronAPI.settings.set(key, value)
      setSettings(prev => prev ? { ...prev, [key]: value } : null)
    } catch (error) {
      console.error(`Failed to set setting ${key}:`, error)
    }
  }, [])

  const getSetting = useCallback(<K extends keyof AppSettings>(
    key: K
  ): AppSettings[K] | undefined => {
    return settings?.[key]
  }, [settings])

  return { 
    settings, 
    loading, 
    setSetting, 
    getSetting,
    refreshSettings: loadSettings
  }
}