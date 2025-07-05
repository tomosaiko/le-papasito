#!/usr/bin/env node

/**
 * 🚀 SCRIPT CONFIGURATION CLOUDINARY - LE PAPASITO
 * 
 * Ce script aide à configurer et tester la connexion Cloudinary
 * 
 * Usage:
 *   node scripts/setup-cloudinary.js
 *   npm run setup:cloudinary
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

// Colors pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`${colors.bright}${colors.blue}🚀 ${msg}${colors.reset}`)
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${prompt}${colors.reset}`, resolve)
  })
}

async function main() {
  log.title('CONFIGURATION CLOUDINARY - LE PAPASITO')
  console.log('')
  
  // Vérifier si .env.local existe
  const envLocalPath = path.join(process.cwd(), '.env.local')
  const envPath = path.join(process.cwd(), '.env')
  
  log.info('Vérification des fichiers d\'environnement...')
  
  if (fs.existsSync(envLocalPath)) {
    log.success('.env.local trouvé')
  } else {
    log.warn('.env.local non trouvé')
  }
  
  if (fs.existsSync(envPath)) {
    log.success('.env trouvé')
  } else {
    log.warn('.env non trouvé')
  }
  
  console.log('')
  log.info('Pour configurer Cloudinary, vous devez :')
  console.log('1. Créer un compte sur https://cloudinary.com/users/register_free')
  console.log('2. Récupérer vos identifiants dans le Dashboard')
  console.log('3. Les ajouter aux variables d\'environnement')
  console.log('')
  
  const configure = await question('Voulez-vous configurer Cloudinary maintenant ? (y/N): ')
  
  if (configure.toLowerCase() !== 'y' && configure.toLowerCase() !== 'yes') {
    log.info('Configuration annulée. Consultez docs/CLOUDINARY_PRODUCTION_SETUP.md pour les instructions complètes.')
    rl.close()
    return
  }
  
  // Demander les credentials
  console.log('')
  log.title('SAISIE DES IDENTIFIANTS CLOUDINARY')
  
  const cloudName = await question('Cloud Name: ')
  const apiKey = await question('API Key: ')
  const apiSecret = await question('API Secret: ')
  
  if (!cloudName || !apiKey || !apiSecret) {
    log.error('Tous les champs sont requis !')
    rl.close()
    return
  }
  
  // Générer le contenu .env
  const envContent = `
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=${cloudName}
CLOUDINARY_API_KEY=${apiKey}
CLOUDINARY_API_SECRET=${apiSecret}

# Alternative format
CLOUDINARY_URL=cloudinary://${apiKey}:${apiSecret}@${cloudName}
`
  
  // Écrire dans .env.local
  try {
    fs.writeFileSync(envLocalPath, envContent.trim())
    log.success('.env.local créé avec succès !')
  } catch (error) {
    log.error(`Erreur lors de la création de .env.local: ${error.message}`)
    rl.close()
    return
  }
  
  // Tester la connexion
  console.log('')
  log.title('TEST DE LA CONNEXION')
  
  try {
    // Charger les variables d'environnement
    require('dotenv').config({ path: envLocalPath })
    
    // Vérifier si cloudinary est installé
    let cloudinary
    try {
      cloudinary = require('cloudinary').v2
    } catch (error) {
      log.error('❌ Package cloudinary non trouvé. Installez-le avec: npm install cloudinary')
      return
    }
    
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })
    
    log.info('Test de connexion en cours...')
    
    // Test simple de l'API
    const result = await cloudinary.api.ping()
    
    log.success('✅ Connexion Cloudinary réussie !')
    log.success(`Status: ${result.status}`)
    
    // Vérifier les quotas
    try {
      const usage = await cloudinary.api.usage()
      log.info(`Utilisation: ${usage.transformations.usage} / ${usage.transformations.limit} transformations`)
      log.info(`Stockage: ${Math.round(usage.storage.usage / 1024 / 1024)} MB utilisés`)
    } catch (usageError) {
      log.warn('Impossible de récupérer les quotas (compte gratuit)')
    }
    
  } catch (error) {
    log.error('❌ Erreur de connexion Cloudinary :')
    console.error(error.message)
    
    if (error.message.includes('Must supply api_key')) {
      log.warn('Vérifiez votre API Key')
    } else if (error.message.includes('Must supply cloud_name')) {
      log.warn('Vérifiez votre Cloud Name')
    } else if (error.message.includes('Invalid API key')) {
      log.warn('API Key invalide - vérifiez vos identifiants')
    } else if (error.message.includes('401')) {
      log.warn('Authentification échouée - vérifiez vos identifiants')
    } else {
      log.warn('Vérifiez vos identifiants et votre connexion internet')
    }
  }
  
  // Instructions finales
  console.log('')
  log.title('PROCHAINES ÉTAPES')
  console.log('1. ✅ Testez les uploads: npm run dev puis http://localhost:3000/demo-upload')
  console.log('2. 📖 Consultez la documentation: docs/CLOUDINARY_PRODUCTION_SETUP.md')
  console.log('3. 🔧 Configurez les upload presets dans Cloudinary Console')
  console.log('4. 🚀 Déployez en production avec les bonnes variables d\'environnement')
  
  rl.close()
}

// Gérer les erreurs
process.on('unhandledRejection', (error) => {
  log.error(`Erreur non gérée: ${error.message}`)
  process.exit(1)
})

// Lancer le script
main().catch((error) => {
  log.error(`Erreur: ${error.message}`)
  process.exit(1)
}) 