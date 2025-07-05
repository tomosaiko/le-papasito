# 📚 Guide d'utilisation de la documentation

## 🎯 **Objectif**

Ce guide explique comment utiliser et maintenir le système de documentation vivante du projet Le Papasito. Il s'adresse aux développeurs qui ajoutent de nouvelles fonctionnalités.

---

## 📁 **Structure de la documentation**

```
docs/
├── README.md                    # Documentation principale
├── GUIDE_DOCUMENTATION.md       # Ce guide
├── FEATURE_TEMPLATE.md          # Template pour nouvelles fonctionnalités
├── api/
│   ├── routes.md               # Documentation des API routes
│   ├── services.md             # Documentation des services métier
│   └── auth.md                 # Documentation d'authentification
├── database/
│   ├── schema.md               # Schéma de base de données
│   ├── services.md             # Services de base de données
│   └── migrations.md           # Historique des migrations
├── features/
│   ├── database-prisma.md      # Exemple de fonctionnalité documentée
│   ├── users.md                # Documentation utilisateurs
│   └── ...                     # Autres fonctionnalités
├── ui/
│   ├── components.md           # Composants UI
│   └── pages.md                # Pages et layouts
└── security/
    ├── auth.md                 # Authentification
    └── best-practices.md       # Bonnes pratiques
```

---

## 🔄 **Processus de documentation**

### **1. Avant le développement**

#### **Planification**
1. **Créer un nouveau fichier** : `docs/features/[nom-fonctionnalité].md`
2. **Copier le template** : `docs/FEATURE_TEMPLATE.md`
3. **Remplir les sections** :
   - Vue d'ensemble
   - Cas d'usage
   - Architecture technique
   - Critères d'acceptation

#### **Exemple de création**
```bash
# Créer une nouvelle fonctionnalité
cp docs/FEATURE_TEMPLATE.md docs/features/authentification-nextauth.md

# Éditer et personnaliser
# Remplacer tous les [placeholders] par les vraies valeurs
```

### **2. Pendant le développement**

#### **Mise à jour continue**
- ✅ **Compléter l'implémentation** au fur et à mesure
- ✅ **Documenter les API** avec exemples concrets
- ✅ **Ajouter les exemples d'utilisation** testés
- ✅ **Mettre à jour les types TypeScript**

#### **Sections à maintenir**
```markdown
## 🔧 **Implémentation**
- Services créés/modifiés
- API Routes créées/modifiées
- Composants UI créés/modifiés

## 📋 **API Documentation**
- Endpoints avec exemples
- Paramètres et réponses
- Codes d'erreur
```

### **3. Après le développement**

#### **Finalisation**
1. **Compléter tous les exemples** et s'assurer qu'ils fonctionnent
2. **Ajouter les tests** et leur documentation
3. **Mettre à jour le changelog** avec les modifications
4. **Marquer le statut** comme ✅ **Terminé**

#### **Mise à jour des documents centraux**
```markdown
# Mettre à jour docs/README.md
- Ajouter la fonctionnalité dans le tableau d'avancement
- Mettre à jour la roadmap
- Modifier le changelog général

# Mettre à jour docs/api/routes.md
- Ajouter les nouveaux endpoints
- Compléter les exemples d'utilisation
```

---

## 📝 **Utilisation du template**

### **1. Copier le template**
```bash
cp docs/FEATURE_TEMPLATE.md docs/features/ma-nouvelle-fonctionnalité.md
```

### **2. Remplacer les placeholders**

#### **Rechercher et remplacer**
```bash
# Remplacer tous les [placeholders] par les vraies valeurs
[Nom de la fonctionnalité] → "Authentification NextAuth.js"
[NomService] → "AuthService"
[HTTP_METHOD] → "POST"
[endpoint] → "auth/signin"
# etc.
```

#### **Sections obligatoires à compléter**
- **Description** : Objectif clair de la fonctionnalité
- **Cas d'usage** : Utilisateurs cibles et scénarios
- **Architecture** : Composants affectés
- **Implémentation** : Code et services
- **API Documentation** : Endpoints avec exemples
- **Tests** : Stratégie de test
- **Sécurité** : Considérations et validations

### **3. Exemples concrets**

#### **Bon exemple de description**
```markdown
### **Description**
Implémentation de l'authentification NextAuth.js avec support pour Google OAuth, connexion par email/mot de passe, et gestion des sessions sécurisées. Cette fonctionnalité remplace le système d'authentification basique par une solution robuste et sécurisée.
```

#### **Mauvais exemple**
```markdown
### **Description**
Ajout de l'authentification avec NextAuth.js.
```

---

## 🔧 **Standards de documentation**

### **1. Format et style**

#### **Titres et structure**
```markdown
# 🔧 **Nom de la fonctionnalité**
## 📋 **Section principale**
### **Sous-section**
#### **Détail**
```

#### **Codes et exemples**
```markdown
// ✅ Bon exemple avec contexte
```typescript
// Service d'authentification
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  // Configuration...
}
```

// ❌ Mauvais exemple sans contexte
```typescript
const config = { ... }
```
```

### **2. Exemples d'utilisation**

#### **Toujours inclure**
- **Côté client** : Utilisation dans React
- **Côté serveur** : Utilisation dans API routes
- **Configuration** : Variables d'environnement
- **Commandes** : Scripts npm/yarn

#### **Format standard**
```markdown
### **Côté client (Frontend)**
```typescript
// Exemple d'utilisation dans un composant React
import { useSession } from 'next-auth/react'

export function LoginButton() {
  const { data: session } = useSession()
  
  if (session) {
    return <p>Connecté en tant que {session.user.email}</p>
  }
  
  return <button onClick={() => signIn()}>Se connecter</button>
}
```

### **Côté serveur (Backend)**
```typescript
// Exemple d'utilisation dans une API route
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  
  return NextResponse.json({ user: session.user })
}
```
```

### **3. Documentation API**

#### **Format standardisé**
```markdown
#### **POST /api/auth/signin**
Connexion utilisateur avec email et mot de passe.

**Paramètres requis :**
```json
{
  "email": "string - Email de l'utilisateur",
  "password": "string - Mot de passe"
}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  },
  "token": "string"
}
```

**Exemple d'utilisation :**
```javascript
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'motdepasse123'
  })
})
```
```

---

## ✅ **Checklist de validation**

### **Avant de commencer**
- [ ] Template copié et renommé
- [ ] Titre et description complétés
- [ ] Cas d'usage identifiés
- [ ] Architecture planifiée

### **Pendant le développement**
- [ ] Implémentation documentée au fur et à mesure
- [ ] Exemples d'utilisation testés
- [ ] API documentée avec paramètres et réponses
- [ ] Types TypeScript documentés

### **Après le développement**
- [ ] Tous les exemples fonctionnent
- [ ] Tests documentés
- [ ] Changelog mis à jour
- [ ] Documentation centrale mise à jour
- [ ] Statut marqué comme ✅ **Terminé**

---

## 🔄 **Maintenance de la documentation**

### **1. Mise à jour régulière**

#### **Quand mettre à jour**
- ✅ **Ajout de fonctionnalité** : Nouvelle documentation
- ✅ **Modification de code** : Mise à jour des exemples
- ✅ **Correction de bug** : Mise à jour du changelog
- ✅ **Refactoring** : Mise à jour de l'architecture

#### **Workflow de mise à jour**
```bash
# 1. Identifier les documents affectés
# 2. Mettre à jour les exemples
# 3. Tester les exemples
# 4. Mettre à jour le changelog
# 5. Commit avec message descriptif
```

### **2. Versioning**

#### **Format de versioning**
```markdown
## 📝 **Changelog**

### **v1.1.0** - 2024-01-06
**✅ Ajouté :**
- Support pour Google OAuth
- Gestion des sessions persistantes

**🔧 Modifié :**
- Amélioration de la sécurité des tokens
- Interface utilisateur de connexion

**🐛 Corrigé :**
- Problème de redirection après connexion
- Gestion des erreurs de connexion
```

### **3. Review et qualité**

#### **Critères de qualité**
- **Clarté** : Explications compréhensibles
- **Complétude** : Tous les cas d'usage couverts
- **Exactitude** : Exemples testés et fonctionnels
- **Consistance** : Format uniforme
- **Maintenance** : Synchronisation avec le code

#### **Process de review**
```markdown
1. **Auto-review** : Vérifier la checklist
2. **Test des exemples** : Exécuter tous les exemples
3. **Validation** : Vérifier la cohérence
4. **Mise à jour** : Synchroniser avec le code
```

---

## 🎯 **Bonnes pratiques**

### **1. Écriture**

#### **✅ À faire**
- Utiliser des exemples concrets et testés
- Expliquer le "pourquoi" pas seulement le "comment"
- Inclure les cas d'erreur et leur gestion
- Mettre les informations importantes en évidence
- Utiliser des liens vers la documentation externe

#### **❌ À éviter**
- Copier-coller sans adapter
- Laisser des placeholders [non remplacés]
- Donner des exemples qui ne fonctionnent pas
- Faire des descriptions trop vagues
- Oublier de mettre à jour après modifications

### **2. Organisation**

#### **Structure logique**
```markdown
1. **Vue d'ensemble** : Qu'est-ce que c'est ?
2. **Cas d'usage** : Quand l'utiliser ?
3. **Architecture** : Comment c'est construit ?
4. **Implémentation** : Comment c'est codé ?
5. **Utilisation** : Comment l'utiliser ?
6. **Tests** : Comment le tester ?
7. **Maintenance** : Comment l'éviter ?
```

### **3. Exemples**

#### **Exemples complets**
```typescript
// ✅ Exemple complet avec contexte
'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      
      if (result?.error) {
        console.error('Erreur de connexion:', result.error)
      } else {
        console.log('Connexion réussie')
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulaire complet... */}
    </form>
  )
}
```

---

## 📞 **Support et questions**

### **En cas de problème**
1. **Vérifier la checklist** de validation
2. **Consulter les exemples** existants
3. **Tester les exemples** avant de documenter
4. **Demander une review** si nécessaire

### **Ressources utiles**
- **Template** : `docs/FEATURE_TEMPLATE.md`
- **Exemples** : `docs/features/database-prisma.md`
- **Documentation API** : `docs/api/routes.md`
- **Markdown Guide** : Pour le formatage

---

> **Rappel** : La documentation est un code vivant qui évolue avec le projet. Elle doit être maintenue avec la même rigueur que le code source pour rester utile et fiable. 