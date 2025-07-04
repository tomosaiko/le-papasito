// Client Brevo moderne utilisant l'API REST directement
export interface BrevoEmailRequest {
  to: { email: string; name?: string }[]
  subject: string
  htmlContent?: string
  textContent?: string
  templateId?: number
  params?: Record<string, any>
  sender?: { email: string; name?: string }
}

export interface BrevoSMSRequest {
  recipient: string
  content: string
  sender?: string
}

export interface BrevoResponse {
  success: boolean
  messageId?: string
  error?: string
}

class BrevoClient {
  private apiKey: string
  private baseUrl = "https://api.brevo.com/v3"

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.BREVO_API_KEY || ""
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error("Brevo API key is not configured")
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Brevo API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  // Envoyer un email
  async sendEmail(request: BrevoEmailRequest): Promise<BrevoResponse> {
    try {
      const emailData = {
        to: request.to,
        subject: request.subject,
        htmlContent: request.htmlContent,
        textContent: request.textContent,
        templateId: request.templateId,
        params: request.params,
        sender: request.sender || {
          email: "noreply@lepapasito.com",
          name: "Le Papasito",
        },
      }

      const result = await this.makeRequest("/smtp/email", emailData)
      
      return {
        success: true,
        messageId: result.messageId,
      }
    } catch (error) {
      console.error("Error sending email:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Envoyer un SMS
  async sendSMS(request: BrevoSMSRequest): Promise<BrevoResponse> {
    try {
      const smsData = {
        sender: request.sender || "LePapasito",
        recipient: request.recipient,
        content: request.content,
      }

      const result = await this.makeRequest("/transactionalSMS/sms", smsData)
      
      return {
        success: true,
        messageId: result.reference,
      }
    } catch (error) {
      console.error("Error sending SMS:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}

// Instance singleton
const brevoClient = new BrevoClient()

// Fonctions helper pour maintenir la compatibilité
export const sendEmail = async (
  to: { email: string; name?: string }[],
  subject: string,
  htmlContent: string,
  templateId?: number,
  params?: Record<string, any>
): Promise<BrevoResponse> => {
  return brevoClient.sendEmail({
    to,
    subject,
    htmlContent,
    templateId,
    params,
  })
}

export const sendSMS = async (
  phoneNumber: string,
  content: string,
  sender = "LePapasito"
): Promise<BrevoResponse> => {
  return brevoClient.sendSMS({
    recipient: phoneNumber,
    content,
    sender,
  })
}

// Fonctions spécialisées pour les notifications
export const sendBookingNotification = async (
  userEmail: string,
  userName: string,
  userPhone: string,
  bookingDetails: any
): Promise<BrevoResponse> => {
  // Envoyer un email de confirmation
  const emailResult = await sendEmail(
    [{ email: userEmail, name: userName }],
    "Confirmation de votre réservation - Le Papasito",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">Confirmation de réservation</h1>
      <p>Bonjour ${userName},</p>
      <p>Votre réservation a été confirmée pour le <strong>${new Date(bookingDetails.date).toLocaleDateString("fr-FR")}</strong> à <strong>${bookingDetails.timeSlot.startTime}</strong>.</p>
      <p>Durée: <strong>${bookingDetails.duration} heure(s)</strong></p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      <p>Merci de votre confiance!</p>
      <p style="color: #666;"><em>L'équipe Le Papasito</em></p>
    </div>
    `
  )

  // Envoyer un SMS de confirmation si un numéro de téléphone est fourni
  if (userPhone && emailResult.success) {
    await sendSMS(
      userPhone,
      `Le Papasito: Votre réservation du ${new Date(bookingDetails.date).toLocaleDateString("fr-FR")} à ${bookingDetails.timeSlot.startTime} est confirmée. À bientôt!`
    )
  }

  return emailResult
}

export const sendBookingReminder = async (
  userEmail: string,
  userName: string,
  userPhone: string,
  bookingDetails: any
): Promise<BrevoResponse> => {
  // Envoyer un email de rappel
  const emailResult = await sendEmail(
    [{ email: userEmail, name: userName }],
    "Rappel de votre rendez-vous - Le Papasito",
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">Rappel de rendez-vous</h1>
      <p>Bonjour ${userName},</p>
      <p>Nous vous rappelons votre rendez-vous prévu pour demain, le <strong>${new Date(bookingDetails.date).toLocaleDateString("fr-FR")}</strong> à <strong>${bookingDetails.timeSlot.startTime}</strong>.</p>
      <p>Durée: <strong>${bookingDetails.duration} heure(s)</strong></p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      <p>À très bientôt!</p>
      <p style="color: #666;"><em>L'équipe Le Papasito</em></p>
    </div>
    `
  )

  // Envoyer un SMS de rappel si un numéro de téléphone est fourni
  if (userPhone && emailResult.success) {
    await sendSMS(
      userPhone,
      `Le Papasito: Rappel de votre RDV demain ${new Date(bookingDetails.date).toLocaleDateString("fr-FR")} à ${bookingDetails.timeSlot.startTime}. À bientôt!`
    )
  }

  return emailResult
}

export default brevoClient
