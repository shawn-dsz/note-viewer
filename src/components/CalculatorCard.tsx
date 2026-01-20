/**
 * Reusable calculator card component
 */

import { ReactNode } from 'react'

interface CalculatorCardProps {
  title: string
  description: string
  icon?: string
  children: ReactNode
}

export function CalculatorCard({ title, description, icon, children }: CalculatorCardProps) {
  return (
    <div className="calculator-card">
      <div className="calculator-card-header">
        {icon && <span className="calculator-card-icon">{icon}</span>}
        <div>
          <h3 className="calculator-card-title">{title}</h3>
          <p className="calculator-card-description">{description}</p>
        </div>
      </div>
      <div className="calculator-card-content">
        {children}
      </div>
    </div>
  )
}
