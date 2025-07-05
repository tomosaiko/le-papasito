# 🔧 Configuration des Variables d'Environnement

## 📋 **Vue d'ensemble**

Ce guide explique comment configurer le fichier `.env` pour faire fonctionner l'authentification NextAuth.js et les autres services du projet.

---

## 🚀 **Configuration rapide**

### **1. Créer le fichier .env**

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Base de données
DATABASE_URL="postgresql://postgres:password@localhost:5432/le_papasito_db?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# Google OAuth (à configurer)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe (optionnel pour l'instant)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""

# Brevo (optionnel pour l'instant)
BREVO_API_KEY=""

# Développement
NODE_ENV="development"
```

### **2. Configurer PostgreSQL**

Si vous n'avez pas encore PostgreSQL :

```bash
# macOS avec Homebrew
brew install postgresql
brew services start postgresql

# Créer la base de données
createdb le_papasito_db

# Ou utiliser Docker
docker run --name postgres-lepapasito -e POSTGRES_PASSWORD=password -e POSTGRES_DB=le_papasito_db -p 5432:5432 -d postgres
```

### **3. Générer NEXTAUTH_SECRET**

```bash
# Générer une clé secrète aléatoire
openssl rand -base64 32
```

Remplacez `your-super-secret-key-change-this-in-production` par la clé générée.

---

## 🔐 **Configuration Google OAuth**

### **1. Créer un projet Google Cloud**

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ ou Google Identity

### **2. Configurer OAuth 2.0**

1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **Create Credentials** > **OAuth 2.0 Client IDs**
3. Sélectionnez **Web application**
4. Configurez les URIs :
   - **Authorized JavaScript origins** : `http://localhost:3000`
   - **Authorized redirect URIs** : `http://localhost:3000/api/auth/callback/google`

### **3. Récupérer les clés**

Copiez le **Client ID** et **Client Secret** dans votre fichier `.env`.

---

## 🧪 **Test de configuration**

### **1. Vérifier PostgreSQL**

```bash
# Test de connexion
psql postgresql://postgres:password@localhost:5432/le_papasito_db
```

### **2. Vérifier NextAuth**

```bash
# Générer le client Prisma
npx prisma generate

# Lancer le serveur de développement
npm run dev
```

Visitez `http://localhost:3000/api/auth/signin` pour voir la page de connexion NextAuth.

---

## 🔒 **Sécurité en production**

### **Variables critiques à changer**

```env
# ⚠️ OBLIGATOIRE en production
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="clé-secrète-très-longue-et-aléatoire"
DATABASE_URL="postgresql://user:password@prod-server:5432/db"

# SSL pour la base de données
DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"
```

### **Bonnes pratiques**

- ✅ Utilisez des clés secrètes longues et aléatoires
- ✅ Activez SSL pour la base de données en production
- ✅ Ne commitez jamais le fichier `.env`
- ✅ Utilisez des services de gestion des secrets en production
- ✅ Validez toutes les variables au démarrage

---

## 🐛 **Dépannage**

### **Erreur : Environment variable not found: DATABASE_URL**

```bash
# Vérifiez que le fichier .env existe
ls -la .env

# Vérifiez le contenu
cat .env | grep DATABASE_URL
```

### **Erreur de connexion PostgreSQL**

```bash
# Vérifiez que PostgreSQL est en cours d'exécution
brew services list | grep postgresql
# ou
docker ps | grep postgres

# Testez la connexion
psql postgresql://postgres:password@localhost:5432/postgres
```

### **Erreur Google OAuth**

1. Vérifiez que les URIs de redirection sont corrects
2. Vérifiez que l'API Google+ est activée
3. Vérifiez que les clés sont correctement copiées

---

## 📝 **Variables détaillées**

| Variable | Description | Requis | Exemple |
|----------|-------------|--------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | ✅ | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_URL` | URL de base de l'application | ✅ | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Clé secrète pour signer les tokens | ✅ | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | ID client Google OAuth | ⚠️ | `123456789-abc...` |
| `GOOGLE_CLIENT_SECRET` | Secret client Google OAuth | ⚠️ | `GOCSPX-...` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | 🔄 | `sk_test_...` |
| `BREVO_API_KEY` | Clé API Brevo (emails) | 🔄 | `xkeysib-...` |

**Légende :**
- ✅ Requis pour le fonctionnement de base
- ⚠️ Requis pour Google OAuth
- 🔄 Optionnel pour l'instant

---

> **Important** : Créez le fichier `.env` manuellement à la racine du projet avant de continuer. 