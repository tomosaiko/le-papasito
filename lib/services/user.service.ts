import { prisma } from '@/lib/db'
import { User, UserRole, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

export class UserService {
  // Créer un nouvel utilisateur
  static async createUser(data: {
    email: string
    name: string
    password?: string
    role?: UserRole
    avatar?: string
  }): Promise<User> {
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 12) : undefined

    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role || UserRole.USER,
        avatar: data.avatar,
      },
    })
  }

  // Trouver un utilisateur par email
  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        escortProfile: true,
        subscription: true,
      },
    })
  }

  // Trouver un utilisateur par ID
  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        escortProfile: {
          include: {
            photos: true,
            videos: true,
          },
        },
        subscription: true,
        verifications: true,
      },
    })
  }

  // Vérifier le mot de passe
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }

  // Mettre à jour le dernier accès
  static async updateLastActive(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() },
    })
  }

  // Mettre à jour le profil utilisateur
  static async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })
  }

  // Vérifier un utilisateur
  static async verifyUser(userId: string, level: number = 1): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        verified: true,
        verificationLevel: level,
      },
    })
  }

  // Obtenir les utilisateurs avec pagination
  static async getUsers(options: {
    page?: number
    limit?: number
    role?: UserRole
    verified?: boolean
    search?: string
  } = {}): Promise<{ users: User[]; total: number }> {
    const { page = 1, limit = 10, role, verified, search } = options
    const skip = (page - 1) * limit

    const where: Prisma.UserWhereInput = {}

    if (role) where.role = role
    if (verified !== undefined) where.verified = verified
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          escortProfile: true,
          subscription: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    return { users, total }
  }

  // Obtenir les statistiques utilisateur
  static async getUserStats(userId: string): Promise<{
    totalBookings: number
    totalEarnings: number
    averageRating: number
    totalReviews: number
  }> {
    const [bookings, earnings, reviews] = await Promise.all([
      prisma.booking.count({
        where: {
          OR: [{ clientId: userId }, { escortId: userId }],
          status: 'COMPLETED',
        },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'payment',
          status: 'completed',
        },
        _sum: { amount: true },
      }),
      prisma.review.aggregate({
        where: { targetId: userId },
        _avg: { rating: true },
        _count: { id: true },
      }),
    ])

    return {
      totalBookings: bookings,
      totalEarnings: earnings._sum.amount || 0,
      averageRating: reviews._avg.rating || 0,
      totalReviews: reviews._count.id,
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    })
  }

  // Recherche avancée d'escorts
  static async searchEscorts(filters: {
    city?: string
    minAge?: number
    maxAge?: number
    services?: string[]
    languages?: string[]
    verified?: boolean
    available?: boolean
    minPrice?: number
    maxPrice?: number
    sortBy?: 'rating' | 'price' | 'recent' | 'popular'
    page?: number
    limit?: number
  }): Promise<{ escorts: any[]; total: number }> {
    const {
      city,
      minAge,
      maxAge,
      services,
      languages,
      verified,
      available,
      minPrice,
      maxPrice,
      sortBy = 'recent',
      page = 1,
      limit = 10,
    } = filters

    const skip = (page - 1) * limit

    const where: Prisma.UserWhereInput = {
      role: UserRole.ESCORT,
      escortProfile: {
        isActive: true,
        ...(city && { city: { contains: city, mode: 'insensitive' } }),
        ...(minAge && { age: { gte: minAge } }),
        ...(maxAge && { age: { lte: maxAge } }),
        ...(available !== undefined && { isAvailable: available }),
        ...(minPrice && { hourlyRate: { gte: minPrice } }),
        ...(maxPrice && { hourlyRate: { lte: maxPrice } }),
        ...(services?.length && {
          services: { hasSome: services },
        }),
        ...(languages?.length && {
          languages: { hasSome: languages },
        }),
      },
      ...(verified !== undefined && { verified }),
    }

    let orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: 'desc' }

    switch (sortBy) {
      case 'price':
        orderBy = { escortProfile: { hourlyRate: 'asc' } }
        break
      case 'popular':
        orderBy = { escortProfile: { totalViews: 'desc' } }
        break
      case 'rating':
        // Note: This would require a computed field or separate query
        orderBy = { createdAt: 'desc' }
        break
    }

    const [escorts, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          escortProfile: {
            include: {
              photos: {
                where: { isMain: true },
                take: 1,
              },
            },
          },
          reviewsReceived: {
            select: { rating: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    // Calculate average rating for each escort
    const escortsWithRating = escorts.map((escort) => {
      const ratings = escort.reviewsReceived.map((r) => r.rating)
      const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0

      return {
        ...escort,
        averageRating,
        totalReviews: ratings.length,
      }
    })

    return { escorts: escortsWithRating, total }
  }
} 