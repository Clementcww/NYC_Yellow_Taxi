export interface TaxiTrip {
  vendor_id: string
  pickup_datetime: string
  dropoff_datetime: string
  passenger_count: number
  trip_distance: number
  rate_code: string
  store_and_fwd_flag: string
  payment_type: string
  fare_amount: number
  extra: number
  mta_tax: number
  tip_amount: number
  tolls_amount: number
  imp_surcharge: number
  airport_fee: number
  total_amount: number
  pickup_location_id: string
  dropoff_location_id: string
  data_file_year: number
  data_file_month: number
  borough: string
}

export interface DashboardMetrics {
  totalRevenue: number
  totalTrips: number
  avgTripDistance: number
  avgTip: number
  revenueByBorough: { borough: string; revenue: number }[]
  tripsOverTime: { date: string; trips: number; revenue: number }[]
  paymentTypeDistribution: { type: string; count: number; percentage: number }[]
}

// Generate realistic mock data
export function generateMockTaxiData(count = 500): TaxiTrip[] {
  const boroughs = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"]
  const paymentTypes = ["Credit Card", "Cash", "No Charge", "Dispute"]
  const paymentWeights = [0.65, 0.3, 0.03, 0.02]

  const trips: TaxiTrip[] = []
  const baseDate = new Date("2024-01-01")

  for (let i = 0; i < count; i++) {
    const borough = boroughs[Math.floor(Math.random() * boroughs.length)]
    const tripDistance = Math.random() * 15 + 0.5
    const fareAmount = 3.5 + tripDistance * 2.5 + Math.random() * 5
    const tipAmount = Math.random() > 0.2 ? fareAmount * (Math.random() * 0.3 + 0.1) : 0
    const tollsAmount = Math.random() > 0.8 ? Math.random() * 10 + 5 : 0
    const extra = Math.random() > 0.5 ? 1 : 0.5
    const mtaTax = 0.5
    const impSurcharge = 1
    const airportFee = Math.random() > 0.9 ? 1.75 : 0

    // Select payment type based on weights
    const rand = Math.random()
    let paymentType = paymentTypes[0]
    let cumWeight = 0
    for (let j = 0; j < paymentWeights.length; j++) {
      cumWeight += paymentWeights[j]
      if (rand <= cumWeight) {
        paymentType = paymentTypes[j]
        break
      }
    }

    const pickupDate = new Date(baseDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
    const tripDuration = (tripDistance / 15) * 60 + Math.random() * 20
    const dropoffDate = new Date(pickupDate.getTime() + tripDuration * 60 * 1000)

    trips.push({
      vendor_id: Math.random() > 0.5 ? "1" : "2",
      pickup_datetime: pickupDate.toISOString(),
      dropoff_datetime: dropoffDate.toISOString(),
      passenger_count: Math.floor(Math.random() * 4) + 1,
      trip_distance: Math.round(tripDistance * 100) / 100,
      rate_code: "1",
      store_and_fwd_flag: "N",
      payment_type: paymentType,
      fare_amount: Math.round(fareAmount * 100) / 100,
      extra: extra,
      mta_tax: mtaTax,
      tip_amount: Math.round(tipAmount * 100) / 100,
      tolls_amount: Math.round(tollsAmount * 100) / 100,
      imp_surcharge: impSurcharge,
      airport_fee: airportFee,
      total_amount:
        Math.round((fareAmount + tipAmount + tollsAmount + extra + mtaTax + impSurcharge + airportFee) * 100) / 100,
      pickup_location_id: String(Math.floor(Math.random() * 265) + 1),
      dropoff_location_id: String(Math.floor(Math.random() * 265) + 1),
      data_file_year: 2024,
      data_file_month: pickupDate.getMonth() + 1,
      borough: borough,
    })
  }

  return trips.sort((a, b) => new Date(b.pickup_datetime).getTime() - new Date(a.pickup_datetime).getTime())
}

export function calculateMetrics(trips: TaxiTrip[]): DashboardMetrics {
  const totalRevenue = trips.reduce((sum, trip) => sum + trip.total_amount, 0)
  const totalTrips = trips.length
  const avgTripDistance = trips.reduce((sum, trip) => sum + trip.trip_distance, 0) / totalTrips
  const avgTip = trips.reduce((sum, trip) => sum + trip.tip_amount, 0) / totalTrips

  // Revenue by Borough
  const boroughRevenue = trips.reduce(
    (acc, trip) => {
      const borough = trip.borough || "Unknown"
      acc[borough] = (acc[borough] || 0) + trip.total_amount
      return acc
    },
    {} as Record<string, number>,
  )

  const revenueByBorough = Object.entries(boroughRevenue)
    .map(([borough, revenue]) => ({ borough, revenue: Math.round(revenue * 100) / 100 }))
    .sort((a, b) => b.revenue - a.revenue)

  // Trips over time (by day)
  const tripsByDay = trips.reduce(
    (acc, trip) => {
      const date = new Date(trip.pickup_datetime).toISOString().split("T")[0]
      if (!acc[date]) {
        acc[date] = { trips: 0, revenue: 0 }
      }
      acc[date].trips++
      acc[date].revenue += trip.total_amount
      return acc
    },
    {} as Record<string, { trips: number; revenue: number }>,
  )

  const tripsOverTime = Object.entries(tripsByDay)
    .map(([date, data]) => ({
      date,
      trips: data.trips,
      revenue: Math.round(data.revenue * 100) / 100,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Payment type distribution
  // Map numeric payment types to readable names
  const paymentTypeMap: Record<string, string> = {
    "1": "Credit Card",
    "2": "Cash",
    "3": "No Charge",
    "4": "Dispute",
    "5": "Unknown",
    "6": "Voided Trip"
  }

  const paymentCounts = trips.reduce(
    (acc, trip) => {
      // Handle numeric payment types from CSV (e.g., "1", "2")
      const rawType = String(trip.payment_type)
      const typeName = paymentTypeMap[rawType] || rawType || "Unknown"

      acc[typeName] = (acc[typeName] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const paymentTypeDistribution = Object.entries(paymentCounts)
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / totalTrips) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalTrips,
    avgTripDistance: Math.round(avgTripDistance * 100) / 100,
    avgTip: Math.round(avgTip * 100) / 100,
    revenueByBorough,
    tripsOverTime,
    paymentTypeDistribution,
  }
}

export function parseCSV(csvText: string): TaxiTrip[] {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",")

  return lines.slice(1).map((line) => {
    const values = line.split(",")
    const trip: Record<string, string | number> = {}

    headers.forEach((header, index) => {
      const value = values[index]
      const numericFields = [
        "passenger_count",
        "trip_distance",
        "fare_amount",
        "extra",
        "mta_tax",
        "tip_amount",
        "tolls_amount",
        "imp_surcharge",
        "airport_fee",
        "total_amount",
        "data_file_year",
        "data_file_month",
      ]

      if (numericFields.includes(header)) {
        trip[header] = Number.parseFloat(value) || 0
      } else {
        trip[header] = value
      }
    })

    return trip as unknown as TaxiTrip
  })
}
