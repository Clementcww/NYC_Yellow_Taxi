"use client"

import { Car, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onRefresh: () => void
  isLoading: boolean
}

export function DashboardHeader({ onRefresh, isLoading }: HeaderProps) {
  return (
    <header className="border-b border-[#F7B924]/10 bg-[#0a0a0a]/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">NYC Yellow Taxi</h1>
              <p className="text-xs text-muted-foreground">Analytics Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">Live Data</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-[#F7B924]/20 hover:bg-[#F7B924]/10 hover:border-[#F7B924]/40 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
