import { User } from '@prisma/client'

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export interface SendEmailResult {
  success: boolean
  message: string
  messageId?: string
}

/**
 * Service de notifications email
 * Gère l'envoi d'emails pour vérification, notifications, etc.
 */
export class EmailService {
  private static readonly FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@lepapasito.com'
  private static readonly BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  /**
   * Envoyer un email de vérification
   */
  static async sendVerificationEmail(user: User, verificationToken: string): Promise<SendEmailResult> {
    const verificationUrl = `${this.BASE_URL}/api/auth/verify-email?token=${verificationToken}`
    
    const template: EmailTemplate = {
      to: user.email,
      subject: 'Vérifiez votre adresse email - Le Papasito',
      html: this.getVerificationEmailTemplate(user.name, verificationUrl),
      text: this.getVerificationEmailText(user.name, verificationUrl)
    }

    return await this.sendEmail(template)
  }

  /**
   * Envoyer un email de réinitialisation de mot de passe
   */
  static async sendPasswordResetEmail(user: User, resetToken: string): Promise<SendEmailResult> {
    const resetUrl = `${this.BASE_URL}/reset-password?token=${resetToken}`
    
    const template: EmailTemplate = {
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe - Le Papasito',
      html: this.getPasswordResetEmailTemplate(user.name, resetUrl),
      text: this.getPasswordResetEmailText(user.name, resetUrl)
    }

    return await this.sendEmail(template)
  }

  /**
   * Envoyer un email de bienvenue
   */
  static async sendWelcomeEmail(user: User): Promise<SendEmailResult> {
    const template: EmailTemplate = {
      to: user.email,
      subject: 'Bienvenue sur Le Papasito !',
      html: this.getWelcomeEmailTemplate(user.name),
      text: this.getWelcomeEmailText(user.name)
    }

    return await this.sendEmail(template)
  }

  /**
   * Envoyer un email de notification générique
   */
  static async sendNotificationEmail(
    user: User, 
    subject: string, 
    message: string
  ): Promise<SendEmailResult> {
    const template: EmailTemplate = {
      to: user.email,
      subject,
      html: this.getNotificationEmailTemplate(user.name, subject, message),
      text: message
    }

    return await this.sendEmail(template)
  }

  /**
   * Envoyer un email (méthode principale)
   */
  private static async sendEmail(template: EmailTemplate): Promise<SendEmailResult> {
    try {
      // Pour l'instant, on simule l'envoi (log dans la console)
      // En production, on utilisera Brevo, SendGrid, ou un autre service
      
      console.log('📧 [EmailService] Envoi email simulé:')
      console.log(`   To: ${template.to}`)
      console.log(`   Subject: ${template.subject}`)
      console.log(`   HTML: ${template.html.substring(0, 200)}...`)
      
      // Simulation d'un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return {
        success: true,
        message: 'Email envoyé avec succès',
        messageId: `sim_${Date.now()}`
      }
    } catch (error) {
      console.error('[EmailService] Erreur envoi email:', error)
      return {
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email'
      }
    }
  }

  /**
   * Template HTML pour email de vérification
   */
  private static getVerificationEmailTemplate(name: string, verificationUrl: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Vérification de votre email</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff6b6b; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .button { display: inline-block; background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Le Papasito</h1>
            </div>
            <div class="content">
                <h2>Bonjour ${name},</h2>
                <p>Merci de vous être inscrit(e) sur Le Papasito !</p>
                <p>Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
                <div style="text-align: center;">
                    <a href="${verificationUrl}" class="button">Vérifier mon email</a>
                </div>
                <p>Ou copiez ce lien dans votre navigateur :</p>
                <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                <p><strong>Ce lien expire dans 24 heures.</strong></p>
            </div>
            <div class="footer">
                <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
                <p>© 2024 Le Papasito. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>`
  }

  /**
   * Template texte pour email de vérification
   */
  private static getVerificationEmailText(name: string, verificationUrl: string): string {
    return `
Bonjour ${name},

Merci de vous être inscrit(e) sur Le Papasito !

Pour activer votre compte, cliquez sur ce lien :
${verificationUrl}

Ce lien expire dans 24 heures.

Si vous n'avez pas créé de compte, ignorez cet email.

© 2024 Le Papasito. Tous droits réservés.
    `
  }

  /**
   * Template HTML pour réinitialisation de mot de passe
   */
  private static getPasswordResetEmailTemplate(name: string, resetUrl: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Réinitialisation de votre mot de passe</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff6b6b; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .button { display: inline-block; background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Le Papasito</h1>
            </div>
            <div class="content">
                <h2>Bonjour ${name},</h2>
                <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
                </div>
                <p>Ou copiez ce lien dans votre navigateur :</p>
                <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                <p><strong>Ce lien expire dans 1 heure.</strong></p>
            </div>
            <div class="footer">
                <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
                <p>© 2024 Le Papasito. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>`
  }

  /**
   * Template texte pour réinitialisation de mot de passe
   */
  private static getPasswordResetEmailText(name: string, resetUrl: string): string {
    return `
Bonjour ${name},

Vous avez demandé à réinitialiser votre mot de passe.

Cliquez sur ce lien pour choisir un nouveau mot de passe :
${resetUrl}

Ce lien expire dans 1 heure.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

© 2024 Le Papasito. Tous droits réservés.
    `
  }

  /**
   * Template HTML pour email de bienvenue
   */
  private static getWelcomeEmailTemplate(name: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Bienvenue sur Le Papasito</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff6b6b; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .button { display: inline-block; background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Bienvenue sur Le Papasito !</h1>
            </div>
            <div class="content">
                <h2>Bonjour ${name},</h2>
                <p>Votre compte a été créé avec succès ! Bienvenue dans la communauté Le Papasito.</p>
                <p>Vous pouvez maintenant :</p>
                <ul>
                    <li>Créer votre profil</li>
                    <li>Rechercher des prestations</li>
                    <li>Prendre des rendez-vous</li>
                    <li>Échanger avec d'autres membres</li>
                </ul>
                <div style="text-align: center;">
                    <a href="${this.BASE_URL}/dashboard" class="button">Accéder à mon tableau de bord</a>
                </div>
            </div>
            <div class="footer">
                <p>Besoin d'aide ? Contactez-nous à support@lepapasito.com</p>
                <p>© 2024 Le Papasito. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>`
  }

  /**
   * Template texte pour email de bienvenue
   */
  private static getWelcomeEmailText(name: string): string {
    return `
Bonjour ${name},

Votre compte a été créé avec succès ! Bienvenue dans la communauté Le Papasito.

Vous pouvez maintenant :
- Créer votre profil
- Rechercher des prestations
- Prendre des rendez-vous
- Échanger avec d'autres membres

Accédez à votre tableau de bord : ${this.BASE_URL}/dashboard

Besoin d'aide ? Contactez-nous à support@lepapasito.com

© 2024 Le Papasito. Tous droits réservés.
    `
  }

  /**
   * Template HTML pour notification générique
   */
  private static getNotificationEmailTemplate(name: string, subject: string, message: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff6b6b; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Le Papasito</h1>
            </div>
            <div class="content">
                <h2>Bonjour ${name},</h2>
                <p>${message}</p>
            </div>
            <div class="footer">
                <p>© 2024 Le Papasito. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>`
  }
} 