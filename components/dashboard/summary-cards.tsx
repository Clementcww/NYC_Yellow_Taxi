"use client"

import { DollarSign, Car, Route, Coins } from "lucide-react"
import type { DashboardMetrics } from "@/lib/taxi-data"

interface SummaryCardsProps {
  metrics: DashboardMetrics
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value)
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Trips",
      value: formatNumber(metrics.totalTrips),
      icon: Car,
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "Avg Trip Distance",
      value: `${metrics.avgTripDistance.toFixed(2)} mi`,
      icon: Route,
      trend: "-2.1%",
      trendUp: false,
    },
    {
      title: "Average Tip",
      value: formatCurrency(metrics.avgTip),
      icon: Coins,
      trend: "+5.3%",
      trendUp: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="glass-card glass-card-hover rounded-xl p-5 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <p className="text-2xl font-bold text-foreground tracking-tight">{card.value}</p>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium ${card.trendUp ? "text-emerald-400" : "text-red-400"}`}>
                  {card.trend}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F7B924]/10">
              <card.icon className="h-5 w-5 text-[#F7B924]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
