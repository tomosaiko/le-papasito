# 🗄️ Configuration Base de Données PostgreSQL + Prisma

## 📋 **Vue d'ensemble**

Ce guide détaille la mise en place complète de la base de données PostgreSQL avec Prisma ORM pour le projet **Le Papasito**.

### ✅ **Ce qui a été implémenté**

- **Schéma Prisma complet** avec 17 modèles (User, EscortProfile, Booking, Message, etc.)
- **Services métier** pour User, Booking, et Message
- **API Routes** adaptées pour utiliser Prisma
- **Types TypeScript** générés automatiquement
- **Relations complexes** entre entités
- **Système de permissions** et validations

---

## 🚀 **Installation étape par étape**

### **1. Prérequis**

```bash
# Installer PostgreSQL (macOS avec Homebrew)
brew install postgresql@14
brew services start postgresql@14

# Ou avec Docker
docker run --name postgres-lepapasito -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:14
```

### **2. Configuration des variables d'environnement**

Créer un fichier `.env` à la racine du projet :

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/le_papasito_db?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here-change-in-production"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_your_stripe_public_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Brevo (Email/SMS)
BREVO_API_KEY="your-brevo-api-key"

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"
```

### **3. Créer la base de données**

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE le_papasito_db;

# Quitter psql
\q
```

### **4. Exécuter les migrations**

```bash
# Générer la migration initiale
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate

# (Optionnel) Seeder avec des données de test
npx prisma db seed
```

### **5. Vérifier l'installation**

```bash
# Ouvrir l'interface d'administration Prisma
npx prisma studio

# Tester la connexion
npm run dev
```

---

## 📊 **Architecture de la base de données**

### **Modèles principaux**

| Modèle | Description | Relations |
|--------|-------------|-----------|
| **User** | Utilisateurs (clients, escorts, admins) | → EscortProfile, Booking, Message |
| **EscortProfile** | Profils détaillés des escorts | → User, Photo, Video |
| **Booking** | Réservations entre clients et escorts | → User, Payment |
| **Message** | Système de messagerie | → User, Conversation |
| **Payment** | Paiements et transactions | → Booking, User |
| **Review** | Avis et évaluations | → User |
| **Notification** | Notifications système | → User |

### **Relations complexes**

```prisma
// Relation 1-à-1 : User ↔ EscortProfile
model User {
  escortProfile EscortProfile?
}

// Relation 1-à-plusieurs : EscortProfile → Photos
model EscortProfile {
  photos Photo[]
}

// Relation plusieurs-à-plusieurs : Conversations ↔ Users
model Conversation {
  participants ConversationParticipant[]
}
```

---

## 🛠️ **Utilisation des services**

### **UserService**

```typescript
import { UserService } from '@/lib/services/user.service'

// Créer un utilisateur
const user = await UserService.createUser({
  email: 'test@example.com',
  name: 'Test User',
  password: 'password123',
  role: 'ESCORT'
})

// Rechercher des escorts
const { escorts } = await UserService.searchEscorts({
  city: 'Paris',
  services: ['massage', 'escort'],
  verified: true,
  page: 1,
  limit: 10
})
```

### **BookingService**

```typescript
import { BookingService } from '@/lib/services/booking.service'

// Créer une réservation
const booking = await BookingService.createBooking({
  clientId: 'user1',
  escortId: 'user2',
  date: new Date('2024-01-15'),
  startTime: new Date('2024-01-15T14:00:00'),
  endTime: new Date('2024-01-15T16:00:00'),
  duration: 2,
  totalAmount: 200
})

// Confirmer une réservation
await BookingService.confirmBooking(booking.id, 'user2')
```

### **MessageService**

```typescript
import { MessageService } from '@/lib/services/message.service'

// Créer une conversation
const conversation = await MessageService.getOrCreateConversation('user1', 'user2')

// Envoyer un message
const message = await MessageService.sendMessage({
  conversationId: conversation.id,
  senderId: 'user1',
  recipientId: 'user2',
  content: 'Hello!'
})
```

---

## 🔧 **Commandes utiles**

### **Prisma CLI**

```bash
# Réinitialiser la base de données
npx prisma migrate reset

# Créer une nouvelle migration
npx prisma migrate dev --name add_new_field

# Appliquer les migrations en production
npx prisma migrate deploy

# Générer le client après modification du schéma
npx prisma generate

# Formater le schéma
npx prisma format

# Valider le schéma
npx prisma validate
```

### **Développement**

```bash
# Lancer le serveur avec hot-reload
npm run dev

# Build pour production
npm run build

# Lancer les tests
npm test

# Vérifier les types TypeScript
npx tsc --noEmit
```

---

## 📈 **Monitoring et performance**

### **Requêtes optimisées**

```typescript
// ✅ Bon : Utiliser include pour récupérer les relations
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    escortProfile: {
      include: {
        photos: true
      }
    }
  }
})

// ❌ Mauvais : Requêtes N+1
const users = await prisma.user.findMany()
for (const user of users) {
  const profile = await prisma.escortProfile.findUnique({
    where: { userId: user.id }
  })
}
```

### **Index recommandés**

```sql
-- Index pour les recherches fréquentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_escort_profiles_city ON escort_profiles(city);
```

---

## 🔒 **Sécurité**

### **Validation des données**

```typescript
// Toujours valider les entrées
if (!email || !email.includes('@')) {
  throw new Error('Email invalide')
}

// Hachage des mots de passe
const hashedPassword = await bcrypt.hash(password, 12)
```

### **Permissions**

```typescript
// Vérifier les permissions avant toute action
if (booking.clientId !== userId && booking.escortId !== userId) {
  throw new Error('Accès non autorisé')
}
```

---

## 🚨 **Dépannage**

### **Erreurs courantes**

```bash
# Erreur de connexion
Error: Can't reach database server at localhost:5432
# Solution : Vérifier que PostgreSQL est démarré

# Erreur de migration
Error: Migration failed
# Solution : Réinitialiser et recréer les migrations

# Erreur de types
Error: Type 'unknown' is not assignable to type 'User'
# Solution : Régénérer le client Prisma
```

### **Debugging**

```typescript
// Activer les logs SQL
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Utiliser les métriques
const metrics = await prisma.$metrics.json()
console.log(metrics)
```

---

## 📚 **Ressources**

- [Documentation Prisma](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js + Prisma Guide](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

## 🎯 **Prochaines étapes**

1. **Authentification** : Intégrer NextAuth.js avec Prisma
2. **Upload de fichiers** : Système de gestion des photos/vidéos
3. **Cache** : Implémenter Redis pour les performances
4. **Tests** : Ajouter des tests unitaires et d'intégration
5. **Monitoring** : Intégrer des outils de monitoring en production

---

> **Note importante** : Cette base de données remplace complètement le système de données simulées en mémoire. Toutes les nouvelles API routes doivent utiliser les services Prisma pour garantir la persistance des données. 