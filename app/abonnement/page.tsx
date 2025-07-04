"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { easeOut } from "framer-motion"
import { Crown, Star, Diamond, Gift, Check, ChevronRight, Sparkles, Infinity, Shield, Award, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useInView } from "react-intersection-observer"

export default function AbonnementPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Référence pour le défilement vers les plans
  const plansRef = useRef<HTMLDivElement>(null)

  // Fonction pour défiler vers les plans
  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Hooks pour les animations basées sur le défilement
  const [ref1, inView1] = useInView({ triggerOnce: false, threshold: 0.2 })
  const [ref2, inView2] = useInView({ triggerOnce: false, threshold: 0.2 })
  const [ref3, inView3] = useInView({ triggerOnce: false, threshold: 0.2 })
  const [ref4, inView4] = useInView({ triggerOnce: false, threshold: 0.2 })

  // Fonction pour sélectionner un plan
  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan)
  }

  // Animation variants pour Framer Motion
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeOut },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3, ease: easeOut },
    },
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section avec animation d'entrée */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Vidéo de fond avec overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/70 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black z-20"></div>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover opacity-40"
          >
            <source src="/flowing-elegance.png" type="video/mp4" />
          </video>
        </div>

        {/* Contenu du hero avec animation */}
        <div className="relative z-30 container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate={isPageLoaded ? "visible" : "hidden"}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeIn} className="flex justify-center">
              <div className="inline-block relative">
                <Sparkles className="h-12 w-12 text-yellow-400 absolute -top-6 -right-6 animate-pulse" />
                <div className="text-sm uppercase tracking-widest bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent font-semibold py-2 px-4 rounded-full border border-yellow-400/30">
                  Exclusivité
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent pb-2"
            >
              Hey Papasito Privilège
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 mt-4">
              Découvrez une nouvelle dimension de plaisir avec notre système d'abonnement révolutionnaire
            </motion.p>

            <motion.div variants={fadeIn}>
              <Button
                onClick={scrollToPlans}
                className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                Découvrir les privilèges
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
            >
              <div className="w-8 h-14 rounded-full border-2 border-white/30 flex justify-center pt-2">
                <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Section des plans d'abonnement */}
      <div ref={plansRef} className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref1}
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Choisissez votre niveau de privilège
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
              Des expériences sur mesure, des rencontres exclusives et un service de conciergerie dédié
            </motion.p>
          </motion.div>

          {/* Cartes des plans d'abonnement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plan Initiation */}
            <motion.div
              ref={ref2}
              initial="hidden"
              animate={inView2 ? "visible" : "hidden"}
              whileHover="hover"
              variants={cardVariants}
              className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-700 transition-all duration-300 ${selectedPlan === "initiation" ? "ring-2 ring-yellow-400 transform scale-105" : ""}`}
              onClick={() => handleSelectPlan("initiation")}
            >
              <div className="p-1">
                <div className="bg-gray-900 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">Initiation</h3>
                      <p className="text-gray-400 text-sm">L'entrée dans le monde du privilège</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-400" />
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">450€</span>
                    <span className="text-gray-400 ml-2">/mois</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">2 rendez-vous mensuels (Gold)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Accès prioritaire aux nouveaux profils</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Conciergerie par message (réponse sous 2h)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Annulation sans frais jusqu'à 3h avant</span>
                    </li>
                  </ul>

                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-medium py-2">
                    Sélectionner
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Plan Harmonie */}
            <motion.div
              ref={ref3}
              initial="hidden"
              animate={inView3 ? "visible" : "hidden"}
              whileHover="hover"
              variants={cardVariants}
              className={`bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl overflow-hidden shadow-xl border border-purple-700 transition-all duration-300 transform ${selectedPlan === "harmonie" ? "ring-2 ring-purple-400 scale-105" : ""}`}
              onClick={() => handleSelectPlan("harmonie")}
            >
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAIRE
              </div>
              <div className="p-1">
                <div className="bg-gray-900 rounded-xl p-6 pt-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">Harmonie</h3>
                      <p className="text-gray-400 text-sm">L'équilibre parfait entre plaisir et exclusivité</p>
                    </div>
                    <Diamond className="h-8 w-8 text-purple-400" />
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">800€</span>
                    <span className="text-gray-400 ml-2">/mois</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">4 rendez-vous mensuels (Gold ou Premium)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Accès au catalogue exclusif "Privilège"</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Conciergerie par téléphone dédié</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Personnalisation des rendez-vous</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Transferts privés inclus</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Réservation jusqu'à 1h avant</span>
                    </li>
                  </ul>

                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2">
                    Sélectionner
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Plan Transcendance */}
            <motion.div
              ref={ref4}
              initial="hidden"
              animate={inView4 ? "visible" : "hidden"}
              whileHover="hover"
              variants={cardVariants}
              className={`bg-gradient-to-br from-amber-900 to-yellow-800 rounded-2xl overflow-hidden shadow-xl border border-amber-700 transition-all duration-300 ${selectedPlan === "transcendance" ? "ring-2 ring-amber-400 transform scale-105" : ""}`}
              onClick={() => handleSelectPlan("transcendance")}
            >
              <div className="p-1">
                <div className="bg-gray-900 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">Transcendance</h3>
                      <p className="text-gray-400 text-sm">L'expérience ultime sans limites</p>
                    </div>
                    <Crown className="h-8 w-8 text-amber-400" />
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">5000€</span>
                    <span className="text-gray-400 ml-2">/mois</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <Infinity className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Rendez-vous illimités (Premium et Privilège)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Accès aux résidences privées de luxe</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Conciergerie personnelle 24/7</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Expériences exclusives (voyages, événements)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Personnalisation complète</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Garantie de disponibilité</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">Carte membre physique en métal noir</span>
                    </li>
                  </ul>

                  <Button className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-medium py-2">
                    Sélectionner
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section des fonctionnalités innovantes */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Fonctionnalités innovantes
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
              Découvrez ce qui rend notre système d'abonnement révolutionnaire
            </motion.p>
          </motion.div>

          {/* Grille des fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Préférences Mémorisées */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Préférences Mémorisées</h3>
              <p className="text-gray-400">
                L'application mémorise vos préférences pour une expérience parfaitement adaptée à chaque visite.
              </p>
            </motion.div>

            {/* Cercle Privé */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="bg-gradient-to-br from-amber-500 to-red-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Diamond className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Cercle Privé</h3>
              <p className="text-gray-400">
                Accédez à des événements exclusifs et des soirées thématiques dans des lieux prestigieux.
              </p>
            </motion.div>

            {/* Passeport Privilège */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Passeport Privilège</h3>
              <p className="text-gray-400">
                Profitez de vos services dans différentes villes internationales avec une conciergerie qui vous suit.
              </p>
            </motion.div>

            {/* Rituel de Bienvenue */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Rituel de Bienvenue</h3>
              <p className="text-gray-400">
                Recevez un kit de bienvenue luxueux et un appel personnalisé pour définir vos préférences.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section des avantages exclusifs */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent"
            >
              Avantages exclusifs
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
              Des privilèges uniques réservés à nos membres
            </motion.p>
          </motion.div>

          {/* Liste des avantages */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {/* Garantie satisfaction */}
              <motion.div
                variants={fadeIn}
                className="flex items-start bg-gray-800/30 rounded-xl p-6 border border-gray-700"
              >
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Garantie satisfaction</h3>
                  <p className="text-gray-400">
                    Si un rendez-vous ne répond pas à vos attentes, le prochain est offert. Nous nous engageons à vous
                    offrir une expérience exceptionnelle à chaque fois.
                  </p>
                </div>
              </motion.div>

              {/* Anniversaire VIP */}
              <motion.div
                variants={fadeIn}
                className="flex items-start bg-gray-800/30 rounded-xl p-6 border border-gray-700"
              >
                <div className="bg-gradient-to-br from-pink-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Anniversaire VIP</h3>
                  <p className="text-gray-400">
                    Une expérience spéciale offerte le mois de votre anniversaire. Célébrez votre journée avec un
                    traitement royal et des surprises personnalisées.
                  </p>
                </div>
              </motion.div>

              {/* Programme de fidélité */}
              <motion.div
                variants={fadeIn}
                className="flex items-start bg-gray-800/30 rounded-xl p-6 border border-gray-700"
              >
                <div className="bg-gradient-to-br from-amber-500 to-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Programme de fidélité</h3>
                  <p className="text-gray-400">
                    Cumulez des points à chaque rendez-vous, échangeables contre des expériences exclusives. Plus vous
                    profitez de nos services, plus vous êtes récompensé.
                  </p>
                </div>
              </motion.div>

              {/* Discrétion absolue */}
              <motion.div
                variants={fadeIn}
                className="flex items-start bg-gray-800/30 rounded-xl p-6 border border-gray-700"
              >
                <div className="bg-gradient-to-br from-purple-500 to-indigo-500 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Discrétion absolue</h3>
                  <p className="text-gray-400">
                    Facturation sous un nom commercial discret et communication cryptée. Votre vie privée est notre
                    priorité absolue.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Section CTA */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/golden-flow.png')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-gray-700 shadow-xl"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">
              Prêt à transformer votre expérience ?
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg md:text-xl mb-8 text-center text-gray-300">
              Rejoignez Le Papasito Privilège dès aujourd'hui et découvrez un monde d'exclusivité et de plaisir sur
              mesure.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row justify-center gap-4">
              <AnimatedButton
                variant="gold"
                className="px-8 py-3 text-lg"
                onClick={() => (selectedPlan ? console.log(`S'abonner au plan ${selectedPlan}`) : scrollToPlans())}
              >
                {selectedPlan ? "S'abonner maintenant" : "Choisir un plan"}
              </AnimatedButton>

              <Button variant="outline" className="px-8 py-3 text-lg border-gray-500 text-gray-300 hover:bg-gray-800">
                En savoir plus
              </Button>
            </motion.div>

            <motion.div variants={fadeIn} className="mt-8 text-center text-gray-400 text-sm">
              <p>Engagement minimum de 3 mois. Annulation possible avec préavis de 30 jours.</p>
              <p className="mt-2 flex items-center justify-center">
                <Shield className="h-4 w-4 mr-1 text-gray-500" />
                Paiement sécurisé et discret
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Témoignages */}
      <div className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Ce qu'en disent nos membres
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
              Des témoignages anonymes de nos membres privilégiés
            </motion.p>
          </motion.div>

          {/* Grille de témoignages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Témoignage 1 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-medium">Michel D.</h4>
                  <p className="text-gray-400 text-sm">Membre Harmonie depuis 6 mois</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "Le système d'abonnement a complètement transformé ma façon de vivre ces expériences. La
                personnalisation et le service de conciergerie sont incroyables. Je ne reviendrai jamais en arrière."
              </p>
              <div className="mt-4 flex">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
            </motion.div>

            {/* Témoignage 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-red-500 flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-medium">Sophie L.</h4>
                  <p className="text-gray-400 text-sm">Membre Transcendance depuis 1 an</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "L'abonnement Transcendance est au-delà de mes attentes. Les résidences privées sont somptueuses et la
                discrétion est totale. Chaque détail est pensé pour une expérience parfaite."
              </p>
              <div className="mt-4 flex">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
            </motion.div>

            {/* Témoignage 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-medium">Alexandre T.</h4>
                  <p className="text-gray-400 text-sm">Membre Initiation depuis 3 mois</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "Même avec l'abonnement Initiation, je ressens déjà la différence. Le service est impeccable et les
                rencontres sont d'un niveau supérieur. Je prévois déjà de passer au niveau Harmonie."
              </p>
              <div className="mt-4 flex">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Questions fréquentes
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
              Tout ce que vous devez savoir sur Le Papasito Privilège
            </motion.p>
          </motion.div>

          {/* Liste FAQ */}
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-2">Comment fonctionne l'abonnement ?</h3>
              <p className="text-gray-300">
                Après avoir choisi votre niveau d'abonnement, vous recevrez un accès à notre plateforme exclusive et
                serez contacté par votre concierge personnel. Vous pourrez alors commencer à réserver vos rendez-vous
                selon les conditions de votre forfait.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-2">Puis-je changer de niveau d'abonnement ?</h3>
              <p className="text-gray-300">
                Oui, vous pouvez passer à un niveau supérieur à tout moment. Pour passer à un niveau inférieur, un
                préavis de 30 jours est requis et le changement prendra effet à la fin de votre cycle de facturation.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-2">Comment est assurée ma confidentialité ?</h3>
              <p className="text-gray-300">
                Nous utilisons des systèmes de paiement discrets, des communications cryptées et des procédures strictes
                de confidentialité. Votre vie privée est notre priorité absolue et toutes les informations sont traitées
                avec la plus grande discrétion.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                Que se passe-t-il si je n'utilise pas tous mes rendez-vous mensuels ?
              </h3>
              <p className="text-gray-300">
                Les rendez-vous non utilisés peuvent être reportés au mois suivant (maximum 2 mois) pour les abonnements
                Initiation et Harmonie. Pour l'abonnement Transcendance, cette question ne se pose pas puisque les
                rendez-vous sont illimités.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
