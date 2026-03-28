import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('renders text', () => {
    render(<Badge>healthy</Badge>)
    expect(screen.getByText('healthy')).toBeInTheDocument()
  })

  it('applies success variant class', () => {
    render(<Badge variant="success">OK</Badge>)
    const el = screen.getByText('OK')
    expect(el.className).toMatch(/emerald/)
  })
})
