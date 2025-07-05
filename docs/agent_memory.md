# 🧠 AGENT MEMORY - LE PAPASITO

## 🏗️ ARCHITECTURE COMPRISE

### Stack Principal
- **Framework** : Next.js 15 avec App Router
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : NextAuth.js v5 avec OAuth Google
- **Cache** : Redis (ioredis) avec TTL intelligent
- **Paiements** : Stripe avec gestion des commissions
- **Email** : Brevo (ex-Sendinblue) avec templates HTML
- **Upload** : Cloudinary avec optimisations multiples
- **UI** : shadcn/ui + Tailwind CSS
- **Tests** : Jest + Testing Library React + E2E

### Patterns Identifiés
- **Services Pattern** : Services métier bien séparés (AuthService, BookingService, etc.)
- **Repository Pattern** : Couche d'abstraction Prisma
- **Factory Pattern** : Configuration NextAuth et Stripe
- **Observer Pattern** : Système d'analytics et monitoring
- **Transaction Pattern** : Gestion d'erreurs avec rollback automatique

### Conventions Respectées
- **Naming** : camelCase pour JavaScript/TypeScript, kebab-case pour les URLs
- **Structure** : App Router Next.js 15 avec co-location des composants
- **Types** : TypeScript strict avec Zod pour validation
- **Commits** : Messages conventionnels avec scope
- **Documentation** : Markdown avec templates standardisés

## ⚠️ POINTS D'ATTENTION

### Éléments Critiques À Ne Pas Casser
- **Système d'authentification** : NextAuth.js avec callbacks personnalisés
- **Configuration Prisma** : 17 modèles avec relations complexes
- **Cache Redis** : TTL stratégique avec invalidation sélective
- **API Stripe** : Webhooks avec validation et idempotence
- **Transactions d'upload** : Rollback automatique en cas d'échec

### Dépendances Fragiles
- **Cloudinary** : Transformation d'images avec presets spécifiques
- **Brevo** : Templates email avec variables dynamiques
- **Redis** : Stratégie de cache avec namespacing
- **Prisma** : Migrations avec contraintes de clés étrangères

### Configurations Spécifiques
- **Middleware** : Protection des routes avec rôles
- **Variables d'environnement** : 15+ variables critiques
- **Webhooks** : Validation des signatures Stripe
- **CORS** : Configuration pour upload d'images

## 📚 APPRENTISSAGES

### Bonnes Pratiques Découvertes
- **ErrorManagementService** : Gestion transactionnelle avec retry automatique
- **AnalyticsService** : Métriques temps réel avec Redis
- **CacheService** : TTL intelligent avec invalidation sélective
- **Tests E2E** : Nettoyage automatique des données de test
- **Documentation** : Structure vivante avec changelog automatique

### Optimisations Appliquées
- **Upload Pipeline** : Transactions avec rollback automatique
- **Cache Strategy** : TTL adaptatif selon le type de données
- **Performance Monitoring** : Métriques automatiques Redis
- **Error Handling** : Retry avec backoff exponentiel
- **Database Indexing** : Index optimisés pour les requêtes complexes

### Erreurs À Éviter
- **Pas de hardcoding** : Toutes les configs externalisées
- **Pas de console.log** : Système de logging structuré
- **Pas de TODO** : Documentation claire des améliorations futures
- **Pas de code mort** : Nettoyage automatique des imports

## 🔗 CONNEXIONS

### APIs Externes
- **Cloudinary** : Upload et transformation d'images
- **Stripe** : Paiements et webhooks
- **Google OAuth** : Authentification sociale
- **Brevo** : Emails transactionnels
- **Redis** : Cache et sessions

### Services Intégrés
- **NextAuth.js** : Authentification complète
- **Prisma** : ORM avec migrations
- **Jest** : Tests unitaires et E2E
- **Tailwind CSS** : Styling responsive
- **TypeScript** : Type safety complète

### Bases de Données
- **PostgreSQL** : Base principale avec 17 tables
- **Redis** : Cache et analytics
- **Cloudinary** : Stockage d'images

## 🚀 PROCHAINES ÉTAPES IDENTIFIÉES

### ÉTAPE 4 : Interface Mobile & PWA
- **Objectif** : Créer une application mobile responsive
- **Priorité** : HAUTE
- **Complexité** : MOYENNE
- **Durée estimée** : 4-6 heures

### Améliorations Continues
- **Monitoring** : Dashboard temps réel
- **SEO** : Optimisations avancées
- **Performance** : Optimisations bundle
- **Sécurité** : Audit sécuritaire complet

---

*Dernière mise à jour : 2025-01-16*
*Version : 1.0.0* 