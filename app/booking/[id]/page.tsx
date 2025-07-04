import { BookingPageClient } from "./booking-page-client"

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <BookingPageClient id={id} />
}
