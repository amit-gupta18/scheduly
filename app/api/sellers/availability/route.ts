import { NextRequest, NextResponse } from "next/server"
import { fetchSellerAvailability } from "@/lib/googleCalender"
import { getUserSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const user = await getUserSession() 
  const User = await prisma.user.findUnique({
    where: {
      id: user.id
    }
  })
  if (User.role !== "SELLER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const busySlots = await fetchSellerAvailability(user.id)
  return NextResponse.json({ busySlots })
}
