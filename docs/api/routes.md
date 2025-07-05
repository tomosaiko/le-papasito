# 🌐 API Routes Documentation

## 📋 **Vue d'ensemble**

Cette documentation couvre toutes les API routes disponibles dans l'application Le Papasito. Chaque route est documentée avec ses paramètres, réponses et exemples d'utilisation.

**Base URL** : `http://localhost:3000/api` (développement)

---

## 📅 **Bookings API** - `/api/bookings/create`

### **Description**
API pour la gestion complète des réservations entre clients et escorts.

### **Endpoints**

#### **POST /api/bookings/create**
Créer une nouvelle réservation.

**Paramètres requis :**
```json
{
  "escortId": "string",
  "clientId": "string", 
  "date": "2024-01-15",
  "startTime": "2024-01-15T14:00:00Z",
  "endTime": "2024-01-15T16:00:00Z",
  "totalAmount": 300,
  "notes": "string (optionnel)"
}
```

**Réponse (201 Created) :**
```json
{
  "success": true,
  "booking": {
    "id": "cm7xxxxx",
    "clientId": "cm7xxxxx",
    "escortId": "cm7xxxxx",
    "date": "2024-01-15T00:00:00Z",
    "startTime": "2024-01-15T14:00:00Z",
    "endTime": "2024-01-15T16:00:00Z",
    "duration": 2,
    "totalAmount": 300,
    "commission": 45,
    "status": "PENDING",
    "notes": "Demande spéciale...",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z",
    "client": {
      "id": "cm7xxxxx",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "escort": {
      "id": "cm7xxxxx",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "escortProfile": {
        "hourlyRate": 150,
        "city": "Paris"
      }
    }
  }
}
```

**Erreurs possibles :**
- `400 Bad Request` : Données manquantes ou invalides
- `404 Not Found` : Client ou escort non trouvé
- `409 Conflict` : Créneau non disponible
- `500 Internal Server Error` : Erreur serveur

**Exemple d'utilisation :**
```javascript
const response = await fetch('/api/bookings/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    escortId: 'cm7xxxxx',
    clientId: 'cm7yyyyy',
    date: '2024-01-15',
    startTime: '2024-01-15T14:00:00Z',
    endTime: '2024-01-15T16:00:00Z',
    totalAmount: 300,
    notes: 'Première réservation'
  })
})

const result = await response.json()
```

#### **GET /api/bookings/create**
Récupérer les réservations avec filtres.

**Paramètres de requête :**
- `clientId` (optionnel) : ID du client
- `escortId` (optionnel) : ID de l'escort
- `status` (optionnel) : `PENDING` | `CONFIRMED` | `CANCELLED` | `COMPLETED`
- `page` (optionnel) : Page (défaut: 1)
- `limit` (optionnel) : Limite par page (défaut: 10)

**Réponse (200 OK) :**
```json
{
  "success": true,
  "bookings": [...],
  "total": 25
}
```

**Exemple d'utilisation :**
```javascript
// Récupérer les réservations d'un client
const response = await fetch('/api/bookings/create?clientId=cm7xxxxx&status=CONFIRMED')
const { bookings, total } = await response.json()

// Récupérer les réservations d'un escort
const response2 = await fetch('/api/bookings/create?escortId=cm7yyyyy&page=1&limit=5')
```

#### **PATCH /api/bookings/create**
Mettre à jour le statut d'une réservation.

**Paramètres requis :**
```json
{
  "bookingId": "string",
  "status": "CONFIRMED" | "CANCELLED" | "COMPLETED",
  "userId": "string"
}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "booking": {
    "id": "cm7xxxxx",
    "status": "CONFIRMED",
    // ... autres champs
  }
}
```

**Exemple d'utilisation :**
```javascript
// Confirmer une réservation
const response = await fetch('/api/bookings/create', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    bookingId: 'cm7xxxxx',
    status: 'CONFIRMED',
    userId: 'cm7yyyyy' // ID de l'escort
  })
})
```

---

## 🔐 **Authentication API** - `/api/auth/*`

### **Description**
Endpoints pour l'authentification et la gestion des sessions utilisateur.

### **Endpoints**

#### **POST /api/auth/signin/google**
Connexion via Google OAuth.

**Paramètres :**
```json
{
  "token": "google-oauth-token"
}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "user": {
    "id": "cm7xxxxx",
    "email": "user@gmail.com",
    "name": "John Doe",
    "role": "USER",
    "verified": false
  },
  "session": {
    "token": "jwt-token",
    "expiresAt": "2024-01-16T12:00:00Z"
  }
}
```

---

## 💳 **Payments API** - `/api/payment/*`

### **Description**
Endpoints pour la gestion des paiements via Stripe.

### **Endpoints**

#### **POST /api/payment/stripe/create**
Créer une session de paiement Stripe.

**Paramètres requis :**
```json
{
  "amount": 30000,
  "currency": "eur",
  "bookingId": "string",
  "successUrl": "string",
  "cancelUrl": "string"
}
```

#### **POST /api/payment/webhook**
Webhook Stripe pour traiter les événements de paiement.

#### **POST /api/payment/sponsoring**
Traiter les paiements de sponsoring.

---

## 🔔 **Notifications API** - `/api/notifications/*`

### **Description**
Endpoints pour l'envoi de notifications email et SMS.

### **Endpoints**

#### **POST /api/notifications/send-reminder**
Envoyer un rappel de réservation.

**Paramètres requis :**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "bookingDetails": {
    "date": "2024-01-15",
    "timeSlot": { "startTime": "14:00" },
    "duration": "2"
  }
}
```

---

## 📊 **Providers API** - `/api/providers/*`

### **Description**
Endpoints pour la gestion des disponibilités des escorts.

### **Endpoints**

#### **GET /api/providers/availability**
Récupérer les disponibilités d'un escort.

**Paramètres de requête :**
- `providerId` : ID de l'escort
- `date` : Date au format YYYY-MM-DD
- `duration` : Durée en heures

**Réponse (200 OK) :**
```json
{
  "success": true,
  "availability": [
    {
      "startTime": "2024-01-15T10:00:00Z",
      "endTime": "2024-01-15T11:00:00Z",
      "available": true
    },
    {
      "startTime": "2024-01-15T11:00:00Z",
      "endTime": "2024-01-15T12:00:00Z",
      "available": false
    }
  ]
}
```

---

## 🛡️ **Sécurité**

### **Authentification**
```javascript
// Ajouter le token JWT dans les headers
const response = await fetch('/api/bookings/create', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  // ...
})
```

### **Validation des données**
Toutes les API routes valident les données d'entrée :
- **Types** : Vérification des types de données
- **Formats** : Validation des formats (email, dates, etc.)
- **Permissions** : Vérification des droits d'accès
- **Sanitization** : Nettoyage des données malveillantes

### **Rate limiting**
- **Limite générale** : 100 requêtes par 15 minutes
- **Limite auth** : 10 tentatives par 5 minutes
- **Limite création** : 20 créations par heure

---

## 🔄 **Codes d'erreur standardisés**

| Code | Nom | Description |
|------|-----|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Accès interdit |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Conflit de ressources |
| 422 | Unprocessable Entity | Validation échouée |
| 429 | Too Many Requests | Rate limit dépassé |
| 500 | Internal Server Error | Erreur serveur |

### **Format des erreurs**
```json
{
  "error": "Description de l'erreur",
  "code": "ERROR_CODE",
  "details": {
    "field": "Détail spécifique"
  }
}
```

---

## 📝 **Template pour nouvelles API routes**

### **Structure standard**
```typescript
// app/api/[feature]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { FeatureService } from "@/lib/services/feature.service"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validation
    if (!data.required) {
      return NextResponse.json(
        { error: "Champ requis manquant" },
        { status: 400 }
      )
    }

    // Business logic
    const result = await FeatureService.createFeature(data)

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Erreur API:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
```

### **Documentation standard**
```markdown
## 📋 **[Feature] API** - `/api/feature`

### **Description**
Description de la fonctionnalité

### **Endpoints**

#### **POST /api/feature**
Description de l'endpoint

**Paramètres requis :**
```json
{
  "field": "type"
}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "data": {}
}
```

**Exemple d'utilisation :**
```javascript
// Code exemple
```
```

---

## 🧪 **Tests des API**

### **Tests unitaires**
```javascript
// __tests__/api/bookings.test.ts
import { POST } from '@/app/api/bookings/create/route'

describe('/api/bookings/create', () => {
  it('should create a booking', async () => {
    const request = new NextRequest('http://localhost:3000/api/bookings/create', {
      method: 'POST',
      body: JSON.stringify({
        escortId: 'test-escort',
        clientId: 'test-client',
        // ... autres données
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.booking).toBeDefined()
  })
})
```

### **Tests d'intégration**
```javascript
// Tests avec base de données de test
describe('Bookings API Integration', () => {
  beforeEach(async () => {
    await setupTestDatabase()
  })

  afterEach(async () => {
    await cleanupTestDatabase()
  })

  // Tests...
})
```

---

## 📊 **Monitoring et logs**

### **Métriques**
- **Temps de réponse** : Moyenne < 200ms
- **Taux d'erreur** : < 1%
- **Throughput** : Requêtes par seconde
- **Disponibilité** : > 99.9%

### **Logs**
```typescript
// Structure des logs
{
  timestamp: "2024-01-15T12:00:00Z",
  level: "info",
  method: "POST",
  url: "/api/bookings/create",
  userId: "cm7xxxxx",
  duration: 150,
  status: 201,
  error: null
}
```

---

## 🔄 **Changelog API**

### **v1.0.0** - Base de données et bookings (2024-01-05)
- ✅ API Bookings complète (POST, GET, PATCH)
- ✅ Validation des données
- ✅ Gestion des erreurs
- ✅ Documentation complète

### **v1.1.0** - Prochaine version
- 🔄 API Users (création, mise à jour)
- 🔄 API Messages (CRUD complet)
- 🔄 API Reviews (système d'avis)
- 🔄 Authentification NextAuth.js

---

> **Note** : Cette documentation est mise à jour avec chaque nouvelle API route. Tous les exemples sont testés et fonctionnels. 