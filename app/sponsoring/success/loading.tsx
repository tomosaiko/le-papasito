export default function SponsoringSuccessLoading() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Vérification de votre paiement...</p>
      </div>
    </div>
  )
}
