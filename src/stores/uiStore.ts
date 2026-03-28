import { create } from 'zustand'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('ps-theme') as Theme | null
  return stored === 'dark' ? 'dark' : 'light'
}

function applyThemeClass(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

interface UIState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  activePage: string
  setActivePage: (page: string) => void
  selectedListingId: string | null
  setSelectedListingId: (id: string | null) => void
  isBidDrawerOpen: boolean
  setBidDrawerOpen: (open: boolean) => void
  activeFilters: Record<string, string[]>
  setFilter: (key: string, values: string[]) => void
  clearFilters: () => void
}

const initialTheme = getInitialTheme()
applyThemeClass(initialTheme)

export const useUIStore = create<UIState>((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    localStorage.setItem('ps-theme', theme)
    applyThemeClass(theme)
    set({ theme })
  },
  toggleTheme: () => set((s) => {
    const next: Theme = s.theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('ps-theme', next)
    applyThemeClass(next)
    return { theme: next }
  }),
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),
  selectedListingId: null,
  setSelectedListingId: (id) => set({ selectedListingId: id }),
  isBidDrawerOpen: false,
  setBidDrawerOpen: (open) => set({ isBidDrawerOpen: open }),
  activeFilters: {},
  setFilter: (key, values) => set((s) => ({ activeFilters: { ...s.activeFilters, [key]: values } })),
  clearFilters: () => set({ activeFilters: {} }),
}))
