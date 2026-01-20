/**
 * Calculators page with interactive operations management tools
 */

import { useState } from 'react'
import { CalculatorCard } from '../components/CalculatorCard'

/**
 * Capacity Calculator Component
 * Calculates production capacity based on cycle time and operating schedule
 */
function CapacityCalculator() {
  const [cycleTime, setCycleTime] = useState('60')
  const [shiftsPerDay, setShiftsPerDay] = useState('2')
  const [hoursPerShift, setHoursPerShift] = useState('8')
  const [operatingDays, setOperatingDays] = useState('250')

  // Parse inputs, default to 0 if invalid
  const cycleTimeNum = parseFloat(cycleTime) || 0
  const shiftsNum = parseFloat(shiftsPerDay) || 0
  const hoursNum = parseFloat(hoursPerShift) || 0
  const daysNum = parseFloat(operatingDays) || 0

  // Calculate capacities
  const hourlyCapacity = cycleTimeNum > 0 ? Math.floor(3600 / cycleTimeNum) : 0
  const dailyCapacity = hourlyCapacity * shiftsNum * hoursNum
  const annualCapacity = dailyCapacity * daysNum

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US')
  }

  return (
    <CalculatorCard
      title="Capacity Calculator"
      description="Calculate production capacity based on cycle time and operating schedule"
      icon="🏭"
    >
      <div className="calculator-input-grid">
        <div className="calculator-input-group">
          <label htmlFor="cycleTime">Cycle Time (seconds/unit)</label>
          <input
            id="cycleTime"
            type="number"
            min="1"
            step="1"
            value={cycleTime}
            onChange={(e) => setCycleTime(e.target.value)}
            placeholder="60"
          />
        </div>

        <div className="calculator-input-group">
          <label htmlFor="shiftsPerDay">Shifts per Day</label>
          <input
            id="shiftsPerDay"
            type="number"
            min="1"
            max="24"
            step="1"
            value={shiftsPerDay}
            onChange={(e) => setShiftsPerDay(e.target.value)}
            placeholder="2"
          />
        </div>

        <div className="calculator-input-group">
          <label htmlFor="hoursPerShift">Hours per Shift</label>
          <input
            id="hoursPerShift"
            type="number"
            min="1"
            max="24"
            step="0.5"
            value={hoursPerShift}
            onChange={(e) => setHoursPerShift(e.target.value)}
            placeholder="8"
          />
        </div>

        <div className="calculator-input-group">
          <label htmlFor="operatingDays">Operating Days per Year</label>
          <input
            id="operatingDays"
            type="number"
            min="1"
            max="365"
            step="1"
            value={operatingDays}
            onChange={(e) => setOperatingDays(e.target.value)}
            placeholder="250"
          />
        </div>
      </div>

      <div className="calculator-results">
        <h4>Results</h4>
        <div className="calculator-result-item">
          <span>Hourly Capacity:</span>
          <strong>{formatNumber(hourlyCapacity)} units/hour</strong>
        </div>
        <div className="calculator-result-item">
          <span>Daily Capacity:</span>
          <strong>{formatNumber(dailyCapacity)} units/day</strong>
        </div>
        <div className="calculator-result-item calculator-result-highlight">
          <span>Annual Capacity:</span>
          <strong>{formatNumber(annualCapacity)} units/year</strong>
        </div>
      </div>

      {cycleTimeNum > 0 && (
        <div className="calculator-formula">
          <p><strong>Formula:</strong></p>
          <code>Hourly = 3600 ÷ {cycleTimeNum} = {formatNumber(hourlyCapacity)}</code>
          <code>Daily = {formatNumber(hourlyCapacity)} × {shiftsNum} × {hoursNum} = {formatNumber(dailyCapacity)}</code>
          <code>Annual = {formatNumber(dailyCapacity)} × {daysNum} = {formatNumber(annualCapacity)}</code>
        </div>
      )}
    </CalculatorCard>
  )
}

/**
 * Main Calculators Page
 */
export function CalculatorsPage() {
  return (
    <div className="calculators-page">
      <h1>Operations Calculators</h1>
      <p>Interactive tools for operations management calculations</p>

      <section className="calculator-grid">
        <CapacityCalculator />

        {/* Future calculators can be added here:
          <EOQCalculator />
          <BatchSizeCalculator />
          <WaitingLineCalculator />
          <ThroughputCalculator />
        */}
      </section>

      <div className="calculator-note">
        <p>
          <strong>Note:</strong> These calculations represent theoretical steady-state capacity.
          Actual capacity may be lower due to downtime, maintenance, changeovers, and other operational factors.
        </p>
      </div>
    </div>
  )
}
