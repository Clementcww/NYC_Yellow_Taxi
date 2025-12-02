"use client"

import { useState, useEffect, useCallback } from "react"
import { calculateMetrics, type TaxiTrip, type DashboardMetrics, parseCSV } from "@/lib/taxi-data"
import { DashboardHeader } from "@/components/dashboard/header"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { TripsChart } from "@/components/dashboard/trips-chart"
import { PaymentChart } from "@/components/dashboard/payment-chart"
import { TripsTable } from "@/components/dashboard/trips-table"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [trips, setTrips] = useState<TaxiTrip[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Fetch all CSV files in parallel
      const [brooklynRes, manhattanRes, queensRes] = await Promise.all([
        fetch("/brooklyn_trips.csv"),
        fetch("/manhattan_trips.csv"),
        fetch("/queens_trips.csv")
      ])

      if (!brooklynRes.ok || !manhattanRes.ok || !queensRes.ok) {
        throw new Error("Failed to fetch one or more CSV data files")
      }

      const brooklynText = await brooklynRes.text()
      const manhattanText = await manhattanRes.text()
      const queensText = await queensRes.text()

      const brooklynData = parseCSV(brooklynText).map((trip) => ({ ...trip, borough: "Brooklyn" }))
      const manhattanData = parseCSV(manhattanText).map((trip) => ({ ...trip, borough: "Manhattan" }))
      const queensData = parseCSV(queensText).map((trip) => ({ ...trip, borough: "Queens" }))

      // Combine the datasets
      const combinedData = [...brooklynData, ...manhattanData, ...queensData]

      setTrips(combinedData)
      setMetrics(calculateMetrics(combinedData))
    } catch (error) {
      console.error("Error loading taxi data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (isLoading && !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-[#F7B924] animate-spin" />
          <p className="text-muted-foreground text-sm">Loading taxi data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#F7B924]/5 via-transparent to-transparent pointer-events-none" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#F7B924]/5 rounded-full blur-[120px] pointer-events-none" />

      <DashboardHeader onRefresh={loadData} isLoading={isLoading} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Summary Cards */}
        {metrics && <SummaryCards metrics={metrics} />}

        {/* Charts Row */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RevenueChart data={metrics.revenueByBorough} />
            <TripsChart data={metrics.tripsOverTime} />
            <PaymentChart data={metrics.paymentTypeDistribution} />
          </div>
        )}

        {/* Trips Table */}
        <TripsTable trips={trips} />

        {/* Footer */}
        <footer className="pt-6 pb-4 border-t border-[#F7B924]/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>NYC Yellow Taxi Analytics Dashboard</p>
            <p className="font-mono text-xs">Last updated: {new Date().toLocaleString()}</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
