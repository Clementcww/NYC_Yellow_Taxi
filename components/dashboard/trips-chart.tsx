"use client"

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from "recharts"
import type { DashboardMetrics } from "@/lib/taxi-data"

interface TripsChartProps {
  data: DashboardMetrics["tripsOverTime"]
}

export function TripsChart({ data }: TripsChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="glass-card rounded-xl p-5 h-[380px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Trips Over Time</h3>
        <p className="text-sm text-muted-foreground">Daily trip volume and revenue</p>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <ComposedChart data={data} margin={{ left: 0, right: 10 }}>
          <defs>
            <linearGradient id="tripsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F7B924" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F7B924" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis dataKey="date" stroke="#666" fontSize={11} tickFormatter={formatDate} interval="preserveStartEnd" />
          <YAxis yAxisId="left" stroke="#666" fontSize={12} tickFormatter={(value) => value} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(23, 23, 23, 0.95)",
              border: "1px solid rgba(247, 185, 36, 0.3)",
              borderRadius: "8px",
              color: "#F7B924",
            }}
            labelFormatter={formatDate}
            formatter={(value: number, name: string) => {
              if (name === "revenue") {
                return [`$${value.toLocaleString()}`, "Revenue"]
              }
              return [value, "Trips"]
            }}
            itemStyle={{ color: "#F7B924" }}
            labelStyle={{ color: "#F7B924" }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="trips"
            stroke="#F7B924"
            fill="url(#tripsGradient)"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
