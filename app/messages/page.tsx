"use client"

import { useState } from "react"
import { ChatList } from "@/components/messaging/chat-list"
import { ChatWindow } from "@/components/messaging/chat-window"
import { EmptyChat } from "@/components/messaging/empty-chat"

// Données de test pour les conversations
const mockConversations = [
  {
    id: "1",
    recipientId: "user1",
    recipientName: "Sophia",
    recipientAvatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153696_original.jpg-yvmHBbYNTvuWGXdcpYJN2RKpgECY4X.jpeg",
    lastMessage: "À quelle heure êtes-vous disponible demain ?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unreadCount: 2,
    isVerified: true,
    isOnline: true,
  },
  {
    id: "2",
    recipientId: "user2",
    recipientName: "Isabella",
    recipientAvatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153702_original.jpg-YQv55LkyBEK0tFiVykOS2hcNtuLipE.jpeg",
    lastMessage: "Merci pour votre réservation, j'ai hâte de vous rencontrer !",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unreadCount: 0,
    isVerified: true,
    isOnline: false,
  },
  {
    id: "3",
    recipientId: "user3",
    recipientName: "Emma",
    recipientAvatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153698_original.jpg-dKxdTJFpF6wiafozWCwq5zd6ozyglL.jpeg",
    lastMessage: "Bonjour, je suis disponible ce soir si vous êtes intéressé.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    isVerified: false,
    isOnline: true,
  },
  {
    id: "4",
    recipientId: "user4",
    recipientName: "Camille",
    recipientAvatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153708_original.jpg-fC3XDJapRrwlHDxdLdP12ySnQ7JTWL.jpeg",
    lastMessage: "Voici mon adresse pour notre rendez-vous de demain.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 0,
    isVerified: true,
    isOnline: false,
  },
  {
    id: "5",
    recipientId: "user5",
    recipientName: "Charlotte",
    recipientAvatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153704_original.jpg-XaS5TT5dzbtkRFO3Sbuz77UmaqsWZ8.jpeg",
    lastMessage: "Je vous confirme notre rendez-vous pour vendredi à 20h.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    unreadCount: 0,
    isVerified: false,
    isOnline: false,
  },
]

// Données de test pour les messages
const mockMessages = {
  "1": [
    {
      id: "msg1",
      senderId: "user1",
      text: "Bonjour, je suis intéressé par vos services. Êtes-vous disponible demain soir ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true,
    },
    {
      id: "msg2",
      senderId: "currentUser",
      text: "Bonjour ! Oui, je suis disponible demain soir à partir de 19h. Quelle heure vous conviendrait ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: true,
    },
    {
      id: "msg3",
      senderId: "user1",
      text: "20h serait parfait pour moi. Où est-ce que je peux vous rencontrer ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      isRead: true,
    },
    {
      id: "msg4",
      senderId: "currentUser",
      text: "20h me convient. Je vous envoie l'adresse par message privé. Avez-vous des préférences particulières pour notre rencontre ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      isRead: true,
    },
    {
      id: "msg5",
      senderId: "user1",
      text: "À quelle heure êtes-vous disponible demain ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: false,
    },
    {
      id: "msg6",
      senderId: "user1",
      text: "J'aimerais aussi savoir si vous proposez des massages ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
      isRead: false,
      attachments: [
        {
          type: "image",
          url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153696_original.jpg-yvmHBbYNTvuWGXdcpYJN2RKpgECY4X.jpeg",
        },
      ],
    },
  ],
  "2": [
    {
      id: "msg7",
      senderId: "currentUser",
      text: "Bonjour Isabella, je souhaiterais réserver une séance pour vendredi prochain à 19h. Est-ce possible ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: true,
    },
    {
      id: "msg8",
      senderId: "user2",
      text: "Bonjour ! Oui, vendredi 19h est disponible. Je note votre réservation. Avez-vous des demandes particulières ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true,
    },
    {
      id: "msg9",
      senderId: "currentUser",
      text: "Parfait ! J'aimerais un massage relaxant suivi d'un moment plus intime si possible.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      isRead: true,
    },
    {
      id: "msg10",
      senderId: "user2",
      text: "Merci pour votre réservation, j'ai hâte de vous rencontrer !",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: true,
    },
  ],
}

export default function MessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const currentUserId = "currentUser" // Simuler l'ID de l'utilisateur actuel

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId)
  }

  const handleSendMessage = (text: string, attachments?: File[]) => {
    console.log("Message envoyé:", text, attachments)
    // Ici, vous implémenteriez la logique pour envoyer le message au backend
  }

  const activeConversation = mockConversations.find((conv) => conv.id === activeConversationId)
  const activeMessages = activeConversationId ? mockMessages[activeConversationId] || [] : []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)] min-h-[500px] bg-background border rounded-lg overflow-hidden">
        <div className="md:col-span-1">
          <ChatList
            conversations={mockConversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3 border-l border-border">
          {activeConversation ? (
            <ChatWindow
              recipientId={activeConversation.recipientId}
              recipientName={activeConversation.recipientName}
              recipientAvatar={activeConversation.recipientAvatar}
              isVerified={activeConversation.isVerified}
              isOnline={activeConversation.isOnline}
              messages={activeMessages}
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <EmptyChat />
          )}
        </div>
      </div>
    </div>
  )
}
