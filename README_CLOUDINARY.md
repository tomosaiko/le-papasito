# 🚀 SYSTÈME D'UPLOAD CLOUDINARY - LE PAPASITO

## **⚡ CONFIGURATION RAPIDE**

### **1. Configuration automatique**
```bash
npm run setup:cloudinary
```

### **2. Configuration manuelle** 
1. Créez un compte sur [Cloudinary](https://cloudinary.com/users/register_free)
2. Copiez le fichier `config/env.template` vers `.env.local`
3. Remplacez les valeurs par vos identifiants Cloudinary

### **3. Test du système**
```bash
npm run dev
```
Puis allez sur : http://localhost:3000/demo-upload

---

## **🎯 UTILISATION DES COMPOSANTS**

### **Avatar Upload**
```tsx
import AvatarUpload from '@/components/upload/avatar-upload'

<AvatarUpload
  currentAvatar={user.avatar}
  userName={user.name}
  onUpload={(imageUrl) => {
    // Mettre à jour l'avatar
    console.log('Nouvel avatar:', imageUrl)
  }}
/>
```

### **Gallery Upload**
```tsx
import GalleryUpload from '@/components/upload/gallery-upload'

<GalleryUpload
  images={user.gallery}
  onImagesChange={(images) => {
    // Mettre à jour la galerie
    console.log('Nouvelle galerie:', images)
  }}
/>
```

### **Upload Générique**
```tsx
import ImageUpload from '@/components/upload/image-upload'

<ImageUpload
  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
  maxFileSize={5 * 1024 * 1024} // 5MB
  multiple={true}
  onUpload={(files) => {
    // Traiter les fichiers
    console.log('Fichiers uploadés:', files)
  }}
/>
```

---

## **📋 API ENDPOINTS**

### **Upload Avatar**
```javascript
POST /api/upload/avatar
Content-Type: multipart/form-data

// Réponse
{
  "success": true,
  "data": {
    "id": "img_123",
    "url": "https://res.cloudinary.com/...",
    "optimizedUrls": {
      "thumbnail": "https://res.cloudinary.com/.../w_150,h_150",
      "medium": "https://res.cloudinary.com/.../w_400,h_400"
    }
  }
}
```

### **Upload Gallery**
```javascript
POST /api/upload/gallery
Content-Type: multipart/form-data

// Réponse
{
  "success": true,
  "data": [
    {
      "id": "img_456",
      "url": "https://res.cloudinary.com/...",
      "position": 1,
      "isMain": false
    }
  ]
}
```

### **Delete Image**
```javascript
DELETE /api/upload/delete
Content-Type: application/json

{
  "imageId": "img_123"
}
```

---

## **⚙️ CONFIGURATION AVANCÉE**

### **Upload Presets Cloudinary**

Créez ces presets dans votre console Cloudinary :

**Avatar Preset (`avatar_preset`)**
```javascript
{
  "name": "avatar_preset",
  "unsigned": true,
  "folder": "avatars/",
  "transformation": {
    "width": 400,
    "height": 400,
    "crop": "fill",
    "gravity": "face",
    "format": "webp",
    "quality": "auto:good"
  }
}
```

**Gallery Preset (`gallery_preset`)**
```javascript
{
  "name": "gallery_preset", 
  "unsigned": true,
  "folder": "gallery/",
  "transformation": {
    "width": 800,
    "height": 600,
    "crop": "limit",
    "format": "webp",
    "quality": "auto:good"
  }
}
```

### **Variables d'environnement**
```bash
# Required
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

---

## **🔧 FEATURES TECHNIQUES**

### **✅ Fonctionnalités implémentées**
- 🖼️ **Upload d'avatars** avec détection de visage
- 🎨 **Upload de galeries** avec réorganisation drag & drop
- 📱 **Interface responsive** avec prévisualisation
- 🔒 **Sécurité** : authentification NextAuth.js requise
- ⚡ **Optimisation automatique** : WebP, compression, multiple tailles
- 🗄️ **Base de données** : Prisma avec modèle Image complet
- 🔄 **Gestion d'erreurs** : validation côté client et serveur
- 🎯 **UX moderne** : loading states, progress bars, animations

### **🛠️ Services**
- **UploadService** : Gestion Cloudinary (upload, delete, optimisation)
- **ImageService** : Gestion base de données (CRUD, organisation)

### **🎨 Composants**
- **ImageUpload** : Composant générique drag & drop
- **AvatarUpload** : Spécialisé pour les avatars
- **GalleryUpload** : Gestion complète des galeries

---

## **🚀 DÉPLOIEMENT**

### **1. Variables d'environnement production**
```bash
# Vercel/Netlify/Railway
CLOUDINARY_CLOUD_NAME=your_production_cloud_name
CLOUDINARY_API_KEY=your_production_api_key
CLOUDINARY_API_SECRET=your_production_api_secret
```

### **2. Migration base de données**
```bash
npx prisma migrate deploy
```

### **3. Test post-déploiement**
Vérifiez que tous les endpoints fonctionnent :
- ✅ Upload avatar
- ✅ Upload galerie
- ✅ Suppression d'images
- ✅ Optimisation des images

---

## **📊 MONITORING**

### **Métriques Cloudinary**
- Quota mensuel : 25 000 transformations (plan gratuit)
- Stockage : 25 GB (plan gratuit)
- Bande passante : 25 GB/mois (plan gratuit)

### **Surveillance**
```javascript
// Vérifier l'usage
const usage = await cloudinary.api.usage()
console.log('Transformations:', usage.transformations.usage)
console.log('Stockage:', usage.storage.usage)
```

---

## **🆘 DÉPANNAGE**

### **Erreurs courantes**

**401 Unauthorized**
```bash
# Vérifiez vos identifiants
echo $CLOUDINARY_API_KEY
echo $CLOUDINARY_CLOUD_NAME
```

**Upload échoue**
- Vérifiez les formats autorisés (JPEG, PNG, WebP)
- Contrôlez la taille max (5MB avatar, 10MB galerie)
- Vérifiez la connexion internet

**Images pas optimisées**
- Vérifiez les upload presets
- Contrôlez les transformations Cloudinary
- Testez les URLs générées

### **Logs de debug**
```bash
# Activer les logs Cloudinary
export CLOUDINARY_DEBUG=true
npm run dev
```

---

## **📖 DOCUMENTATION**

- 📝 **Guide complet** : `docs/CLOUDINARY_PRODUCTION_SETUP.md`
- 🛠️ **Configuration** : `config/env.template`
- 🎮 **Démonstration** : http://localhost:3000/demo-upload
- 🔧 **Script setup** : `npm run setup:cloudinary`

---

## **🎉 PRÊT À L'EMPLOI !**

Le système d'upload Cloudinary est maintenant **100% opérationnel** ! 

🚀 **Prochaines étapes :**
1. Configurez vos identifiants Cloudinary
2. Testez avec la page de démonstration
3. Intégrez dans vos composants
4. Déployez en production

**Bon développement !** 🎯 