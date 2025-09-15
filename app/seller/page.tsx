"use client"

import { useEffect, useState } from "react"

export default function SellerDashboard() {
  const [availability, setAvailability] = useState<any>(null)

  useEffect(() => {
    fetch("/api/sellers/availability")
      .then(res => res.json())
      .then(data => setAvailability(data))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Seller Dashboard</h1>
      <pre className="bg-gray-100 p-3 mt-4 rounded">
        {JSON.stringify(availability, null, 2)}
      </pre>
    </div>
  )
}
