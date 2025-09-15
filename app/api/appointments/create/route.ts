import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { fetchSellerAvailability , createGoogleEvent } from "@/lib/googleCalender"
import { getUserSession } from "@/lib/session"

export async function POST(req: NextRequest) {
  const user = await getUserSession() // Buyer must be signed in
  const body = await req.json()
  const { sellerId, scheduledAt } = body

  // Check seller availability
  const busySlots = await fetchSellerAvailability(sellerId)
  if (busySlots.some(slot => scheduledAt >= new Date(slot.start) && scheduledAt < new Date(slot.end))) {
    return NextResponse.json({ error: "Slot not available" }, { status: 400 })
  }

  // Create Google Calendar event
  const googleEvent = await createGoogleEvent(sellerId, user.email!, new Date(scheduledAt))

  // Save appointment in DB
  const appointment = await prisma.appointment.create({
    data: {
      buyerId: user.id,
      sellerId,
      scheduledAt: new Date(scheduledAt),
      googleEventId: googleEvent.id,
      status: "CONFIRMED",
    },
  })

  return NextResponse.json(appointment)
}
