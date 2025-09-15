import { google } from "googleapis"
// import { prisma } from "./prisma"
import {prisma} from '@/lib/prisma'

export const fetchSellerAvailability = async (sellerId: string) => {
  const account = await prisma.account.findFirst({
    where: { userId: sellerId, provider: "google" },
  })
  if (!account?.refresh_token) throw new Error("Seller not connected")

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  auth.setCredentials({ refresh_token: account.refresh_token })

  const calendar = google.calendar({ version: "v3", auth })

  const now = new Date()
  const end = new Date()
  end.setDate(end.getDate() + 7)

  const freebusy = await calendar.freebusy.query({
    requestBody: {
      timeMin: now.toISOString(),
      timeMax: end.toISOString(),
      items: [{ id: "primary" }],
    },
  })

  return freebusy.data.calendars?.primary?.busy || []
}

export const createGoogleEvent = async (sellerId: string, buyerEmail: string, scheduledAt: Date) => {
  const account = await prisma.account.findFirst({
    where: { userId: sellerId, provider: "google" },
  })
  if (!account?.refresh_token) throw new Error("Missing credentials")

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  auth.setCredentials({ refresh_token: account.refresh_token })

  const calendar = google.calendar({ version: "v3", auth })

  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: "Appointment with Buyer",
      start: { dateTime: scheduledAt.toISOString() },
      end: { dateTime: new Date(scheduledAt.getTime() + 30 * 60 * 1000).toISOString() },
      attendees: [{ email: buyerEmail }],
      conferenceData: { createRequest: { requestId: `meet-${Date.now()}` } },
    },
    conferenceDataVersion: 1,
  })

  return event.data
}
