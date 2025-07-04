import type { Message, Conversation, User } from "@/types"

export const users: User[] = [
  {
    id: "user1",
    name: "Jean Dupont",
    email: "jean@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user",
    verified: true,
    verificationLevel: 2,
    createdAt: new Date("2023-01-15"),
    lastActive: new Date("2023-06-10T14:30:00"),
  },
  {
    id: "escort1",
    name: "Sophie Martin",
    email: "sophie@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "escort",
    verified: true,
    verificationLevel: 3,
    createdAt: new Date("2022-11-05"),
    lastActive: new Date("2023-06-11T09:15:00"),
  },
  {
    id: "escort2",
    name: "Léa Dubois",
    email: "lea@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "escort",
    verified: true,
    verificationLevel: 3,
    createdAt: new Date("2022-12-20"),
    lastActive: new Date("2023-06-10T18:45:00"),
  },
  {
    id: "user2",
    name: "Pierre Lefebvre",
    email: "pierre@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user",
    verified: true,
    verificationLevel: 1,
    createdAt: new Date("2023-02-28"),
    lastActive: new Date("2023-06-09T21:20:00"),
  },
]

export const conversations: Conversation[] = [
  {
    id: "conv1",
    participants: ["user1", "escort1"],
    updatedAt: new Date("2023-06-10T14:30:00"),
  },
  {
    id: "conv2",
    participants: ["user1", "escort2"],
    updatedAt: new Date("2023-06-09T11:45:00"),
  },
  {
    id: "conv3",
    participants: ["user2", "escort1"],
    updatedAt: new Date("2023-06-08T16:20:00"),
  },
]

export const messages: Message[] = [
  {
    id: "msg1",
    conversationId: "conv1",
    senderId: "user1",
    recipientId: "escort1",
    content: "Bonjour, êtes-vous disponible ce weekend?",
    read: true,
    createdAt: new Date("2023-06-10T14:25:00"),
  },
  {
    id: "msg2",
    conversationId: "conv1",
    senderId: "escort1",
    recipientId: "user1",
    content: "Bonjour! Oui, je suis disponible samedi soir. Vous pouvez réserver via mon calendrier.",
    read: true,
    createdAt: new Date("2023-06-10T14:30:00"),
  },
  {
    id: "msg3",
    conversationId: "conv2",
    senderId: "user1",
    recipientId: "escort2",
    content: "Bonjour Léa, j'aimerais en savoir plus sur vos services.",
    read: true,
    createdAt: new Date("2023-06-09T11:40:00"),
  },
  {
    id: "msg4",
    conversationId: "conv2",
    senderId: "escort2",
    recipientId: "user1",
    content:
      "Bonjour! Bien sûr, vous pouvez consulter mon profil pour plus de détails ou me poser des questions spécifiques.",
    read: false,
    createdAt: new Date("2023-06-09T11:45:00"),
  },
  {
    id: "msg5",
    conversationId: "conv3",
    senderId: "user2",
    recipientId: "escort1",
    content: "Bonjour Sophie, quelles sont vos disponibilités pour la semaine prochaine?",
    read: true,
    createdAt: new Date("2023-06-08T16:15:00"),
  },
  {
    id: "msg6",
    conversationId: "conv3",
    senderId: "escort1",
    recipientId: "user2",
    content:
      "Bonjour Pierre! Je suis disponible lundi et mercredi soir. Vous pouvez vérifier mon calendrier pour les horaires exacts.",
    read: true,
    createdAt: new Date("2023-06-08T16:20:00"),
  },
]

export function getUserConversations(
  userId: string,
): (Conversation & { otherParticipant: User; unreadCount: number })[] {
  return conversations
    .filter((conv) => conv.participants.includes(userId))
    .map((conv) => {
      const otherParticipantId = conv.participants.find((id) => id !== userId) || ""
      const otherParticipant = users.find((user) => user.id === otherParticipantId) as User

      const unreadCount = messages.filter(
        (msg) => msg.conversationId === conv.id && msg.recipientId === userId && !msg.read,
      ).length

      const lastMessage = messages
        .filter((msg) => msg.conversationId === conv.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]

      return {
        ...conv,
        lastMessage,
        otherParticipant,
        unreadCount,
      }
    })
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

export function getConversationMessages(conversationId: string): Message[] {
  return messages
    .filter((msg) => msg.conversationId === conversationId)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
}

export function getUserById(userId: string): User | undefined {
  return users.find((user) => user.id === userId)
}
