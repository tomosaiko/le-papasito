# 🔐 **CONFIGURATION GOOGLE OAUTH - LE PAPASITO**

## **Vue d'ensemble**

Ce guide explique comment configurer l'authentification Google OAuth pour Le Papasito en utilisant Google Cloud Console et NextAuth.js.

## **1. Configuration Google Cloud Console**

### **Étape 1 : Créer un Projet Google Cloud**

1. **Aller sur Google Cloud Console**
   - Visitez : https://console.cloud.google.com/
   - Connectez-vous avec votre compte Google

2. **Créer un nouveau projet**
   ```
   - Cliquez sur "Select a project" en haut
   - Cliquez sur "New Project"
   - Nom du projet : "le-papasito-oauth"
   - Organization : Votre organisation (optionnel)
   - Cliquez sur "Create"
   ```

3. **Sélectionner le projet**
   - Assurez-vous que "le-papasito-oauth" est sélectionné

### **Étape 2 : Activer l'API Google+**

1. **Naviguer vers APIs & Services**
   ```
   - Menu hamburger → APIs & Services → Library
   - Rechercher "Google+ API"
   - Cliquer sur "Google+ API"
   - Cliquer sur "Enable"
   ```

2. **Activer Google People API (recommandé)**
   ```
   - Retourner à Library
   - Rechercher "People API"
   - Cliquer sur "People API"
   - Cliquer sur "Enable"
   ```

### **Étape 3 : Configurer l'écran de consentement OAuth**

1. **Naviguer vers OAuth consent screen**
   ```
   - APIs & Services → OAuth consent screen
   - Choisir "External" (pour tester avec comptes externes)
   - Cliquer sur "Create"
   ```

2. **Remplir les informations obligatoires**
   ```
   App name: Le Papasito
   User support email: votre-email@example.com
   App logo: (optionnel, uploader le logo)
   App domain: 
     - Application home page: https://votre-domaine.com
     - Application privacy policy: https://votre-domaine.com/privacy
     - Application terms of service: https://votre-domaine.com/terms
   
   Developer contact information:
     - Email: votre-email@example.com
   ```

3. **Scopes (Étape 2)**
   ```
   - Cliquer sur "Add or Remove Scopes"
   - Sélectionner :
     ✅ ../auth/userinfo.email
     ✅ ../auth/userinfo.profile
     ✅ openid
   - Cliquer sur "Update"
   ```

4. **Test users (Étape 3 - pour External)**
   ```
   - Ajouter vos emails de test
   - Ajouter les emails des développeurs
   ```

5. **Summary (Étape 4)**
   - Vérifier les informations
   - Cliquer sur "Back to Dashboard"

### **Étape 4 : Créer les identifiants OAuth**

1. **Naviguer vers Credentials**
   ```
   - APIs & Services → Credentials
   - Cliquer sur "+ Create Credentials"
   - Sélectionner "OAuth 2.0 Client ID"
   ```

2. **Configurer l'application web**
   ```
   Application type: Web application
   Name: Le Papasito Web Client
   
   Authorized JavaScript origins:
   - http://localhost:3000 (développement)
   - https://votre-domaine.com (production)
   
   Authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google (développement)
   - https://votre-domaine.com/api/auth/callback/google (production)
   ```

3. **Récupérer les identifiants**
   ```
   ✅ Client ID: 123456789-xxxxxxxxxx.apps.googleusercontent.com
   ✅ Client Secret: GOCSPX-xxxxxxxxxxxxxxxxxxxx
   
   ⚠️ IMPORTANT : Copier et sauvegarder ces valeurs immédiatement
   ```

## **2. Configuration des Variables d'Environnement**

### **Variables requises pour .env.local**

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789-xxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx

# NextAuth Configuration (déjà configuré)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-securise

# Database (déjà configuré)
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/le_papasito_db
```

## **3. URLs de Callback par Environnement**

### **Développement**
```
Base URL: http://localhost:3000
Callback URL: http://localhost:3000/api/auth/callback/google
```

### **Production**
```
Base URL: https://votre-domaine.com
Callback URL: https://votre-domaine.com/api/auth/callback/google
```

### **Staging (optionnel)**
```
Base URL: https://staging.votre-domaine.com
Callback URL: https://staging.votre-domaine.com/api/auth/callback/google
```

## **4. Sécurité et Bonnes Pratiques**

### **Domaines autorisés**
- ✅ Toujours utiliser HTTPS en production
- ✅ Limiter les domaines dans Google Console
- ✅ Utiliser des secrets différents par environnement

### **Scopes minimaux**
```
email - Accès à l'adresse email
profile - Accès au nom et avatar
openid - Authentification OpenID Connect
```

### **Gestion des erreurs**
- ❌ Domaine non autorisé
- ❌ Client ID invalide
- ❌ Redirect URI mismatch
- ❌ Scope non autorisé

## **5. Vérification de la Configuration**

### **Checklist pré-déploiement**

```bash
✅ Projet Google Cloud créé
✅ APIs activées (Google+ API, People API)
✅ OAuth consent screen configuré
✅ Identifiants OAuth créés
✅ Variables d'environnement configurées
✅ URLs de callback ajoutées
✅ Tests en développement réussis
```

### **URLs de test**

```bash
# Test du provider
GET http://localhost:3000/api/auth/providers

# Test de connexion
GET http://localhost:3000/api/auth/signin

# Test de callback (automatique)
GET http://localhost:3000/api/auth/callback/google
```

## **6. Monitoring et Analytics**

### **Google Cloud Console**
- **Quotas et limites** : APIs & Services → Quotas
- **Utilisation** : APIs & Services → Dashboard
- **Erreurs** : Logging → Logs Explorer

### **Métriques recommandées**
- Nombre de connexions Google par jour
- Taux d'erreur des authentifications
- Temps de réponse de l'API Google

## **7. Résolution de Problèmes**

### **Erreurs courantes**

**1. "redirect_uri_mismatch"**
```
Solution:
- Vérifier que l'URL de callback est exactement la même
- Inclure le port en développement
- Pas de trailing slash
```

**2. "invalid_client"**
```
Solution:
- Vérifier GOOGLE_CLIENT_ID
- Vérifier que le projet est actif
- Régénérer les identifiants si nécessaire
```

**3. "access_denied"**
```
Solution:
- Vérifier l'écran de consentement
- Ajouter l'utilisateur aux test users
- Vérifier les scopes demandés
```

**4. "unauthorized_client"**
```
Solution:
- Vérifier que l'application web est configurée
- Vérifier les authorized JavaScript origins
- Attendre la propagation (jusqu'à 5 minutes)
```

### **Debug Mode**

```bash
# Activer les logs détaillés NextAuth
NEXTAUTH_DEBUG=true npm run dev

# Vérifier la configuration
curl http://localhost:3000/api/auth/providers
```

## **8. Migration vers Production**

### **Étapes de déploiement**

1. **Mettre à jour Google Console**
   - Ajouter le domaine de production
   - Ajouter l'URL de callback de production
   - Passer en mode "In production" si nécessaire

2. **Variables d'environnement production**
   ```bash
   GOOGLE_CLIENT_ID=same-as-dev
   GOOGLE_CLIENT_SECRET=same-as-dev
   NEXTAUTH_URL=https://votre-domaine.com
   NEXTAUTH_SECRET=new-production-secret
   ```

3. **Tests de validation**
   - Tester la connexion Google
   - Vérifier la création de compte
   - Valider les données récupérées

---

## **Résumé des Étapes**

1. ✅ **Google Cloud Console** : Projet créé avec APIs activées
2. ✅ **OAuth Consent Screen** : Configuré avec scopes appropriés  
3. ✅ **Identifiants OAuth** : Client ID et Secret générés
4. ✅ **URLs de Callback** : Configurées pour dev et prod
5. ✅ **Variables d'environnement** : Ajoutées au projet
6. ✅ **Tests et validation** : Workflow complet vérifié

Cette configuration permet une authentification Google sécurisée et scalable pour Le Papasito. 