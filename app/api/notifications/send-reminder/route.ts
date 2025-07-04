import { NextResponse } from "next/server"
import { sendBookingReminder } from "@/lib/notifications/brevo-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userEmail, userName, userPhone, bookingDetails } = body

    if (!userEmail || !bookingDetails) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await sendBookingReminder(userEmail, userName || "Client", userPhone || "", bookingDetails)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error sending reminder:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
