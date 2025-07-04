import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="bg-secondary/50 p-6 rounded-full mb-4">
        <MessageSquare className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Vos messages</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Sélectionnez une conversation existante ou commencez une nouvelle discussion avec un prestataire.
      </p>
      <Button className="bg-purple-600 hover:bg-purple-700">Nouvelle conversation</Button>
    </div>
  )
}
