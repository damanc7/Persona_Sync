import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmptyState } from '@/components/ui/EmptyState'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No items" description="Nothing here yet" />)
    expect(screen.getByText('No items')).toBeInTheDocument()
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
  })

  it('calls action onClick', () => {
    const onClick = vi.fn()
    render(<EmptyState title="Empty" action={{ label: 'Add one', onClick }} />)
    fireEvent.click(screen.getByText('Add one'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
