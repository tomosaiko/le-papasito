// Calcul de la commission pour la plateforme
export const calculateCommission = (amount: number, commissionRate = 0.2) => {
  const commission = amount * commissionRate
  const amountAfterCommission = amount - commission

  return {
    originalAmount: amount,
    commission,
    amountAfterCommission,
    commissionRate,
  }
}

// Fonction pour formater les prix
export const formatPrice = (amount: number, currency = "EUR") => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
  }).format(amount)
}
