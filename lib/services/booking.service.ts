import { prisma } from '@/lib/db'
import { Booking, BookingStatus, Prisma } from '@prisma/client'

export class BookingService {
  // Créer une nouvelle réservation
  static async createBooking(data: {
    clientId: string
    escortId: string
    date: Date
    startTime: Date
    endTime: Date
    duration: number
    totalAmount: number
    notes?: string
  }): Promise<Booking> {
    // Vérifier la disponibilité
    const isAvailable = await this.checkAvailability(
      data.escortId,
      data.date,
      data.startTime,
      data.endTime
    )

    if (!isAvailable) {
      throw new Error('Ce créneau n\'est pas disponible')
    }

    // Calculer la commission (ex: 15%)
    const commission = data.totalAmount * 0.15

    const booking = await prisma.booking.create({
      data: {
        clientId: data.clientId,
        escortId: data.escortId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        totalAmount: data.totalAmount,
        commission,
        notes: data.notes,
        status: BookingStatus.PENDING,
      },
      include: {
        client: true,
        escort: {
          include: {
            escortProfile: true,
          },
        },
      },
    })

    // Marquer le créneau comme non disponible
    await this.markTimeSlotUnavailable(data.escortId, data.date, data.startTime, data.endTime)

    return booking
  }

  // Vérifier la disponibilité d'un créneau
  static async checkAvailability(
    escortId: string,
    date: Date,
    startTime: Date,
    endTime: Date
  ): Promise<boolean> {
    // Vérifier s'il n'y a pas de réservation confirmée qui chevauche
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        escortId,
        date: {
          equals: date,
        },
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
        },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    })

    return !conflictingBooking
  }

  // Marquer un créneau comme non disponible
  static async markTimeSlotUnavailable(
    escortId: string,
    date: Date,
    startTime: Date,
    endTime: Date
  ): Promise<void> {
    await prisma.availability.upsert({
      where: {
        userId_date_startTime: {
          userId: escortId,
          date,
          startTime,
        },
      },
      update: {
        available: false,
        endTime,
      },
      create: {
        userId: escortId,
        date,
        startTime,
        endTime,
        available: false,
      },
    })
  }

  // Obtenir une réservation par ID
  static async getBookingById(id: string): Promise<Booking | null> {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        client: true,
        escort: {
          include: {
            escortProfile: true,
          },
        },
        payment: true,
      },
    })
  }

  // Obtenir les réservations d'un utilisateur
  static async getUserBookings(
    userId: string,
    role: 'client' | 'escort' = 'client',
    options: {
      status?: BookingStatus
      page?: number
      limit?: number
    } = {}
  ): Promise<{ bookings: Booking[]; total: number }> {
    const { status, page = 1, limit = 10 } = options
    const skip = (page - 1) * limit

    const where: Prisma.BookingWhereInput = {
      ...(role === 'client' ? { clientId: userId } : { escortId: userId }),
      ...(status && { status }),
    }

    const include = {
      client: true,
      escort: {
        include: {
          escortProfile: {
            include: {
              photos: {
                where: { isMain: true },
                take: 1,
              },
            },
          },
        },
      },
      payment: true,
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include,
      }),
      prisma.booking.count({ where }),
    ])

    return { bookings, total }
  }

  // Mettre à jour le statut d'une réservation
  static async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
    updatedBy?: string
  ): Promise<Booking> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!booking) {
      throw new Error('Réservation non trouvée')
    }

    // Si on annule la réservation, libérer le créneau
    if (status === BookingStatus.CANCELLED) {
      await this.markTimeSlotAvailable(
        booking.escortId,
        booking.date,
        booking.startTime,
        booking.endTime
      )
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        client: true,
        escort: {
          include: {
            escortProfile: true,
          },
        },
      },
    })
  }

  // Libérer un créneau
  static async markTimeSlotAvailable(
    escortId: string,
    date: Date,
    startTime: Date,
    endTime: Date
  ): Promise<void> {
    await prisma.availability.upsert({
      where: {
        userId_date_startTime: {
          userId: escortId,
          date,
          startTime,
        },
      },
      update: {
        available: true,
        endTime,
      },
      create: {
        userId: escortId,
        date,
        startTime,
        endTime,
        available: true,
      },
    })
  }

  // Obtenir les créneaux disponibles pour un escort
  static async getAvailableSlots(
    escortId: string,
    date: Date
  ): Promise<{ startTime: Date; endTime: Date; available: boolean }[]> {
    // Générer les créneaux par défaut (10h-23h par tranches d'1h)
    const slots = []
    const startHour = 10
    const endHour = 23

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = new Date(date)
      startTime.setHours(hour, 0, 0, 0)

      const endTime = new Date(date)
      endTime.setHours(hour + 1, 0, 0, 0)

      // Vérifier si le créneau est disponible
      const isAvailable = await this.checkAvailability(escortId, date, startTime, endTime)

      slots.push({
        startTime,
        endTime,
        available: isAvailable,
      })
    }

    return slots
  }

  // Obtenir les statistiques de réservation
  static async getBookingStats(
    userId: string,
    role: 'client' | 'escort' = 'escort'
  ): Promise<{
    total: number
    pending: number
    confirmed: number
    completed: number
    cancelled: number
    totalEarnings?: number
  }> {
    const where: Prisma.BookingWhereInput = {
      ...(role === 'client' ? { clientId: userId } : { escortId: userId }),
    }

    const [total, pending, confirmed, completed, cancelled, earnings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.count({ where: { ...where, status: BookingStatus.PENDING } }),
      prisma.booking.count({ where: { ...where, status: BookingStatus.CONFIRMED } }),
      prisma.booking.count({ where: { ...where, status: BookingStatus.COMPLETED } }),
      prisma.booking.count({ where: { ...where, status: BookingStatus.CANCELLED } }),
      role === 'escort'
        ? prisma.booking.aggregate({
            where: { ...where, status: BookingStatus.COMPLETED },
            _sum: { totalAmount: true },
          })
        : null,
    ])

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      ...(earnings && { totalEarnings: earnings._sum.totalAmount || 0 }),
    }
  }

  // Annuler une réservation
  static async cancelBooking(
    bookingId: string,
    cancelledBy: string,
    reason?: string
  ): Promise<Booking> {
    const booking = await this.getBookingById(bookingId)

    if (!booking) {
      throw new Error('Réservation non trouvée')
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new Error('Impossible d\'annuler une réservation terminée')
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new Error('Cette réservation est déjà annulée')
    }

    // Vérifier les permissions
    if (booking.clientId !== cancelledBy && booking.escortId !== cancelledBy) {
      throw new Error('Vous n\'avez pas l\'autorisation d\'annuler cette réservation')
    }

    return this.updateBookingStatus(bookingId, BookingStatus.CANCELLED)
  }

  // Confirmer une réservation
  static async confirmBooking(bookingId: string, confirmedBy: string): Promise<Booking> {
    const booking = await this.getBookingById(bookingId)

    if (!booking) {
      throw new Error('Réservation non trouvée')
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new Error('Seules les réservations en attente peuvent être confirmées')
    }

    // Seul l'escort peut confirmer la réservation
    if (booking.escortId !== confirmedBy) {
      throw new Error('Seul l\'escort peut confirmer cette réservation')
    }

    return this.updateBookingStatus(bookingId, BookingStatus.CONFIRMED)
  }

  // Marquer une réservation comme terminée
  static async completeBooking(bookingId: string): Promise<Booking> {
    const booking = await this.getBookingById(bookingId)

    if (!booking) {
      throw new Error('Réservation non trouvée')
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new Error('Seules les réservations confirmées peuvent être marquées comme terminées')
    }

    // Vérifier que la date/heure de fin est passée
    const now = new Date()
    if (booking.endTime > now) {
      throw new Error('La réservation ne peut être marquée comme terminée qu\'après l\'heure de fin')
    }

    const updatedBooking = await this.updateBookingStatus(bookingId, BookingStatus.COMPLETED)

    // Mettre à jour les statistiques de l'escort
    await prisma.escortProfile.update({
      where: { userId: booking.escortId },
      data: {
        totalBookings: {
          increment: 1,
        },
      },
    })

    return updatedBooking
  }

  // Rechercher des réservations avec filtres
  static async searchBookings(filters: {
    clientId?: string
    escortId?: string
    status?: BookingStatus
    dateFrom?: Date
    dateTo?: Date
    minAmount?: number
    maxAmount?: number
    page?: number
    limit?: number
  }): Promise<{ bookings: Booking[]; total: number }> {
    const {
      clientId,
      escortId,
      status,
      dateFrom,
      dateTo,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
    } = filters

    const skip = (page - 1) * limit

    const where: Prisma.BookingWhereInput = {
      ...(clientId && { clientId }),
      ...(escortId && { escortId }),
      ...(status && { status }),
      ...(dateFrom && { date: { gte: dateFrom } }),
      ...(dateTo && { date: { lte: dateTo } }),
      ...(minAmount && { totalAmount: { gte: minAmount } }),
      ...(maxAmount && { totalAmount: { lte: maxAmount } }),
    }

    const include = {
      client: true,
      escort: {
        include: {
          escortProfile: true,
        },
      },
      payment: true,
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include,
      }),
      prisma.booking.count({ where }),
    ])

    return { bookings, total }
  }
} 