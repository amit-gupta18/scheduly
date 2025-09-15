"use client"

import { useEffect, useState } from "react"

export default function BuyerPage() {
  const [sellers, setSellers] = useState<any[]>([])
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null)
  const [slots, setSlots] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/sellers/list") // create this API if not done
      .then(res => res.json())
      .then(data => setSellers(data))
  }, [])

  const fetchSlots = (sellerId: string) => {
    setSelectedSeller(sellerId)
    fetch(`/api/sellers/availability?sellerId=${sellerId}`)
      .then(res => res.json())
      .then(data => setSlots(data))
  }

  const bookSlot = async (slot: string) => {
    await fetch("/api/appointments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sellerId: selectedSeller, scheduledAt: slot }),
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Buyer Page</h1>

      <h2 className="mt-4 font-semibold">Sellers</h2>
      <ul>
        {sellers.map((s) => (
          <li key={s.id}>
            <button className="underline" onClick={() => fetchSlots(s.id)}>
              {s.name}
            </button>
          </li>
        ))}
      </ul>

      {slots.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold">Available Slots</h2>
          {slots.map((slot) => (
            <button
              key={slot}
              className="block bg-blue-500 text-white p-2 my-2 rounded"
              onClick={() => bookSlot(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
