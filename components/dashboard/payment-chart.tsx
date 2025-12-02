"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { DashboardMetrics } from "@/lib/taxi-data"

interface PaymentChartProps {
  data: DashboardMetrics["paymentTypeDistribution"]
}

const COLORS = ["#F7B924", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6"]

export function PaymentChart({ data }: PaymentChartProps) {
  return (
    <div className="glass-card rounded-xl p-5 h-[380px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Payment Distribution</h3>
        <p className="text-sm text-muted-foreground">Breakdown by payment method</p>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="count"
            nameKey="type"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(23, 23, 23, 0.95)",
              border: "1px solid rgba(247, 185, 36, 0.3)",
              borderRadius: "8px",
              color: "#fafafa",
            }}
            formatter={(value: number, name: string, props) => {
              const item = props.payload
              return [`${value} trips (${item.percentage}%)`, item.type]
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
