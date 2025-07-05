# 🗄️ Services de Base de Données

## 📋 **Vue d'ensemble**

Les services de base de données encapsulent toute la logique métier liée aux données. Ils utilisent Prisma ORM pour interagir avec PostgreSQL de manière type-safe.

---

## 👤 **UserService**

### **Description**
Service principal pour la gestion des utilisateurs, profils d'escorts et authentification.

### **Méthodes disponibles**

#### **Création d'utilisateurs**
```typescript
// Créer un nouvel utilisateur
const user = await UserService.createUser({
  email: 'user@example.com',
  name: 'John Doe',
  password: 'securePassword123',
  role: 'ESCORT', // USER | ESCORT | ADMIN
  avatar: 'https://example.com/avatar.jpg'
})
```

#### **Authentification**
```typescript
// Trouver un utilisateur par email
const user = await UserService.findByEmail('user@example.com')

// Vérifier le mot de passe
const isValid = await UserService.verifyPassword('plainPassword', user.password)

// Mettre à jour le dernier accès
await UserService.updateLastActive(userId)
```

#### **Gestion des profils**
```typescript
// Obtenir un utilisateur complet avec profil
const user = await UserService.findById(userId)

// Mettre à jour le profil
const updatedUser = await UserService.updateProfile(userId, {
  name: 'Nouveau nom',
  avatar: 'nouvelle-image.jpg'
})

// Vérifier un utilisateur
await UserService.verifyUser(userId, 3) // Niveau de vérification 0-3
```

#### **Recherche d'escorts**
```typescript
// Recherche avancée avec filtres
const { escorts, total } = await UserService.searchEscorts({
  city: 'Paris',
  minAge: 20,
  maxAge: 35,
  services: ['massage', 'escort', 'domination'],
  languages: ['français', 'anglais'],
  verified: true,
  available: true,
  minPrice: 100,
  maxPrice: 500,
  sortBy: 'rating', // rating | price | recent | popular
  page: 1,
  limit: 10
})
```

#### **Statistiques**
```typescript
// Obtenir les statistiques d'un utilisateur
const stats = await UserService.getUserStats(userId)
// Retourne: { totalBookings, totalEarnings, averageRating, totalReviews }
```

#### **Gestion des utilisateurs (Admin)**
```typescript
// Liste paginée avec filtres
const { users, total } = await UserService.getUsers({
  page: 1,
  limit: 20,
  role: 'ESCORT',
  verified: true,
  search: 'terme de recherche'
})

// Supprimer un utilisateur
await UserService.deleteUser(userId)
```

### **Types TypeScript**

```typescript
interface CreateUserData {
  email: string
  name: string
  password?: string
  role?: UserRole
  avatar?: string
}

interface SearchEscortsFilters {
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
}

interface UserStats {
  totalBookings: number
  totalEarnings: number
  averageRating: number
  totalReviews: number
}
```

---

## 📅 **BookingService**

### **Description**
Service pour la gestion complète des réservations entre clients et escorts.

### **Méthodes disponibles**

#### **Création de réservations**
```typescript
// Créer une nouvelle réservation
const booking = await BookingService.createBooking({
  clientId: 'client-id',
  escortId: 'escort-id',
  date: new Date('2024-01-15'),
  startTime: new Date('2024-01-15T14:00:00'),
  endTime: new Date('2024-01-15T16:00:00'),
  duration: 2, // en heures
  totalAmount: 300, // en euros
  notes: 'Demande spéciale...'
})
```

#### **Vérification de disponibilité**
```typescript
// Vérifier si un créneau est disponible
const isAvailable = await BookingService.checkAvailability(
  'escort-id',
  new Date('2024-01-15'),
  new Date('2024-01-15T14:00:00'),
  new Date('2024-01-15T16:00:00')
)

// Obtenir les créneaux disponibles d'un escort
const slots = await BookingService.getAvailableSlots(
  'escort-id',
  new Date('2024-01-15')
)
```

#### **Gestion des réservations**
```typescript
// Obtenir une réservation par ID
const booking = await BookingService.getBookingById('booking-id')

// Réservations d'un utilisateur
const { bookings, total } = await BookingService.getUserBookings(
  'user-id',
  'client', // ou 'escort'
  {
    status: 'PENDING',
    page: 1,
    limit: 10
  }
)

// Confirmer une réservation (par l'escort)
await BookingService.confirmBooking('booking-id', 'escort-id')

// Annuler une réservation
await BookingService.cancelBooking('booking-id', 'user-id', 'Raison')

// Marquer comme terminée
await BookingService.completeBooking('booking-id')
```

#### **Statistiques**
```typescript
// Statistiques de réservation
const stats = await BookingService.getBookingStats('user-id', 'escort')
// Retourne: { total, pending, confirmed, completed, cancelled, totalEarnings }
```

#### **Recherche avancée**
```typescript
// Recherche avec filtres
const { bookings, total } = await BookingService.searchBookings({
  clientId: 'client-id',
  escortId: 'escort-id',
  status: 'CONFIRMED',
  dateFrom: new Date('2024-01-01'),
  dateTo: new Date('2024-01-31'),
  minAmount: 100,
  maxAmount: 1000,
  page: 1,
  limit: 10
})
```

### **Types TypeScript**

```typescript
interface CreateBookingData {
  clientId: string
  escortId: string
  date: Date
  startTime: Date
  endTime: Date
  duration: number
  totalAmount: number
  notes?: string
}

interface BookingStats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  totalEarnings?: number
}

interface TimeSlot {
  startTime: Date
  endTime: Date
  available: boolean
}
```

---

## 💬 **MessageService**

### **Description**
Service pour la gestion du système de messagerie entre utilisateurs.

### **Méthodes disponibles**

#### **Gestion des conversations**
```typescript
// Créer ou récupérer une conversation
const conversation = await MessageService.getOrCreateConversation(
  'user1-id',
  'user2-id'
)

// Obtenir les conversations d'un utilisateur
const { conversations, total } = await MessageService.getUserConversations(
  'user-id',
  {
    page: 1,
    limit: 20
  }
)

// Supprimer une conversation
await MessageService.deleteConversation('conversation-id', 'user-id')

// Archiver une conversation
await MessageService.archiveConversation('conversation-id', 'user-id')
```

#### **Envoi de messages**
```typescript
// Envoyer un message
const message = await MessageService.sendMessage({
  conversationId: 'conversation-id',
  senderId: 'sender-id',
  recipientId: 'recipient-id',
  content: 'Contenu du message',
  messageType: 'text', // text | image | video | audio
  attachments: ['url1.jpg', 'url2.pdf']
})

// Modifier un message
await MessageService.editMessage('message-id', 'user-id', 'Nouveau contenu')

// Supprimer un message
await MessageService.deleteMessage('message-id', 'user-id')
```

#### **Lecture des messages**
```typescript
// Obtenir les messages d'une conversation
const { messages, hasMore } = await MessageService.getConversationMessages(
  'conversation-id',
  {
    page: 1,
    limit: 50,
    beforeId: 'message-id' // Pour pagination
  }
)

// Marquer les messages comme lus
await MessageService.markMessagesAsRead('conversation-id', 'user-id')

// Nombre de messages non lus
const unreadCount = await MessageService.getUnreadCount('user-id')
```

#### **Recherche**
```typescript
// Rechercher dans les messages
const { messages, total } = await MessageService.searchMessages(
  'user-id',
  'terme de recherche',
  {
    conversationId: 'conversation-id', // optionnel
    page: 1,
    limit: 20
  }
)
```

#### **Statistiques**
```typescript
// Statistiques de messagerie
const stats = await MessageService.getMessageStats('user-id')
// Retourne: { totalConversations, totalMessages, unreadMessages, messagesThisWeek }
```

### **Types TypeScript**

```typescript
interface SendMessageData {
  conversationId: string
  senderId: string
  recipientId: string
  content: string
  messageType?: string
  attachments?: string[]
}

interface MessageStats {
  totalConversations: number
  totalMessages: number
  unreadMessages: number
  messagesThisWeek: number
}

interface ConversationWithDetails {
  id: string
  otherParticipant: User
  lastMessage: Message
  unreadCount: number
  updatedAt: Date
}
```

---

## 🔒 **Sécurité et bonnes pratiques**

### **Validation des données**
```typescript
// Toujours valider les entrées
if (!email || !email.includes('@')) {
  throw new Error('Email invalide')
}

if (!userId || typeof userId !== 'string') {
  throw new Error('User ID requis')
}
```

### **Gestion des erreurs**
```typescript
try {
  const result = await UserService.createUser(userData)
  return result
} catch (error) {
  if (error.code === 'P2002') {
    throw new Error('Email déjà utilisé')
  }
  throw error
}
```

### **Permissions**
```typescript
// Vérifier les permissions avant toute action
if (booking.clientId !== userId && booking.escortId !== userId) {
  throw new Error('Accès non autorisé')
}
```

---

## 🚀 **Performance**

### **Optimisations de requêtes**
```typescript
// ✅ Utiliser include pour les relations
const users = await prisma.user.findMany({
  include: {
    escortProfile: {
      include: {
        photos: {
          where: { isMain: true },
          take: 1
        }
      }
    }
  }
})

// ✅ Pagination système
const { skip, take } = getPagination(page, limit)
const results = await prisma.user.findMany({
  skip,
  take,
  where: filters
})
```

### **Cache et optimisations**
```typescript
// Utiliser les transactions pour les opérations complexes
await prisma.$transaction(async (tx) => {
  const booking = await tx.booking.create({ data: bookingData })
  await tx.availability.update({
    where: { id: availabilityId },
    data: { available: false }
  })
})
```

---

## 📊 **Monitoring**

### **Logs et métriques**
```typescript
// Activer les logs SQL en développement
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
})

// Mesurer les performances
const startTime = performance.now()
const result = await UserService.searchEscorts(filters)
const endTime = performance.now()
console.log(`Recherche terminée en ${endTime - startTime}ms`)
```

---

## 🔄 **Migrations et évolution**

### **Ajout de nouvelles fonctionnalités**
1. **Modifier le schéma Prisma** : `prisma/schema.prisma`
2. **Créer la migration** : `npx prisma migrate dev --name add_feature`
3. **Mettre à jour le service** : Ajouter les méthodes
4. **Documenter** : Mettre à jour cette documentation
5. **Tester** : Ajouter les tests unitaires

### **Versioning**
- **v1.0.0** : Services de base (User, Booking, Message)
- **v1.1.0** : Ajout de fonctionnalités (Reviews, Notifications)
- **v1.2.0** : Optimisations et cache
- **v2.0.0** : Refactoring majeur ou breaking changes

---

> **Note** : Cette documentation est mise à jour avec chaque modification des services. Les exemples sont testés et fonctionnels. 