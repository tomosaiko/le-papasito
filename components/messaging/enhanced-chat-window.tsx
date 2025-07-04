"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Paperclip,
  Send,
  ImageIcon,
  CheckCircle,
  MoreVertical,
  Smile,
  Mic,
  Video,
  MapPin,
  Calendar,
  Heart,
  ThumbsUp,
  ThumbsDown,
  X,
  Play,
  Pause,
  Volume2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Types pour les messages
interface MessageAttachment {
  id: string
  type: "image" | "video" | "audio" | "file" | "location"
  url: string
  name?: string
  thumbnail?: string
  duration?: number
  size?: number
  location?: {
    lat: number
    lng: number
    address: string
  }
}

interface MessageReaction {
  type: "like" | "love" | "dislike"
  userId: string
  timestamp: Date
}

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Date
  isRead: boolean
  isEdited?: boolean
  replyTo?: string
  attachments?: MessageAttachment[]
  reactions?: MessageReaction[]
}

interface EnhancedChatWindowProps {
  recipientId: string
  recipientName: string
  recipientAvatar: string
  isVerified: boolean
  isOnline: boolean
  lastSeen?: Date
  messages: Message[]
  currentUserId: string
  onSendMessage: (text: string, attachments?: File[], replyToMessageId?: string) => void
  onDeleteMessage?: (messageId: string) => void
  onEditMessage?: (messageId: string, newText: string) => void
  onAddReaction?: (messageId: string, reactionType: "like" | "love" | "dislike") => void
  onTyping?: () => void
  onReadMessages?: () => void
  onVideoCallRequest?: () => void
  onAudioCallRequest?: () => void
}

export function EnhancedChatWindow({
  recipientId,
  recipientName,
  recipientAvatar,
  isVerified,
  isOnline,
  lastSeen,
  messages,
  currentUserId,
  onSendMessage,
  onDeleteMessage,
  onEditMessage,
  onAddReaction,
  onTyping,
  onReadMessages,
  onVideoCallRequest,
  onAudioCallRequest,
}: EnhancedChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const [audioPlayer, setAudioPlayer] = useState<{
    messageId: string
    isPlaying: boolean
    currentTime: number
    duration: number
  } | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Faire défiler vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

    // Marquer les messages comme lus
    if (onReadMessages) {
      onReadMessages()
    }
  }, [messages, onReadMessages])

  // Ajuster la hauteur du textarea en fonction du contenu
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [newMessage])

  // Gérer l'état de frappe
  useEffect(() => {
    if (newMessage && onTyping) {
      if (!isTyping) {
        setIsTyping(true)
        onTyping()
      }

      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }

      const timeout = setTimeout(() => {
        setIsTyping(false)
      }, 3000)

      setTypingTimeout(timeout)
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }, [newMessage, isTyping, onTyping, typingTimeout])

  const handleSendMessage = () => {
    if ((newMessage.trim() || attachments.length > 0) && !editingMessage) {
      onSendMessage(newMessage, attachments, replyToMessage?.id)
      setNewMessage("")
      setAttachments([])
      setReplyToMessage(null)
      setShowEmojiPicker(false)
    } else if (editingMessage && onEditMessage) {
      onEditMessage(editingMessage.id, newMessage)
      setNewMessage("")
      setEditingMessage(null)
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

  const handleReplyToMessage = (message: Message) => {
    setReplyToMessage(message)
    textareaRef.current?.focus()
  }

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message)
    setNewMessage(message.text)
    textareaRef.current?.focus()
  }

  const handleCancelReplyOrEdit = () => {
    if (editingMessage) {
      setEditingMessage(null)
      setNewMessage("")
    } else {
      setReplyToMessage(null)
    }
  }

  const handleAddReaction = (messageId: string, reactionType: "like" | "love" | "dislike") => {
    if (onAddReaction) {
      onAddReaction(messageId, reactionType)
    }
  }

  const toggleAudioPlayback = (messageId: string, duration = 0) => {
    if (audioPlayer && audioPlayer.messageId === messageId) {
      setAudioPlayer({
        ...audioPlayer,
        isPlaying: !audioPlayer.isPlaying,
      })
    } else {
      setAudioPlayer({
        messageId,
        isPlaying: true,
        currentTime: 0,
        duration,
      })
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const renderAttachment = (attachment: MessageAttachment, isSender: boolean) => {
    switch (attachment.type) {
      case "image":
        return (
          <div className="relative rounded-md overflow-hidden mb-2 max-w-xs">
            <img
              src={attachment.url || "/placeholder.svg"}
              alt={attachment.name || "Image"}
              className="max-h-60 w-auto object-cover rounded-md"
            />
            {attachment.name && (
              <div
                className={`absolute bottom-0 left-0 right-0 p-1 text-xs ${isSender ? "bg-purple-800/70" : "bg-gray-800/70"} text-white truncate`}
              >
                {attachment.name}
              </div>
            )}
          </div>
        )

      case "video":
        return (
          <div className="relative rounded-md overflow-hidden mb-2 max-w-xs">
            <div className="aspect-video bg-black relative">
              {attachment.thumbnail ? (
                <img
                  src={attachment.thumbnail || "/placeholder.svg"}
                  alt={attachment.name || "Video thumbnail"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`rounded-full p-3 ${isSender ? "bg-purple-600/80" : "bg-gray-600/80"}`}>
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
              {attachment.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 rounded">
                  {Math.floor(attachment.duration / 60)}:{(attachment.duration % 60).toString().padStart(2, "0")}
                </div>
              )}
            </div>
            {attachment.name && (
              <div className={`p-2 text-xs ${isSender ? "bg-purple-700" : "bg-gray-700"} text-white`}>
                <div className="flex justify-between items-center">
                  <span className="truncate">{attachment.name}</span>
                  {attachment.size && <span>{formatFileSize(attachment.size)}</span>}
                </div>
              </div>
            )}
          </div>
        )

      case "audio":
        const isCurrentlyPlaying = audioPlayer?.messageId === attachment.id && audioPlayer.isPlaying
        return (
          <div
            className={`rounded-md overflow-hidden mb-2 p-3 ${isSender ? "bg-purple-700/50" : "bg-gray-700/50"} max-w-xs`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleAudioPlayback(attachment.id, attachment.duration || 0)}
                className={`rounded-full p-2 ${isSender ? "bg-purple-600" : "bg-gray-600"}`}
              >
                {isCurrentlyPlaying ? (
                  <Pause className="h-4 w-4 text-white" />
                ) : (
                  <Play className="h-4 w-4 text-white" />
                )}
              </button>

              <div className="flex-1">
                <Progress
                  value={
                    audioPlayer?.messageId === attachment.id
                      ? (audioPlayer.currentTime / audioPlayer.duration) * 100
                      : 0
                  }
                  className="h-1"
                />
                <div className="flex justify-between text-xs mt-1 text-white">
                  <span>
                    {audioPlayer?.messageId === attachment.id
                      ? `${Math.floor(audioPlayer.currentTime / 60)}:${Math.floor(audioPlayer.currentTime % 60)
                          .toString()
                          .padStart(2, "0")}`
                      : "0:00"}
                  </span>
                  <span>
                    {attachment.duration
                      ? `${Math.floor(attachment.duration / 60)}:${Math.floor(attachment.duration % 60)
                          .toString()
                          .padStart(2, "0")}`
                      : "--:--"}
                  </span>
                </div>
              </div>

              <button className={`rounded-full p-1 ${isSender ? "text-purple-200" : "text-gray-200"}`}>
                <Volume2 className="h-4 w-4" />
              </button>
            </div>

            {attachment.name && (
              <div className="mt-2 text-xs text-white flex justify-between items-center">
                <span className="truncate">{attachment.name}</span>
                {attachment.size && <span>{formatFileSize(attachment.size)}</span>}
              </div>
            )}
          </div>
        )

      case "file":
        return (
          <div
            className={`flex items-center gap-2 ${isSender ? "bg-purple-700/50" : "bg-gray-700/50"} p-3 rounded-md mb-2 max-w-xs`}
          >
            <Paperclip className={`h-5 w-5 ${isSender ? "text-purple-200" : "text-gray-200"}`} />
            <div className="flex-1 overflow-hidden">
              <div className="text-sm text-white truncate">{attachment.name}</div>
              {attachment.size && <div className="text-xs text-white/70">{formatFileSize(attachment.size)}</div>}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white">
              <a href={attachment.url} download={attachment.name} target="_blank" rel="noopener noreferrer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </a>
            </Button>
          </div>
        )

      case "location":
        return (
          <div className="relative rounded-md overflow-hidden mb-2 max-w-xs">
            <div className="aspect-video bg-gray-100 relative">
              {/* Ici on pourrait intégrer une carte statique ou interactive */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
                <MapPin className="h-8 w-8 text-purple-600 mb-2" />
                <div className="text-sm font-medium text-center px-2">
                  {attachment.location?.address || "Emplacement partagé"}
                </div>
              </div>
            </div>
            <div className={`p-2 text-xs ${isSender ? "bg-purple-700" : "bg-gray-700"} text-white`}>
              <div className="flex justify-between items-center">
                <span>Voir sur la carte</span>
                <MapPin className="h-4 w-4" />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderReactions = (message: Message) => {
    if (!message.reactions || message.reactions.length === 0) return null

    const reactionCounts = message.reactions.reduce(
      (acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return (
      <div className="flex gap-1 mt-1">
        {Object.entries(reactionCounts).map(([type, count]) => (
          <Badge key={type} variant="outline" className="flex items-center gap-1 py-0 h-5 bg-background/30">
            {type === "like" && <ThumbsUp className="h-3 w-3" />}
            {type === "love" && <Heart className="h-3 w-3" />}
            {type === "dislike" && <ThumbsDown className="h-3 w-3" />}
            <span className="text-xs">{count}</span>
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-offset-background ring-purple-500">
            <AvatarImage src={recipientAvatar || "/placeholder.svg"} alt={recipientName} />
            <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <h2 className="font-medium">{recipientName}</h2>
              {isVerified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Profil vérifié</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isOnline ? (
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                  En ligne
                </span>
              ) : lastSeen ? (
                `Vu ${formatDistanceToNow(lastSeen, { addSuffix: true, locale: fr })}`
              ) : (
                "Hors ligne"
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                  onClick={onAudioCallRequest}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Appel audio</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                  onClick={onVideoCallRequest}
                >
                  <Video className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Appel vidéo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Voir le profil</DropdownMenuItem>
              <DropdownMenuItem>Rechercher dans la conversation</DropdownMenuItem>
              <DropdownMenuItem>Notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Bloquer</DropdownMenuItem>
              <DropdownMenuItem>Signaler</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">Supprimer la conversation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-background/95"
      >
        {messages.map((message) => {
          const isSender = message.senderId === currentUserId
          const replyToMessage = message.replyTo ? messages.find((m) => m.id === message.replyTo) : null

          return (
            <div key={message.id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
              <div className="flex gap-2 max-w-[80%] group">
                {!isSender && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={recipientAvatar || "/placeholder.svg"} alt={recipientName} />
                    <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  {/* Message répondu */}
                  {replyToMessage && (
                    <div
                      className={`rounded-lg p-2 mb-1 text-xs ${
                        isSender
                          ? "bg-purple-300/20 text-purple-800 dark:text-purple-200"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                      } max-w-[90%] ml-2`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 17 4 12 9 7"></polyline>
                          <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                        </svg>
                        <span className="font-medium">
                          {replyToMessage.senderId === currentUserId ? "Vous" : recipientName}
                        </span>
                      </div>
                      <p className="truncate">{replyToMessage.text}</p>
                    </div>
                  )}

                  {/* Contenu principal du message */}
                  <div
                    className={`rounded-lg p-3 ${
                      isSender
                        ? "bg-purple-600 text-white rounded-tr-none"
                        : "bg-secondary text-foreground rounded-tl-none"
                    }`}
                  >
                    {message.attachments?.map((attachment, index) => (
                      <div key={index}>{renderAttachment(attachment, isSender)}</div>
                    ))}

                    {message.text && (
                      <p className="whitespace-pre-wrap break-words">
                        {message.text}
                        {message.isEdited && <span className="text-xs ml-1 opacity-70">(modifié)</span>}
                      </p>
                    )}
                  </div>

                  {/* Réactions */}
                  {renderReactions(message)}

                  {/* Infos et actions */}
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

                    {/* Actions sur le message (apparaissent au survol) */}
                    <div
                      className={`ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${isSender ? "" : "ml-auto"}`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full"
                        onClick={() => handleReplyToMessage(message)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 17 4 12 9 7"></polyline>
                          <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                        </svg>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                            <Smile className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isSender ? "end" : "start"} className="flex p-1 gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleAddReaction(message.id, "like")}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleAddReaction(message.id, "love")}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleAddReaction(message.id, "dislike")}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {isSender && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full"
                            onClick={() => handleEditMessage(message)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100"
                            onClick={() => onDeleteMessage && onDeleteMessage(message.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Réponse ou édition */}
      {(replyToMessage || editingMessage) && (
        <div className="p-2 border-t border-border bg-secondary/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-1 h-full rounded-full ${editingMessage ? "bg-amber-500" : "bg-purple-500"}`}></div>
              <div>
                <div className="text-xs font-medium">{editingMessage ? "Modifier le message" : "Répondre à"}</div>
                <div className="text-sm truncate max-w-[200px] sm:max-w-md">
                  {(editingMessage || replyToMessage)?.text || ""}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleCancelReplyOrEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border bg-background/95 backdrop-blur-sm">
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

        <div className="flex flex-col">
          <Textarea
            ref={textareaRef}
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[60px] max-h-[150px] resize-none mb-2 bg-secondary/50"
            rows={1}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={triggerFileInput} className="rounded-full">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Joindre un fichier</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={triggerFileInput} className="rounded-full">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Envoyer une image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Emoji</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full ${isRecording ? "text-red-500 bg-red-100" : ""}`}
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isRecording ? "Arrêter l'enregistrement" : "Enregistrer un message vocal"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Calendar className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Proposer un rendez-vous</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MapPin className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Partager votre position</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && attachments.length === 0 && !editingMessage}
              className="rounded-full px-4 bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Emoji Picker (simplifié) */}
        {showEmojiPicker && (
          <div className="mt-2 p-2 bg-background border border-border rounded-md shadow-md">
            <div className="grid grid-cols-8 gap-2">
              {[
                "😊",
                "😂",
                "❤️",
                "👍",
                "🔥",
                "🎉",
                "🙏",
                "😍",
                "😘",
                "😭",
                "😎",
                "🤔",
                "😢",
                "😡",
                "👋",
                "🥰",
                "🤣",
                "😁",
                "😉",
                "😌",
                "🤗",
                "🙄",
                "😴",
                "🥺",
              ].map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => setNewMessage((prev) => prev + emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
