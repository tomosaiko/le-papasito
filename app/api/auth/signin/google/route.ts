import { NextResponse } from "next/server"

export async function GET() {
  // Réponse simple pour éviter les erreurs de redirection
  return new NextResponse(
    JSON.stringify({
      status: "success",
      message: "Google authentication simulation",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}
