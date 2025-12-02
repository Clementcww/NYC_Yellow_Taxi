"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { DashboardMetrics } from "@/lib/taxi-data"

interface RevenueChartProps {
  data: DashboardMetrics["revenueByBorough"]
}

const COLORS = ["#6b7280"]

export function RevenueChart({ data }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="glass-card rounded-xl p-5 h-[380px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Revenue by Borough</h3>
        <p className="text-sm text-muted-foreground">Total earnings distribution</p>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
          <XAxis
            type="number"
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis type="category" dataKey="borough" stroke="#666" fontSize={12} width={90} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(23, 23, 23, 0.95)",
              border: "1px solid rgba(247, 185, 36, 0.3)",
              borderRadius: "8px",
              color: "#F7B924",
            }}
            formatter={(value: number) => [formatCurrency(value), "Revenue"]}
            cursor={{ fill: "rgba(247, 185, 36, 0.1)" }}
            itemStyle={{ color: "#F7B924" }}
            labelStyle={{ color: "#F7B924" }}
          />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
