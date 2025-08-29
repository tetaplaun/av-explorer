"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Theme } from "@/types/explorer"
import { useSettings } from "@/hooks/useSettings"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, setSetting } = useSettings()
  const [theme, setThemeState] = useState<Theme>('dark')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  // Initialize theme from settings
  useEffect(() => {
    if (settings?.theme) {
      setThemeState(settings.theme)
    }
  }, [settings?.theme])

  // Handle theme changes
  useEffect(() => {
    const applyTheme = (isDark: boolean) => {
      const root = document.documentElement
      if (isDark) {
        root.classList.add('dark')
        root.classList.remove('light')
        setResolvedTheme('dark')
      } else {
        root.classList.remove('dark')
        root.classList.add('light')
        setResolvedTheme('light')
      }
    }

    if (theme === 'system') {
      // Check system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mediaQuery.matches)

      // Listen for system theme changes
      const handleChange = (e: MediaQueryListEvent) => applyTheme(e.matches)
      mediaQuery.addEventListener('change', handleChange)
      
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      // Apply explicit theme
      applyTheme(theme === 'dark')
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    setSetting('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}