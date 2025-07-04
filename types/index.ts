// User types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "user" | "escort" | "admin"
  verified: boolean
  verificationLevel: number // 0-3, 3 being fully verified
  createdAt: Date
  lastActive: Date
}

// Message types
export interface Message {
  id: string
  conversationId: string
  senderId: string
  recipientId: string
  content: string
  read: boolean
  createdAt: Date
}

export interface Conversation {
  id: string
  participants: string[] // user IDs
  lastMessage?: Message
  updatedAt: Date
}

// Verification types
export interface VerificationStep {
  id: number
  title: string
  description: string
  completed: boolean
  required: boolean
}

// Booking types
export interface TimeSlot {
  id: string
  startTime: Date
  endTime: Date
  available: boolean
}

export interface Booking {
  id: string
  escortId: string
  userId: string
  date: Date
  startTime: Date
  endTime: Date
  status: "pending" | "confirmed" | "cancelled" | "completed"
  createdAt: Date
  updatedAt: Date
}

// Review types
export interface Review {
  id: string
  escortId: string
  userId: string
  rating: number // 1-5
  comment: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

// Filter types
export interface FilterOption {
  id: string
  label: string
  value: string
}

export interface AdvancedFilters {
  age?: [number, number]
  height?: [number, number]
  weight?: [number, number]
  priceRange?: [number, number]
  services?: string[]
  languages?: string[]
  availability?: string[]
  location?: string
  verified?: boolean
}
