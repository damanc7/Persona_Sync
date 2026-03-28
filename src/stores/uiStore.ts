import { create } from 'zustand'

interface UIState {
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

export const useUIStore = create<UIState>((set) => ({
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
