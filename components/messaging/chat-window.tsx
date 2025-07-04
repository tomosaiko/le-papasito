"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Send, ImageIcon, CheckCircle, MoreVertical, Phone } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Types pour les messages
interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Date
  isRead: boolean
  attachments?: {
    type: "image" | "file"
    url: string
    name?: string
  }[]
}

interface ChatWindowProps {
  recipientId: string
  recipientName: string
  recipientAvatar: string
  isVerified: boolean
  isOnline: boolean
  messages: Message[]
  currentUserId: string
  onSendMessage: (text: string, attachments?: File[]) => void
}

export function ChatWindow({
  recipientId,
  recipientName,
  recipientAvatar,
  isVerified,
  isOnline,
  messages,
  currentUserId,
  onSendMessage,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Faire défiler vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage, attachments)
      setNewMessage("")
      setAttachments([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={recipientAvatar} alt={recipientName} />
            <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <h2 className="font-medium">{recipientName}</h2>
              {isVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <p className="text-xs text-muted-foreground">
              {isOnline ? "En ligne" : "Dernière connexion il y a 2 heures"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Voir le profil</DropdownMenuItem>
              <DropdownMenuItem>Bloquer</DropdownMenuItem>
              <DropdownMenuItem>Signaler</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">Supprimer la conversation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSender = message.senderId === currentUserId
          return (
            <div key={message.id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
              <div className="flex gap-2 max-w-[80%]">
                {!isSender && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={recipientAvatar} alt={recipientName} />
                    <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div
                    className={`rounded-lg p-3 ${
                      isSender
                        ? "bg-purple-600 text-white rounded-tr-none"
                        : "bg-secondary text-foreground rounded-tl-none"
                    }`}
                  >
                    {message.attachments?.map((attachment, index) => (
                      <div key={index} className="mb-2">
                        {attachment.type === "image" ? (
                          <img
                            src={attachment.url || "/placeholder.svg"}
                            alt="Attachment"
                            className="rounded-md max-h-60 w-auto"
                          />
                        ) : (
                          <div className="flex items-center gap-2 bg-background/50 p-2 rounded-md">
                            <Paperclip className="h-4 w-4" />
                            <span className="text-sm truncate">{attachment.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span>{formatDistanceToNow(message.timestamp, { addSuffix: true, locale: fr })}</span>
                    {isSender && (
                      <span className="ml-2 flex items-center">
                        {message.isRead ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <CheckCircle className="h-3 w-3 text-muted-foreground" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-1 bg-secondary p-1 rounded-md">
                <span className="text-xs truncate max-w-[100px]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                >
                  &times;
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={triggerFileInput}>
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={triggerFileInput}>
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
          <Input
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim() && attachments.length === 0}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
