import { render, screen } from '@testing-library/react'
import { CustomTooltip } from '../../components/Tooltip'
import { PRIMARY_METRIC } from '@/utils/constants'

describe('CustomTooltip', () => {
  it('renders nothing when inactive', () => {
    const { container } = render(<CustomTooltip active={false} metric={PRIMARY_METRIC} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when no payload provided', () => {
    const { container } = render(<CustomTooltip active metric={PRIMARY_METRIC} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders tooltip content when active and payload provided', () => {
    const payload = [{ value: 123 }]
    render(<CustomTooltip active payload={payload} label="Week 1" metric={PRIMARY_METRIC} />)

    expect(screen.getByText('Week 1')).toBeInTheDocument()
    expect(screen.getByText(PRIMARY_METRIC.label)).toBeInTheDocument()
    expect(screen.getByText(PRIMARY_METRIC.formatValue(123))).toBeInTheDocument()
  })

  it('applies correct color style to dot', () => {
    const payload = [{ value: 99 }]
    const { container } = render(<CustomTooltip active payload={payload} metric={PRIMARY_METRIC} />)
    const colorDot = container.querySelector('div.w-3.h-3')
    expect(colorDot).toHaveStyle({ backgroundColor: PRIMARY_METRIC.color })
  })
})
