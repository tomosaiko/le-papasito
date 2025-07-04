import type { Booking, TimeSlot } from "@/types"

// Generate time slots for a given date
export function generateTimeSlots(date: Date, escortId: string): TimeSlot[] {
  const slots: TimeSlot[] = []
  const startHour = 10 // 10 AM
  const endHour = 23 // 11 PM

  // Random unavailable hours for demo purposes
  const unavailableHours = [13, 14, 19, 20] // 1-2 PM and 7-8 PM are unavailable

  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = new Date(date)
    startTime.setHours(hour, 0, 0, 0)

    const endTime = new Date(date)
    endTime.setHours(hour + 1, 0, 0, 0)

    slots.push({
      id: `${escortId}-${date.toISOString().split("T")[0]}-${hour}`,
      startTime,
      endTime,
      available: !unavailableHours.includes(hour),
    })
  }

  return slots
}

// Sample bookings data
export const bookings: Booking[] = [
  {
    id: "booking1",
    escortId: "escort1",
    userId: "user1",
    date: new Date("2023-06-15"),
    startTime: new Date("2023-06-15T18:00:00"),
    endTime: new Date("2023-06-15T19:00:00"),
    status: "confirmed",
    createdAt: new Date("2023-06-10T14:35:00"),
    updatedAt: new Date("2023-06-10T15:00:00"),
  },
  {
    id: "booking2",
    escortId: "escort2",
    userId: "user1",
    date: new Date("2023-06-20"),
    startTime: new Date("2023-06-20T21:00:00"),
    endTime: new Date("2023-06-20T22:00:00"),
    status: "pending",
    createdAt: new Date("2023-06-11T09:20:00"),
    updatedAt: new Date("2023-06-11T09:20:00"),
  },
  {
    id: "booking3",
    escortId: "escort1",
    userId: "user2",
    date: new Date("2023-06-12"),
    startTime: new Date("2023-06-12T20:00:00"),
    endTime: new Date("2023-06-12T21:00:00"),
    status: "completed",
    createdAt: new Date("2023-06-08T16:25:00"),
    updatedAt: new Date("2023-06-12T21:15:00"),
  },
]

export function getUserBookings(userId: string): Booking[] {
  return bookings.filter((booking) => booking.userId === userId).sort((a, b) => a.date.getTime() - b.date.getTime())
}

export function getEscortBookings(escortId: string): Booking[] {
  return bookings.filter((booking) => booking.escortId === escortId).sort((a, b) => a.date.getTime() - b.date.getTime())
}
