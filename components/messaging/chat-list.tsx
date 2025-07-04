"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, CheckCircle } from "lucide-react"

// Types pour les conversations
interface Conversation {
  id: string
  recipientId: string
  recipientName: string
  recipientAvatar: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isVerified: boolean
  isOnline: boolean
}

interface ChatListProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onSelectConversation: (conversationId: string) => void
}

export function ChatList({ conversations, activeConversationId, onSelectConversation }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrer les conversations en fonction de la recherche
  const filteredConversations = conversations.filter((conversation) =>
    conversation.recipientName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Aucune conversation trouvée</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filteredConversations.map((conversation) => (
              <li
                key={conversation.id}
                className={`p-4 hover:bg-secondary/50 cursor-pointer transition-colors ${
                  activeConversationId === conversation.id ? "bg-secondary" : ""
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.recipientAvatar} alt={conversation.recipientName} />
                      <AvatarFallback>{conversation.recipientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <h3 className="font-medium truncate">{conversation.recipientName}</h3>
                        {conversation.isVerified && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="purple" className="ml-2">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <Button className="w-full bg-purple-600 hover:bg-purple-700">Nouvelle conversation</Button>
      </div>
    </div>
  )
}
