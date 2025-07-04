"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Home,
  Phone,
  Shield,
  CheckCircle,
  Heart,
  MapPin,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"

export default function EscortProfilePageWithImages({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos")
  const [favorited, setFavorited] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Sample data for the escort profile
  const profile = {
    id: Number.parseInt(params.id),
    name: "Alona - Brésilienne chaude",
    location: "Escort Bruxelles",
    phone: "+32 492 77 79 10",
    isVerified: true,
    isSafeSex: true,
    description: {
      fr: "Bonjour, je suis une nouvelle Latina avec un corps magnifique, je suis très affectueuse, et j'aime recevoir du plaisir aussi. J'ai un endroit confortable où nous pouvons passer un bon moment. Ou je peux vous rencontrer à l'hôtel. Je vous répondrai dans la matinée.",
      en: "Hello, good afternoon. I'm a latina, new with my body up to date, I'm very affectionate, and I love to receive pleasure too. I have a place to receive you, comfortable for us to have a good time. Or I can meet you at a hotel. I'd love to meet you.",
    },
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783542_original.jpg-3YiXCmU7Z3tdFoXDKFLaM72887Dqj9.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783540_original.jpg-9BfowNufKS544E1yQOtKaqzXyGbLHv.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783538_original.jpg-kPFWDRAGW5exy1YpgIZAG4oyWz4l3K.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/araxie-armenian-escort-in-tokyo-11035160_original.jpg-JxyGhogrTsK8Vbgk4hfiSKKfgpiyuW.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dh638tw-ef08f633-e1bf-4385-bf75-9833434b19ad.jpg-d3u6FGvdplhI3d18ZaoDTAbBBNIpJV.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dg2t4vr-72b1d47d-4950-498c-bc73-867e567ed707.jpg-sP3HGIOKPYKRbldmMEbmZi234Kan4L.jpeg",
    ],
    videoThumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783542_original.jpg-3YiXCmU7Z3tdFoXDKFLaM72887Dqj9.jpeg",
    postedBy: "Alona (28)",
    postedTime: "11:43",
    details: {
      genre: "Femme",
      age: "28 ans",
      orientation: "Bisexuel",
      nationality: "Brésil",
      ethnicity: "Amérique latine",
      languages: "Anglais, Espagnol, Portugais",
      height: "165cm",
      weight: "57kg",
      hairColor: "Brun",
      eyeColor: "Brun",
      intimateHaircut: "Rasé",
      cupSize: "C",
      tattoos: "Oui",
      piercings: "Oui",
      smoker: "Non",
    },
    services: {
      massage: ["Body to body", "Massage sensuel", "Massage", "Massage Tantra"],
      preliminaries: ["Doigter", "Fellation jusqu'à la fin", "Fellation avec préservatif", "Sucer les tétons"],
      intimate: ["Vibromasseur"],
      fetish: ["Facesitting", "Fétichisme des pieds"],
      other: ["Dîner", "Possibilités de douche", "Striptease", "Film ou photo", "Sexe virtuel", "Trio (F/F/H)"],
    },
  }

  // Premium listings
  const premiumListings = [
    {
      id: 101,
      name: "Sensora massage",
      description: "Vivez le plaisir ultime de la jouissance...",
      phone: "0486 66 63 05",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/araxie-armenian-escort-in-tokyo-11035160_original.jpg-JxyGhogrTsK8Vbgk4hfiSKKfgpiyuW.jpeg",
      ],
      isPremium: true,
    },
    {
      id: 102,
      name: "Ema New",
      description: "Je suis sexy Ema et je t'attends dans...",
      phone: "0494 90 83 41",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783540_original.jpg-9BfowNufKS544E1yQOtKaqzXyGbLHv.jpeg",
      ],
      isPremium: true,
    },
    {
      id: 103,
      name: "Megan DERNIERS JOURS",
      description: "blonde sexy et coquine. La meilleure...",
      phone: "0494 25 81 52",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dh638tw-ef08f633-e1bf-4385-bf75-9833434b19ad.jpg-d3u6FGvdplhI3d18ZaoDTAbBBNIpJV.jpeg",
      ],
      isPremium: true,
    },
    {
      id: 104,
      name: "Carol",
      description: "100% Naturel",
      phone: "0474 07 61 14",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783538_original.jpg-kPFWDRAGW5exy1YpgIZAG4oyWz4l3K.jpeg",
      ],
      isPremium: true,
    },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % profile.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + profile.images.length) % profile.images.length)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="bg-gray-200 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center text-sm text-black">
            <Link href="/" className="text-black hover:text-black">
              <Home className="h-4 w-4" />
            </Link>
            <span className="mx-2">»</span>
            <Link href="/escort" className="text-black hover:text-black">
              Escort
            </Link>
            <span className="mx-2">»</span>
            <Link href="/escort/femmes" className="text-black hover:text-black">
              Femmes
            </Link>
            <span className="mx-2">»</span>
            <span className="text-black">{profile.name}</span>
          </div>
          <Link href="/retour" className="text-red-500 hover:text-red-700">
            Retour →
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Media */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="flex flex-col md:flex-row">
                {/* Main Image */}
                <div className="md:w-2/3">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={profile.images[currentImageIndex] || "/placeholder.svg"}
                      alt={profile.name}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="md:w-1/3 p-4">
                  <h1 className="text-xl font-bold text-black">{profile.name}</h1>
                  <p className="text-sm text-black mb-2">{profile.location}</p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <div className="mb-2 sm:mb-0">
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-lg font-bold text-black hover:text-red-500 transition-colors flex items-center"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        {profile.phone}
                      </a>
                      <div className="flex gap-2 mt-1">
                        <a
                          href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                          className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
                          title="Appeler"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Appel
                        </a>
                        <a
                          href={`facetime:${profile.phone.replace(/\s+/g, "")}`}
                          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                          title="Appeler avec FaceTime"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          FaceTime
                        </a>
                        <a
                          href={`https://wa.me/${profile.phone.replace(/\s+/g, "").replace(/^\+/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                          title="Contacter sur WhatsApp"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                          </svg>
                          WhatsApp
                        </a>
                      </div>
                    </div>
                    <div className="text-xs text-black">
                      par {profile.postedBy} à {profile.postedTime}
                    </div>
                  </div>

                  <Link href={`/booking/${params.id}`} passHref>
                    <AnimatedButton variant="purple" animation="pulse" className="w-full mb-4 text-base font-semibold">
                      RÉSERVER MAINTENANT
                    </AnimatedButton>
                  </Link>

                  <div className="flex gap-2 mb-4">
                    {profile.isVerified && (
                      <div className="bg-green-700 text-white px-3 py-1 text-sm flex items-center rounded">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Vérifié
                      </div>
                    )}
                    {profile.isSafeSex && (
                      <div className="bg-blue-900 text-white px-3 py-1 text-sm flex items-center rounded">
                        <Shield className="h-4 w-4 mr-1" />
                        Safe sex
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 border-t border-gray-200">
                <p className="mb-4 text-black">{profile.description.fr}</p>
                <p className="text-black mb-4">{profile.description.en}</p>

                <div className="flex justify-center">
                  <Link href={`/booking/${params.id}`} passHref>
                    <AnimatedButton variant="purple" animation="glow" className="px-8 py-2 text-base font-semibold">
                      Réserver une séance
                    </AnimatedButton>
                  </Link>
                </div>
              </div>
            </div>

            {/* Thumbnails Gallery */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6 p-4">
              <h3 className="text-lg font-semibold mb-3 text-black">Photos</h3>
              <div className="grid grid-cols-6 gap-2">
                {profile.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square cursor-pointer ${currentImageIndex === index ? "ring-2 ring-red-500" : ""}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${profile.name} - ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="grid grid-cols-3 gap-1">
                {profile.images.slice(0, 6).map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${profile.name} - ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Button */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6 p-4 flex justify-between items-center">
              <div className="text-black">Est-ce que tu l'aimes?</div>
              <Button
                variant={favorited ? "default" : "outline"}
                className={favorited ? "bg-red-500 hover:bg-red-600" : ""}
                onClick={() => setFavorited(!favorited)}
              >
                FAVORI <Heart className="ml-2 h-4 w-4" fill={favorited ? "white" : "none"} />
              </Button>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="relative aspect-[16/9]">
                <Image src="/placeholder.svg?height=400&width=800" alt="Map" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-2 rounded-full">
                    <MapPin className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            {/* Contact */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-black">Contact</h2>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-black">Téléphone:</div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${profile.phone}`}
                        className="font-semibold text-black hover:text-red-500 transition-colors flex items-center"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        {profile.phone}
                      </a>
                      {/* Options supplémentaires */}
                      <div className="flex gap-1">
                        <a
                          href={`facetime:${profile.phone.replace(/\s+/g, "")}`}
                          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          title="Appeler avec FaceTime"
                        >
                          FaceTime
                        </a>
                        <a
                          href={`https://wa.me/${profile.phone.replace(/\s+/g, "").replace(/^\+/, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          title="Contacter sur WhatsApp"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-black">disponible 24/7</div>
                </div>

                <div className="mb-4">
                  <div className="text-sm mb-2 text-black text-center">Contacter ou réserver:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center">
                      MESSAGE <MessageSquare className="ml-2 h-4 w-4" />
                    </Button>
                    <Link href={`/booking/${params.id}`} passHref>
                      <AnimatedButton variant="purple" className="w-full flex items-center justify-center">
                        RÉSERVER <Calendar className="ml-2 h-4 w-4" />
                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-black">Profil</h2>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-sm text-black">Genre:</td>
                      <td className="py-2 text-right text-black">{profile.details.genre}</td>
                      <td className="py-2 pl-4 text-sm text-black">Cheveux:</td>
                      <td className="py-2 text-right text-black">{profile.details.hairColor}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-sm text-black">Age:</td>
                      <td className="py-2 text-right text-black">{profile.details.age}</td>
                      <td className="py-2 pl-4 text-sm text-black">Yeux:</td>
                      <td className="py-2 text-right text-black">{profile.details.eyeColor}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-sm text-black">Orientation:</td>
                      <td className="py-2 text-right text-black">{profile.details.orientation}</td>
                      <td className="py-2 pl-4 text-sm text-black">Coupe intime:</td>
                      <td className="py-2 text-right text-black">{profile.details.intimateHaircut}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-sm text-black">Nationalité:</td>
                      <td className="py-2 text-right text-black">{profile.details.nationality}</td>
                      <td className="py-2 pl-4 text-sm text-black">Bonnet:</td>
                      <td className="py-2 text-right text-black">{profile.details.cupSize}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-sm text-black">Ethnie:</td>
                      <td className="py-2 text-right text-black">{profile.details.ethnicity}</td>
                      <td className="py-2 pl-4 text-sm text-black">Tatouage(s):</td>
                      <td className="py-2 text-right text-black">{profile.details.tattoos}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-sm text-black">Langues:</td>
                      <td className="py-2 text-right text-black">{profile.details.languages}</td>
                      <td className="py-2 pl-4 text-sm text-black">Piercing(s):</td>
                      <td className="py-2 text-right text-black">{profile.details.piercings}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 text-sm text-black">Taille:</td>
                      <td className="py-2 text-right text-black">{profile.details.height}</td>
                      <td className="py-2 pl-4 text-sm text-black">Fumeur:</td>
                      <td className="py-2 text-right text-black">{profile.details.smoker}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-sm text-black">Poids:</td>
                      <td className="py-2 text-right text-black">{profile.details.weight}</td>
                      <td className="py-2 pl-4"></td>
                      <td className="py-2 text-right"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-black">Possibilités</h2>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="font-medium mb-2 text-black">Massage</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {profile.services.massage.map((service, index) => (
                      <div key={index} className="text-sm text-black">
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium mb-2 text-black">Préliminaires</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {profile.services.preliminaries.map((service, index) => (
                      <div key={index} className="text-sm text-black">
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium mb-2 text-black">Intime</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {profile.services.intimate.map((service, index) => (
                      <div key={index} className="text-sm text-black">
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium mb-2 text-black">Fétiche</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {profile.services.fetish.map((service, index) => (
                      <div key={index} className="text-sm text-black">
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-black">Autres services</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {profile.services.other.map((service, index) => (
                      <div key={index} className="text-sm text-black">
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Report Abuse */}
            <div className="text-right mb-6">
              <Link href="#" className="text-red-500 hover:text-red-700 text-sm">
                Signaler un abus ⚠️
              </Link>
            </div>
          </div>
        </div>

        {/* Premium Listings */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-black">Annonces premium</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {premiumListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10 bg-purple-600 text-white px-2 py-0.5 rounded-sm text-xs font-bold">
                    Premium
                  </div>
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={listing.images[0] || "/placeholder.svg"}
                      alt={listing.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-between items-center px-2 py-1">
                      <button className="bg-black/30 rounded-full p-1 text-white">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button className="bg-black/30 rounded-full p-1 text-white">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-black">{listing.name}</h3>
                  <p className="text-sm text-black line-clamp-1">{listing.description}</p>
                  <div className="flex items-center mt-2">
                    <Phone className="h-4 w-4 mr-1 text-black" />
                    <span className="text-sm text-black">{listing.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Bouton flottant pour mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Link href={`/booking/${params.id}`} passHref>
          <AnimatedButton variant="purple" animation="bounce" className="rounded-full p-4 shadow-lg">
            <Calendar className="h-6 w-6" />
          </AnimatedButton>
        </Link>
      </div>
    </div>
  )
}
