# 📸 **SYSTÈME D'UPLOAD D'IMAGES CLOUDINARY**

## **🎯 Vue d'ensemble**

Le système d'upload d'images permet aux utilisateurs de gérer leurs photos (avatars, galeries, documents de vérification) avec compression automatique, optimisation et stockage sécurisé via Cloudinary.

## **🏗️ Architecture**

### **Services backend**
- `UploadService`: Gestion des uploads vers Cloudinary
- `ImageService`: Gestion des images en base de données
- `API Routes`: Endpoints sécurisés pour l'upload

### **Composants frontend**
- `ImageUpload`: Composant générique drag & drop
- `AvatarUpload`: Spécialisé pour les avatars
- `GalleryUpload`: Gestion complète des galeries

## **🔧 Configuration**

### **1. Variables d'environnement**

Ajoutez ces variables dans votre `.env` :

```bash
# Cloudinary Image Upload
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### **2. Compte Cloudinary**

1. Créez un compte sur [Cloudinary](https://cloudinary.com/)
2. Accédez au Dashboard
3. Copiez vos identifiants depuis la section "Account Details"

### **3. Installation des dépendances**

```bash
npm install cloudinary multer @types/multer next-cloudinary react-dropzone
```

### **4. Configuration de sécurité**

```typescript
// Restriction des types de fichiers
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Taille maximale par fichier
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Nombre maximum de fichiers
const MAX_FILES = 10
```

## **📊 Modèle de données**

### **Schéma Prisma**

```prisma
model Image {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Image details
  type      String    // 'avatar', 'gallery', 'verification'
  url       String
  publicId  String    @unique // Cloudinary public ID
  
  // Metadata
  width     Int
  height    Int
  format    String
  bytes     Int
  
  // Organization
  position  Int       @default(0)
  isMain    Boolean   @default(false)
  
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  @@map("images")
}
```

## **🔄 Flux d'upload**

### **1. Upload d'avatar**

```typescript
// Frontend
const handleAvatarUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/upload/avatar', {
    method: 'POST',
    body: formData
  })
  
  const result = await response.json()
  // result.data.url contient l'URL de l'image
}
```

### **2. Upload de galerie**

```typescript
// Frontend
const handleGalleryUpload = async (files: File[]) => {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))
  
  const response = await fetch('/api/upload/gallery', {
    method: 'POST',
    body: formData
  })
  
  const result = await response.json()
  // result.data contient les informations des images
}
```

## **🎨 Utilisation des composants**

### **1. Composant d'upload générique**

```tsx
import ImageUpload from '@/components/upload/image-upload'

function MyComponent() {
  const handleUpload = async (files: File[]) => {
    // Logique d'upload
  }
  
  return (
    <ImageUpload
      onUpload={handleUpload}
      maxFiles={5}
      maxSize={10}
      multiple={true}
    />
  )
}
```

### **2. Composant d'avatar**

```tsx
import AvatarUpload from '@/components/upload/avatar-upload'

function ProfilePage() {
  const handleAvatarChange = (imageUrl: string) => {
    // Mettre à jour l'avatar
  }
  
  return (
    <AvatarUpload
      currentAvatar={user.avatar}
      userName={user.name}
      onUpload={handleAvatarChange}
    />
  )
}
```

### **3. Composant de galerie**

```tsx
import GalleryUpload from '@/components/upload/gallery-upload'

function GalleryPage() {
  const handleGalleryChange = (images: GalleryImage[]) => {
    // Gérer les changements de galerie
  }
  
  return (
    <GalleryUpload
      onImageChange={handleGalleryChange}
    />
  )
}
```

## **🛠️ APIs disponibles**

### **1. Upload d'avatar**
- **Endpoint**: `POST /api/upload/avatar`
- **Body**: FormData avec 'file'
- **Auth**: Requis
- **Limite**: 1 fichier, 5MB max

### **2. Upload de galerie**
- **Endpoint**: `POST /api/upload/gallery`
- **Body**: FormData avec 'files'
- **Auth**: Requis
- **Limite**: 10 fichiers, 10MB max par fichier

### **3. Récupération de galerie**
- **Endpoint**: `GET /api/upload/gallery`
- **Auth**: Requis
- **Retour**: Liste des images avec URLs optimisées

### **4. Mise à jour de galerie**
- **Endpoint**: `PUT /api/upload/gallery`
- **Body**: Actions (reorder, setMain)
- **Auth**: Requis

### **5. Suppression d'images**
- **Endpoint**: `DELETE /api/upload/delete`
- **Body**: imageId ou imageIds
- **Auth**: Requis

## **🔍 Optimisation d'images**

### **URLs automatiques**

Le système génère automatiquement plusieurs tailles :

```typescript
const optimizedUrls = {
  thumbnail: 'w_150,h_150,c_fill,f_webp,q_auto:good',
  medium: 'w_400,h_300,c_fill,f_webp,q_auto:good', 
  large: 'w_800,h_600,c_fill,f_webp,q_auto:good',
  original: 'f_webp,q_auto:good'
}
```

### **Transformations**

- **Avatars**: 400x400, crop face, WebP
- **Galerie**: 800x600, crop fill, WebP
- **Vérification**: 1200x900, crop limit, JPG

## **🔐 Sécurité**

### **Validation des fichiers**

```typescript
// Types autorisés
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Taille maximale
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

// Validation
function validateFile(file: File): boolean {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Type de fichier non supporté')
  }
  
  if (file.size > MAX_SIZE) {
    throw new Error('Fichier trop volumineux')
  }
  
  return true
}
```

### **Authentification**

Toutes les routes d'upload nécessitent une authentification :

```typescript
const session = await getServerSession(authOptions)
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
}
```

## **📈 Monitoring et statistiques**

### **Statistiques d'utilisation**

```typescript
const stats = await ImageService.getImageStats()
// Retourne:
// - Nombre total d'images
// - Taille totale utilisée
// - Répartition par type
```

### **Nettoyage automatique**

```typescript
// Supprimer les images orphelines
const cleanup = await ImageService.cleanupOrphanedImages()
```

## **🚀 Déploiement**

### **1. Configuration production**

```bash
# Cloudinary production
CLOUDINARY_CLOUD_NAME=your_prod_cloud_name
CLOUDINARY_API_KEY=your_prod_api_key
CLOUDINARY_API_SECRET=your_prod_api_secret
```

### **2. Optimisation des performances**

- Utiliser les CDN de Cloudinary
- Activer la compression automatique
- Mettre en cache les URLs optimisées

### **3. Monitoring**

- Surveiller l'utilisation du quota Cloudinary
- Monitorer les erreurs d'upload
- Suivre les statistiques de stockage

## **🔧 Dépannage**

### **Problèmes courants**

1. **Erreur "Missing credentials"**
   - Vérifiez vos variables d'environnement
   - Redémarrez le serveur après modification

2. **Upload échoue**
   - Vérifiez la taille du fichier
   - Contrôlez le type de fichier
   - Vérifiez la connexion internet

3. **Images non affichées**
   - Vérifiez les URLs générées
   - Contrôlez les permissions Cloudinary

### **Debug**

```typescript
// Activer les logs détaillés
console.log('[UploadService] Upload result:', result)
console.log('[ImageService] Image saved:', imageRecord)
```

## **🎯 Fonctionnalités avancées**

### **1. Drag & Drop**
- Zone de glisser-déposer intuitive
- Aperçu en temps réel
- Validation côté client

### **2. Réorganisation**
- Drag & drop pour réorganiser
- Définition d'image principale
- Sauvegarde automatique

### **3. Gestion des erreurs**
- Messages d'erreur clairs
- Retry automatique
- Fallback gracieux

## **📱 Responsive Design**

- Adapté mobile et desktop
- Grilles responsives
- Touch-friendly sur mobile

## **🔮 Améliorations futures**

1. **Édition d'images**
   - Crop/resize en ligne
   - Filtres et effets
   - Annotation

2. **Batch operations**
   - Upload en masse
   - Traitement par lots
   - Progress tracking

3. **Intégration AI**
   - Détection de contenu
   - Modération automatique
   - Tagging intelligent

---

## **✅ Checklist d'intégration**

- [ ] Configuration Cloudinary
- [ ] Variables d'environnement
- [ ] Migration base de données
- [ ] Tests d'upload
- [ ] Validation sécurité
- [ ] Tests mobile
- [ ] Documentation utilisateur
- [ ] Monitoring production

Le système d'upload d'images est maintenant prêt pour la production ! 🎉 