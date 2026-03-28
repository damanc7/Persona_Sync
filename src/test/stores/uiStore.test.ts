import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '@/stores/uiStore'

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      activePage: 'dashboard',
      selectedListingId: null,
      isBidDrawerOpen: false,
      activeFilters: {},
    })
  })

  it('sets active page', () => {
    useUIStore.getState().setActivePage('profile')
    expect(useUIStore.getState().activePage).toBe('profile')
  })

  it('sets and clears filters', () => {
    useUIStore.getState().setFilter('status', ['pending', 'approved'])
    expect(useUIStore.getState().activeFilters.status).toEqual(['pending', 'approved'])
    useUIStore.getState().clearFilters()
    expect(useUIStore.getState().activeFilters).toEqual({})
  })

  it('manages bid drawer', () => {
    useUIStore.getState().setBidDrawerOpen(true)
    expect(useUIStore.getState().isBidDrawerOpen).toBe(true)
    useUIStore.getState().setSelectedListingId('listing-1')
    expect(useUIStore.getState().selectedListingId).toBe('listing-1')
  })
})
