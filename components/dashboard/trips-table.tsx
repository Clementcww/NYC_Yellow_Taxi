"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TaxiTrip } from "@/lib/taxi-data"

interface TripsTableProps {
  trips: TaxiTrip[]
}

const ITEMS_PER_PAGE = 8

export function TripsTable({ trips }: TripsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(trips.length / ITEMS_PER_PAGE)

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedTrips = trips.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-5 border-b border-[#F7B924]/10">
        <h3 className="text-lg font-semibold text-foreground">Recent Trips</h3>
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, trips.length)} of {trips.length} trips
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F7B924]/10 bg-[#171717]/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  Pickup Time
                </div>
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  Borough
                </div>
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Distance
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Fare
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tip
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F7B924]/5">
            {paginatedTrips.map((trip, index) => (
              <tr key={`${trip.pickup_datetime}-${index}`} className="hover:bg-[#F7B924]/5 transition-colors">
                <td className="py-3 px-4">
                  <span className="text-sm font-medium text-foreground">{formatTime(trip.pickup_datetime)}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F7B924]/10 text-[#F7B924]">
                    {trip.borough}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-muted-foreground font-mono">{trip.trip_distance.toFixed(2)} mi</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-foreground font-mono">{formatCurrency(trip.fare_amount)}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span
                    className={`text-sm font-mono ${trip.tip_amount > 0 ? "text-emerald-400" : "text-muted-foreground"}`}
                  >
                    {formatCurrency(trip.tip_amount)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-semibold text-[#F7B924] font-mono">
                    {formatCurrency(trip.total_amount)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-[#F7B924]/10 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="border-[#F7B924]/20 hover:bg-[#F7B924]/10 hover:border-[#F7B924]/40"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="border-[#F7B924]/20 hover:bg-[#F7B924]/10 hover:border-[#F7B924]/40"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
