"use client"

export interface CryptoPaymentRequest {
  amount: number
  currency: string
  description?: string
  metadata?: Record<string, string>
}

export interface CryptoPaymentResponse {
  success: boolean
  transactionId?: string
  error?: string
  paymentUrl?: string
}

export class CryptoClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl: string = "https://api.crypto-payment.com") {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  async createPayment(request: CryptoPaymentRequest): Promise<CryptoPaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(request)
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Payment creation failed'
        }
      }

      return {
        success: true,
        transactionId: data.transactionId,
        paymentUrl: data.paymentUrl
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async getPaymentStatus(transactionId: string): Promise<CryptoPaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to get payment status'
        }
      }

      return {
        success: true,
        transactionId: data.transactionId
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}
