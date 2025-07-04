export type Dictionary = {
  home: {
    hero: {
      title: string
      subtitle: string
    }
    cta: {
      explore: string
      register: string
      advertise: string
    }
    featured: {
      title: string
    }
    sponsors: {
      title: string
    }
  }
  auth: {
    login: string
    signup: string
    email: string
    password: string
    forgotPassword: string
    resetPassword: string
    orContinueWith: string
    alreadyHaveAccount: string
    dontHaveAccount: string
  }
  escort: {
    registration: {
      title: string
      steps: {
        info: string
        subscription: string
        media: string
        bio: string
        payment: string
      }
      form: {
        firstName: string
        age: string
        city: string
        email: string
        phone: string
        bio: string
        services: string
        uploadPhotos: string
        uploadVideos: string
        subscriptionPlans: {
          title: string
          basic: {
            name: string
            price: string
            features: string[]
          }
          premium: {
            name: string
            price: string
            features: string[]
          }
          vip: {
            name: string
            price: string
            features: string[]
          }
        }
        next: string
        back: string
        submit: string
      }
    }
    dashboard: {
      title: string
      stats: {
        views: string
        likes: string
      }
      profile: string
      gallery: string
      subscription: string
      referral: string
    }
  }
  advertiser: {
    registration: {
      title: string
      form: {
        companyName: string
        contact: string
        sponsorshipPackages: {
          title: string
          standard: {
            name: string
            price: string
            features: string[]
          }
          premium: {
            name: string
            price: string
            features: string[]
          }
          exclusive: {
            name: string
            price: string
            features: string[]
          }
        }
        uploadBanner: string
        submit: string
      }
    }
    dashboard: {
      title: string
      stats: {
        impressions: string
        clicks: string
      }
      sponsorship: string
      duration: string
    }
  }
  referral: {
    title: string
    yourLink: string
    referrals: string
    earnings: string
    howItWorks: string
    copyLink: string
    copied: string
  }
  common: {
    loading: string
    error: string
    success: string
    save: string
    cancel: string
    delete: string
    edit: string
    view: string
    search: string
    filter: string
    sort: string
    language: string
  }
}

export const dictionaries: Record<string, Dictionary> = {
  fr: {
    home: {
      hero: {
        title: "Trouvez le plaisir. Sans limites.",
        subtitle: "La plateforme premium pour des rencontres exceptionnelles",
      },
      cta: {
        explore: "Explorer",
        register: "S'inscrire comme escorte",
        advertise: "Publier une annonce",
      },
      featured: {
        title: "Escortes en vedette",
      },
      sponsors: {
        title: "Nos partenaires",
      },
    },
    auth: {
      login: "Se connecter",
      signup: "S'inscrire",
      email: "Email",
      password: "Mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      resetPassword: "Réinitialiser le mot de passe",
      orContinueWith: "Ou continuer avec",
      alreadyHaveAccount: "Vous avez déjà un compte ?",
      dontHaveAccount: "Vous n'avez pas de compte ?",
    },
    escort: {
      registration: {
        title: "Inscription Escorte",
        steps: {
          info: "Informations",
          subscription: "Abonnement",
          media: "Médias",
          bio: "Bio",
          payment: "Paiement",
        },
        form: {
          firstName: "Prénom",
          age: "Âge",
          city: "Ville",
          email: "Email",
          phone: "Téléphone",
          bio: "Biographie",
          services: "Services",
          uploadPhotos: "Télécharger des photos",
          uploadVideos: "Télécharger des vidéos",
          subscriptionPlans: {
            title: "Plans d'abonnement",
            basic: {
              name: "Basique",
              price: "29,99€/mois",
              features: ["Profil de base", "3 photos", "Visibilité standard"],
            },
            premium: {
              name: "Premium",
              price: "59,99€/mois",
              features: ["Profil mis en avant", "10 photos", "1 vidéo", "Badge Premium", "Visibilité améliorée"],
            },
            vip: {
              name: "VIP",
              price: "99,99€/mois",
              features: [
                "Profil en tête de liste",
                "Photos illimitées",
                "3 vidéos",
                "Badge VIP",
                "Visibilité maximale",
                "Support prioritaire",
              ],
            },
          },
          next: "Suivant",
          back: "Retour",
          submit: "Soumettre",
        },
      },
      dashboard: {
        title: "Tableau de bord Escorte",
        stats: {
          views: "Vues",
          likes: "J'aime",
        },
        profile: "Gérer le profil",
        gallery: "Gérer la galerie",
        subscription: "Gérer l'abonnement",
        referral: "Programme de parrainage",
      },
    },
    advertiser: {
      registration: {
        title: "Inscription Annonceur",
        form: {
          companyName: "Nom de l'entreprise",
          contact: "Contact",
          sponsorshipPackages: {
            title: "Packs de sponsoring",
            standard: {
              name: "Standard",
              price: "199€/mois",
              features: ["Bannière standard", "Visibilité sur la page d'accueil", "Statistiques de base"],
            },
            premium: {
              name: "Premium",
              price: "399€/mois",
              features: [
                "Bannière premium",
                "Visibilité sur toutes les pages",
                "Statistiques détaillées",
                "Support prioritaire",
              ],
            },
            exclusive: {
              name: "Exclusif",
              price: "799€/mois",
              features: [
                "Bannière exclusive",
                "Placement prioritaire",
                "Visibilité maximale",
                "Statistiques en temps réel",
                "Support dédié",
              ],
            },
          },
          uploadBanner: "Télécharger une bannière",
          submit: "Soumettre",
        },
      },
      dashboard: {
        title: "Tableau de bord Annonceur",
        stats: {
          impressions: "Impressions",
          clicks: "Clics",
        },
        sponsorship: "Gérer le sponsoring",
        duration: "Durée",
      },
    },
    referral: {
      title: "Programme de parrainage",
      yourLink: "Votre lien de parrainage",
      referrals: "Filleuls",
      earnings: "Gains",
      howItWorks: "Comment ça marche",
      copyLink: "Copier le lien",
      copied: "Copié !",
    },
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      view: "Voir",
      search: "Rechercher",
      filter: "Filtrer",
      sort: "Trier",
      language: "Langue",
    },
  },
  en: {
    home: {
      hero: {
        title: "Find pleasure. Without limits.",
        subtitle: "The premium platform for exceptional encounters",
      },
      cta: {
        explore: "Explore",
        register: "Register as escort",
        advertise: "Post an ad",
      },
      featured: {
        title: "Featured escorts",
      },
      sponsors: {
        title: "Our partners",
      },
    },
    auth: {
      login: "Login",
      signup: "Sign up",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      resetPassword: "Reset password",
      orContinueWith: "Or continue with",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
    },
    escort: {
      registration: {
        title: "Escort Registration",
        steps: {
          info: "Information",
          subscription: "Subscription",
          media: "Media",
          bio: "Bio",
          payment: "Payment",
        },
        form: {
          firstName: "First name",
          age: "Age",
          city: "City",
          email: "Email",
          phone: "Phone",
          bio: "Biography",
          services: "Services",
          uploadPhotos: "Upload photos",
          uploadVideos: "Upload videos",
          subscriptionPlans: {
            title: "Subscription plans",
            basic: {
              name: "Basic",
              price: "$29.99/month",
              features: ["Basic profile", "3 photos", "Standard visibility"],
            },
            premium: {
              name: "Premium",
              price: "$59.99/month",
              features: ["Featured profile", "10 photos", "1 video", "Premium badge", "Enhanced visibility"],
            },
            vip: {
              name: "VIP",
              price: "$99.99/month",
              features: [
                "Top of the list profile",
                "Unlimited photos",
                "3 videos",
                "VIP badge",
                "Maximum visibility",
                "Priority support",
              ],
            },
          },
          next: "Next",
          back: "Back",
          submit: "Submit",
        },
      },
      dashboard: {
        title: "Escort Dashboard",
        stats: {
          views: "Views",
          likes: "Likes",
        },
        profile: "Manage profile",
        gallery: "Manage gallery",
        subscription: "Manage subscription",
        referral: "Referral program",
      },
    },
    advertiser: {
      registration: {
        title: "Advertiser Registration",
        form: {
          companyName: "Company name",
          contact: "Contact",
          sponsorshipPackages: {
            title: "Sponsorship packages",
            standard: {
              name: "Standard",
              price: "$199/month",
              features: ["Standard banner", "Homepage visibility", "Basic statistics"],
            },
            premium: {
              name: "Premium",
              price: "$399/month",
              features: ["Premium banner", "All pages visibility", "Detailed statistics", "Priority support"],
            },
            exclusive: {
              name: "Exclusive",
              price: "$799/month",
              features: [
                "Exclusive banner",
                "Priority placement",
                "Maximum visibility",
                "Real-time statistics",
                "Dedicated support",
              ],
            },
          },
          uploadBanner: "Upload banner",
          submit: "Submit",
        },
      },
      dashboard: {
        title: "Advertiser Dashboard",
        stats: {
          impressions: "Impressions",
          clicks: "Clicks",
        },
        sponsorship: "Manage sponsorship",
        duration: "Duration",
      },
    },
    referral: {
      title: "Referral program",
      yourLink: "Your referral link",
      referrals: "Referrals",
      earnings: "Earnings",
      howItWorks: "How it works",
      copyLink: "Copy link",
      copied: "Copied!",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      language: "Language",
    },
  },
  nl: {
    home: {
      hero: {
        title: "Vind plezier. Zonder grenzen.",
        subtitle: "Het premium platform voor uitzonderlijke ontmoetingen",
      },
      cta: {
        explore: "Verkennen",
        register: "Registreren als escort",
        advertise: "Advertentie plaatsen",
      },
      featured: {
        title: "Uitgelichte escorts",
      },
      sponsors: {
        title: "Onze partners",
      },
    },
    auth: {
      login: "Inloggen",
      signup: "Registreren",
      email: "E-mail",
      password: "Wachtwoord",
      forgotPassword: "Wachtwoord vergeten?",
      resetPassword: "Wachtwoord resetten",
      orContinueWith: "Of ga verder met",
      alreadyHaveAccount: "Heb je al een account?",
      dontHaveAccount: "Heb je nog geen account?",
    },
    escort: {
      registration: {
        title: "Escort Registratie",
        steps: {
          info: "Informatie",
          subscription: "Abonnement",
          media: "Media",
          bio: "Bio",
          payment: "Betaling",
        },
        form: {
          firstName: "Voornaam",
          age: "Leeftijd",
          city: "Stad",
          email: "E-mail",
          phone: "Telefoon",
          bio: "Biografie",
          services: "Diensten",
          uploadPhotos: "Foto's uploaden",
          uploadVideos: "Video's uploaden",
          subscriptionPlans: {
            title: "Abonnementsplannen",
            basic: {
              name: "Basis",
              price: "€29,99/maand",
              features: ["Basisprofiel", "3 foto's", "Standaard zichtbaarheid"],
            },
            premium: {
              name: "Premium",
              price: "€59,99/maand",
              features: ["Uitgelicht profiel", "10 foto's", "1 video", "Premium badge", "Verbeterde zichtbaarheid"],
            },
            vip: {
              name: "VIP",
              price: "€99,99/maand",
              features: [
                "Bovenaan de lijst profiel",
                "Onbeperkt foto's",
                "3 video's",
                "VIP badge",
                "Maximale zichtbaarheid",
                "Prioriteitsondersteuning",
              ],
            },
          },
          next: "Volgende",
          back: "Terug",
          submit: "Indienen",
        },
      },
      dashboard: {
        title: "Escort Dashboard",
        stats: {
          views: "Weergaven",
          likes: "Likes",
        },
        profile: "Profiel beheren",
        gallery: "Galerij beheren",
        subscription: "Abonnement beheren",
        referral: "Verwijzingsprogramma",
      },
    },
    advertiser: {
      registration: {
        title: "Adverteerder Registratie",
        form: {
          companyName: "Bedrijfsnaam",
          contact: "Contact",
          sponsorshipPackages: {
            title: "Sponsorpakketten",
            standard: {
              name: "Standaard",
              price: "€199/maand",
              features: ["Standaard banner", "Zichtbaarheid op homepage", "Basisstatistieken"],
            },
            premium: {
              name: "Premium",
              price: "€399/maand",
              features: [
                "Premium banner",
                "Zichtbaarheid op alle pagina's",
                "Gedetailleerde statistieken",
                "Prioriteitsondersteuning",
              ],
            },
            exclusive: {
              name: "Exclusief",
              price: "€799/maand",
              features: [
                "Exclusieve banner",
                "Prioriteitsplaatsing",
                "Maximale zichtbaarheid",
                "Real-time statistieken",
                "Toegewijde ondersteuning",
              ],
            },
          },
          uploadBanner: "Banner uploaden",
          submit: "Indienen",
        },
      },
      dashboard: {
        title: "Adverteerder Dashboard",
        stats: {
          impressions: "Impressies",
          clicks: "Klikken",
        },
        sponsorship: "Sponsoring beheren",
        duration: "Duur",
      },
    },
    referral: {
      title: "Verwijzingsprogramma",
      yourLink: "Jouw verwijzingslink",
      referrals: "Verwijzingen",
      earnings: "Verdiensten",
      howItWorks: "Hoe het werkt",
      copyLink: "Link kopiëren",
      copied: "Gekopieerd!",
    },
    common: {
      loading: "Laden...",
      error: "Fout",
      success: "Succes",
      save: "Opslaan",
      cancel: "Annuleren",
      delete: "Verwijderen",
      edit: "Bewerken",
      view: "Bekijken",
      search: "Zoeken",
      filter: "Filteren",
      sort: "Sorteren",
      language: "Taal",
    },
  },
}
