import SibApiV3Sdk from "sib-api-v3-sdk"

// Configuration du client Brevo (Sendinblue)
const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKey = defaultClient.authentications["api-key"]
apiKey.apiKey = process.env.BREVO_API_KEY || ""

// Client pour les emails
const emailApi = new SibApiV3Sdk.TransactionalEmailsApi()

// Client pour les SMS
const smsApi = new SibApiV3Sdk.TransactionalSMSApi()

// Envoyer un email
export const sendEmail = async (
  to: { email: string; name?: string }[],
  subject: string,
  htmlContent: string,
  templateId?: number,
  params?: Record<string, any>,
) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    sendSmtpEmail.to = to
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = htmlContent

    if (templateId) {
      sendSmtpEmail.templateId = templateId
      if (params) {
        sendSmtpEmail.params = params
      }
    }

    const result = await emailApi.sendTransacEmail(sendSmtpEmail)
    return result
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

// Envoyer un SMS
export const sendSMS = async (phoneNumber: string, content: string, sender = "LePapasito") => {
  try {
    const sendTransacSms = new SibApiV3Sdk.SendTransacSms()

    sendTransacSms.sender = sender
    sendTransacSms.recipient = phoneNumber
    sendTransacSms.content = content

    const result = await smsApi.sendTransacSms(sendTransacSms)
    return result
  } catch (error) {
    console.error("Error sending SMS:", error)
    throw error
  }
}

// Envoyer une notification de réservation
export const sendBookingNotification = async (
  userEmail: string,
  userName: string,
  userPhone: string,
  bookingDetails: any,
) => {
  // Envoyer un email de confirmation
  await sendEmail(
    [{ email: userEmail, name: userName }],
    "Confirmation de votre réservation - Le Papasito",
    `
    <h1>Confirmation de réservation</h1>
    <p>Bonjour ${userName},</p>
    <p>Votre réservation a été confirmée pour le ${new Date(bookingDetails.date).toLocaleDateString("fr-FR")} à ${bookingDetails.timeSlot.startTime}.</p>
    <p>Durée: ${bookingDetails.duration} heure(s)</p>
    <p>Merci de votre confiance!</p>
    <p>L'équipe Le Papasito</p>
    `,
    // Vous pouvez utiliser un template ID si vous en avez configuré un dans Brevo
    // 1, // templateId
    // { booking_date: bookingDetails.date, booking_time: bookingDetails.timeSlot.startTime }
  )

  // Envoyer un SMS de confirmation si un numéro de téléphone est fourni
  if (userPhone) {
    await sendSMS(
      userPhone,
      `Le Papasito: Votre réservation du ${new Date(bookingDetails.date).toLocaleDateString("fr-FR")} à ${bookingDetails.timeSlot.startTime} est confirmée. À bientôt!`,
    )
  }

  return { success: true }
}

// Envoyer un rappel de rendez-vous
export const sendBookingReminder = async (
  userEmail: string,
  userName: string,
  userPhone: string,
  bookingDetails: any,
) => {
  // Envoyer un email de rappel
  await sendEmail(
    [{ email: userEmail, name: userName }],
    "Rappel de votre rendez-vous - Le Papasito",
    `
    <h1>Rappel de rendez-vous</h1>
    <p>Bonjour ${userName},</p>
    <p>Nous vous rappelons votre rendez-vous prévu pour demain, le ${new Date(bookingDetails.date).toLocaleDateString("fr-FR")} à ${bookingDetails.timeSlot.startTime}.</p>
    <p>Durée: ${bookingDetails.duration} heure(s)</p>
    <p>À très bientôt!</p>
    <p>L'équipe Le Papasito</p>
    `,
    // 2, // templateId pour le rappel
    // { booking_date: bookingDetails.date, booking_time: bookingDetails.timeSlot.startTime }
  )

  // Envoyer un SMS de rappel si un numéro de téléphone est fourni
  if (userPhone) {
    await sendSMS(
      userPhone,
      `Le Papasito: Rappel de votre RDV demain ${new Date(bookingDetails.date).toLocaleDateString("fr-FR")} à ${bookingDetails.timeSlot.startTime}. À bientôt!`,
    )
  }

  return { success: true }
}
