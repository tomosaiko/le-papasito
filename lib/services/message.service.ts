import { prisma } from '@/lib/db'
import { Message, Conversation, Prisma } from '@prisma/client'

export class MessageService {
  // Créer ou récupérer une conversation entre deux utilisateurs
  static async getOrCreateConversation(user1Id: string, user2Id: string): Promise<Conversation> {
    // Chercher une conversation existante
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            userId: {
              in: [user1Id, user2Id],
            },
          },
        },
      },
      include: {
        participants: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (existingConversation) {
      return existingConversation
    }

    // Créer une nouvelle conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: user1Id },
            { userId: user2Id },
          ],
        },
      },
      include: {
        participants: true,
        messages: true,
      },
    })

    return conversation
  }

  // Envoyer un message
  static async sendMessage(data: {
    conversationId: string
    senderId: string
    recipientId: string
    content: string
    messageType?: string
    attachments?: string[]
  }): Promise<Message> {
    const message = await prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: data.senderId,
        recipientId: data.recipientId,
        content: data.content,
        messageType: data.messageType || 'text',
        attachments: data.attachments || [],
      },
      include: {
        sender: true,
        recipient: true,
      },
    })

    // Mettre à jour la conversation
    await prisma.conversation.update({
      where: { id: data.conversationId },
      data: {
        lastMessage: data.content,
        updatedAt: new Date(),
      },
    })

    return message
  }

  // Obtenir les messages d'une conversation
  static async getConversationMessages(
    conversationId: string,
    options: {
      page?: number
      limit?: number
      beforeId?: string
    } = {}
  ): Promise<{ messages: Message[]; hasMore: boolean }> {
    const { page = 1, limit = 50, beforeId } = options
    const skip = (page - 1) * limit

    const where: Prisma.MessageWhereInput = {
      conversationId,
      ...(beforeId && {
        id: { lt: beforeId },
      }),
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1, // Prendre un message de plus pour vérifier s'il y en a d'autres
      skip,
      include: {
        sender: true,
        recipient: true,
      },
    })

    const hasMore = messages.length > limit
    if (hasMore) {
      messages.pop() // Retirer le message supplémentaire
    }

    return {
      messages: messages.reverse(), // Inverser pour avoir l'ordre chronologique
      hasMore,
    }
  }

  // Obtenir les conversations d'un utilisateur
  static async getUserConversations(
    userId: string,
    options: {
      page?: number
      limit?: number
    } = {}
  ): Promise<{ conversations: any[]; total: number }> {
    const { page = 1, limit = 20 } = options
    const skip = (page - 1) * limit

    const conversationsWithParticipants = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
      include: {
        participants: {
          include: {
            user: {
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
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: true,
          },
        },
      },
    })

    const total = await prisma.conversation.count({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
    })

    // Transformer les données pour inclure l'autre participant et le nombre de messages non lus
    const conversations = await Promise.all(
      conversationsWithParticipants.map(async (conv) => {
        const otherParticipant = conv.participants.find((p) => p.userId !== userId)?.user
        const lastMessage = conv.messages[0]

        // Compter les messages non lus
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            recipientId: userId,
            read: false,
          },
        })

        return {
          ...conv,
          otherParticipant,
          lastMessage,
          unreadCount,
        }
      })
    )

    return { conversations, total }
  }

  // Marquer les messages comme lus
  static async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    await prisma.message.updateMany({
      where: {
        conversationId,
        recipientId: userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    })
  }

  // Supprimer un message
  static async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      throw new Error('Message non trouvé')
    }

    if (message.senderId !== userId) {
      throw new Error('Vous ne pouvez supprimer que vos propres messages')
    }

    await prisma.message.delete({
      where: { id: messageId },
    })
  }

  // Modifier un message
  static async editMessage(
    messageId: string,
    userId: string,
    newContent: string
  ): Promise<Message> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    })

    if (!message) {
      throw new Error('Message non trouvé')
    }

    if (message.senderId !== userId) {
      throw new Error('Vous ne pouvez modifier que vos propres messages')
    }

    return prisma.message.update({
      where: { id: messageId },
      data: {
        content: newContent,
        updatedAt: new Date(),
      },
      include: {
        sender: true,
        recipient: true,
      },
    })
  }

  // Rechercher dans les messages
  static async searchMessages(
    userId: string,
    query: string,
    options: {
      conversationId?: string
      page?: number
      limit?: number
    } = {}
  ): Promise<{ messages: Message[]; total: number }> {
    const { conversationId, page = 1, limit = 20 } = options
    const skip = (page - 1) * limit

    const where: Prisma.MessageWhereInput = {
      content: {
        contains: query,
        mode: 'insensitive',
      },
      OR: [
        { senderId: userId },
        { recipientId: userId },
      ],
      ...(conversationId && { conversationId }),
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          sender: true,
          recipient: true,
          conversation: {
            include: {
              participants: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      }),
      prisma.message.count({ where }),
    ])

    return { messages, total }
  }

  // Obtenir le nombre de messages non lus pour un utilisateur
  static async getUnreadCount(userId: string): Promise<number> {
    return prisma.message.count({
      where: {
        recipientId: userId,
        read: false,
      },
    })
  }

  // Bloquer un utilisateur (empêcher les messages)
  static async blockUser(blockerId: string, blockedId: string): Promise<void> {
    // Cette fonctionnalité nécessiterait une table séparée pour les utilisateurs bloqués
    // Pour l'instant, nous pouvons utiliser une solution simple avec les métadonnées utilisateur
    
    // Ceci est un placeholder - vous devriez implémenter une table "blocked_users"
    console.log(`User ${blockerId} blocked user ${blockedId}`)
  }

  // Vérifier si un utilisateur est bloqué
  static async isUserBlocked(userId1: string, userId2: string): Promise<boolean> {
    // Placeholder - devrait vérifier dans la table "blocked_users"
    return false
  }

  // Obtenir les statistiques de messagerie
  static async getMessageStats(userId: string): Promise<{
    totalConversations: number
    totalMessages: number
    unreadMessages: number
    messagesThisWeek: number
  }> {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const [totalConversations, totalMessages, unreadMessages, messagesThisWeek] = await Promise.all([
      prisma.conversation.count({
        where: {
          participants: {
            some: {
              userId,
            },
          },
        },
      }),
      prisma.message.count({
        where: {
          OR: [
            { senderId: userId },
            { recipientId: userId },
          ],
        },
      }),
      prisma.message.count({
        where: {
          recipientId: userId,
          read: false,
        },
      }),
      prisma.message.count({
        where: {
          OR: [
            { senderId: userId },
            { recipientId: userId },
          ],
          createdAt: {
            gte: weekAgo,
          },
        },
      }),
    ])

    return {
      totalConversations,
      totalMessages,
      unreadMessages,
      messagesThisWeek,
    }
  }

  // Archiver une conversation
  static async archiveConversation(conversationId: string, userId: string): Promise<void> {
    // Vérifier que l'utilisateur fait partie de la conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId,
      },
    })

    if (!participant) {
      throw new Error('Vous ne faites pas partie de cette conversation')
    }

    // Pour l'instant, nous pouvons utiliser une solution simple
    // Dans une implémentation complète, vous pourriez ajouter un champ "archived" à ConversationParticipant
    console.log(`Conversation ${conversationId} archived for user ${userId}`)
  }

  // Supprimer une conversation (pour un utilisateur)
  static async deleteConversation(conversationId: string, userId: string): Promise<void> {
    // Vérifier que l'utilisateur fait partie de la conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId,
      },
    })

    if (!participant) {
      throw new Error('Vous ne faites pas partie de cette conversation')
    }

    // Supprimer la participation (l'autre utilisateur peut toujours voir la conversation)
    await prisma.conversationParticipant.delete({
      where: {
        id: participant.id,
      },
    })

    // Si plus aucun participant, supprimer la conversation entière
    const remainingParticipants = await prisma.conversationParticipant.count({
      where: {
        conversationId,
      },
    })

    if (remainingParticipants === 0) {
      await prisma.conversation.delete({
        where: {
          id: conversationId,
        },
      })
    }
  }
} 