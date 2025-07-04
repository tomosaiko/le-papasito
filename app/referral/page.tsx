"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check, Users, Gift, CreditCard } from "lucide-react"

export default function ReferralProgram() {
  const { dictionary } = useLanguage()
  const [copied, setCopied] = useState(false)

  // Sample data
  const referralData = {
    code: "USER123",
    referrals: 5,
    earnings: "€50.00",
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://lepapasito.com/ref/${referralData.code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center gold-gradient">{dictionary.referral.title}</h1>

        <div className="bg-secondary rounded-xl p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Users className="mr-2 h-6 w-6 text-gold-DEFAULT" />
            {dictionary.referral.yourLink}
          </h2>

          <div className="flex items-center">
            <Input readOnly value={`https://lepapasito.com/ref/${referralData.code}`} className="mr-2" />
            <Button onClick={copyReferralLink} className="bg-gold-DEFAULT hover:bg-gold-dark text-black">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {dictionary.referral.copied}
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  {dictionary.referral.copyLink}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-gold-DEFAULT" />
                {dictionary.referral.referrals}
              </CardTitle>
              <CardDescription>People who signed up with your code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{referralData.referrals}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="mr-2 h-5 w-5 text-gold-DEFAULT" />
                {dictionary.referral.earnings}
              </CardTitle>
              <CardDescription>Total earnings from referrals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold gold-gradient">{referralData.earnings}</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-secondary rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Gift className="mr-2 h-6 w-6 text-gold-DEFAULT" />
            {dictionary.referral.howItWorks}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-gold-DEFAULT/20 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-gold-DEFAULT" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Invite Friends</h3>
                <p className="text-muted-foreground text-sm">
                  Share your unique referral link with friends or on social media
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-gold-DEFAULT/20 w-12 h-12 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-gold-DEFAULT" />
                </div>
                <h3 className="text-lg font-semibold mb-2">They Subscribe</h3>
                <p className="text-muted-foreground text-sm">
                  When they sign up and subscribe to a paid plan using your link
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-gold-DEFAULT/20 w-12 h-12 flex items-center justify-center mb-4">
                  <Gift className="h-6 w-6 text-gold-DEFAULT" />
                </div>
                <h3 className="text-lg font-semibold mb-2">You Earn Rewards</h3>
                <p className="text-muted-foreground text-sm">
                  Earn 10% of their first month's subscription fee as a reward
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-4 bg-gold-DEFAULT/10 rounded-lg border border-gold-DEFAULT/20">
            <h3 className="text-lg font-semibold mb-2 text-gold-DEFAULT">Bonus Rewards</h3>
            <p className="text-sm">Refer 5 friends who subscribe and get a free month of Premium subscription!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
