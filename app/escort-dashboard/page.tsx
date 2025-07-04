"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, ImageIcon, CreditCard, Users, Eye, Heart, Copy, Check, Upload, Trash2 } from "lucide-react"

export default function EscortDashboard() {
  const { dictionary } = useLanguage()
  const [activeTab, setActiveTab] = useState("profile")
  const [copied, setCopied] = useState(false)

  // Sample data
  const escortData = {
    name: "Sophia",
    age: 25,
    city: "Paris",
    email: "sophia@example.com",
    phone: "+33 6 12 34 56 78",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
    services: "Service 1, Service 2, Service 3",
    subscription: "premium",
    nextBilling: "2023-12-01",
    photos: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    videos: ["/placeholder.svg?height=400&width=300"],
    stats: {
      views: 1245,
      likes: 87,
      viewsThisWeek: 245,
      likesThisWeek: 18,
    },
    referral: {
      code: "SOPHIA25",
      referrals: 3,
      earnings: "€30.00",
    },
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://lepapasito.com/ref/${escortData.referral.code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 gold-gradient">{dictionary.escort.dashboard.title}</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Card className="bg-secondary border-border">
            <CardHeader className="p-2">
              <CardTitle className="text-sm flex items-center">
                <Eye className="mr-1 h-3 w-3 text-gold-DEFAULT" />
                {dictionary.escort.dashboard.stats.views}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-xl font-bold">{escortData.stats.views}</div>
              <p className="text-xs text-muted-foreground">+{escortData.stats.viewsThisWeek} this week</p>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-border">
            <CardHeader className="p-2">
              <CardTitle className="text-sm flex items-center">
                <Heart className="mr-1 h-3 w-3 text-gold-DEFAULT" />
                {dictionary.escort.dashboard.stats.likes}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-xl font-bold">{escortData.stats.likes}</div>
              <p className="text-xs text-muted-foreground">+{escortData.stats.likesThisWeek} this week</p>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-border">
            <CardHeader className="p-2">
              <CardTitle className="text-sm flex items-center">
                <CreditCard className="mr-1 h-3 w-3 text-gold-DEFAULT" />
                Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-lg font-bold capitalize">{escortData.subscription}</div>
              <p className="text-xs text-muted-foreground">Next: {escortData.nextBilling}</p>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-border">
            <CardHeader className="p-2">
              <CardTitle className="text-sm flex items-center">
                <Users className="mr-1 h-3 w-3 text-gold-DEFAULT" />
                Referrals
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="text-xl font-bold">{escortData.referral.referrals}</div>
              <p className="text-xs text-muted-foreground">{escortData.referral.earnings}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-secondary rounded-xl overflow-hidden">
          <TabsList className="grid grid-cols-4 p-0 h-auto">
            <TabsTrigger
              value="profile"
              className="py-3 rounded-none data-[state=active]:bg-background data-[state=active]:text-gold-DEFAULT"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="py-3 rounded-none data-[state=active]:bg-background data-[state=active]:text-gold-DEFAULT"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="py-3 rounded-none data-[state=active]:bg-background data-[state=active]:text-gold-DEFAULT"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger
              value="referral"
              className="py-3 rounded-none data-[state=active]:bg-background data-[state=active]:text-gold-DEFAULT"
            >
              <Users className="h-4 w-4 mr-2" />
              Referral
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="p-6">
            <h2 className="text-2xl font-semibold mb-6">{dictionary.escort.dashboard.profile}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={escortData.name} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" defaultValue={escortData.age} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" defaultValue={escortData.city} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={escortData.email} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue={escortData.phone} className="mt-1" />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" defaultValue={escortData.bio} className="mt-1 min-h-[150px]" />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="services">Services</Label>
                <Textarea id="services" defaultValue={escortData.services} className="mt-1 min-h-[100px]" />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button className="bg-gold-DEFAULT hover:bg-gold-dark text-black">Save Changes</Button>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="p-6">
            <h2 className="text-2xl font-semibold mb-6">{dictionary.escort.dashboard.gallery}</h2>

            <div className="space-y-8">
              {/* Photos */}
              <div>
                <h3 className="text-xl mb-4">Photos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {escortData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full aspect-[3/4] object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <Button variant="ghost" size="icon" className="text-white hover:text-red-500">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center p-4 aspect-[3/4]">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center">Upload Photo</p>
                    <Input id="upload-photo" type="file" accept="image/jpeg,image/png" className="hidden" />
                    <Label
                      htmlFor="upload-photo"
                      className="mt-2 inline-flex items-center px-3 py-1 bg-gold-DEFAULT hover:bg-gold-dark text-black rounded-md cursor-pointer text-sm"
                    >
                      Browse
                    </Label>
                  </div>
                </div>
              </div>

              {/* Videos */}
              <div>
                <h3 className="text-xl mb-4">Videos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {escortData.videos.map((video, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground">Video {index + 1}</span>
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <Button variant="ghost" size="icon" className="text-white hover:text-red-500">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center p-4 aspect-video">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center">Upload Video</p>
                    <Input id="upload-video" type="file" accept="video/mp4" className="hidden" />
                    <Label
                      htmlFor="upload-video"
                      className="mt-2 inline-flex items-center px-3 py-1 bg-gold-DEFAULT hover:bg-gold-dark text-black rounded-md cursor-pointer text-sm"
                    >
                      Browse
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="p-6">
            <h2 className="text-2xl font-semibold mb-6">{dictionary.escort.dashboard.subscription}</h2>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Your current plan and billing details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-semibold capitalize">{escortData.subscription}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-semibold text-green-500">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next billing date:</span>
                    <span className="font-semibold">{escortData.nextBilling}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment method:</span>
                    <span className="font-semibold">Visa ending in 4242</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col md:flex-row gap-4">
              <Button className="bg-gold-DEFAULT hover:bg-gold-dark text-black">Upgrade Plan</Button>
              <Button variant="outline">Update Payment Method</Button>
              <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                Cancel Subscription
              </Button>
            </div>
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral" className="p-6">
            <h2 className="text-2xl font-semibold mb-6">{dictionary.referral.title}</h2>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{dictionary.referral.yourLink}</CardTitle>
                <CardDescription>Share this link to earn rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Input readOnly value={`https://lepapasito.com/ref/${escortData.referral.code}`} className="mr-2" />
                  <Button onClick={copyReferralLink} variant="outline" size="icon" className="shrink-0">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>{dictionary.referral.referrals}</CardTitle>
                  <CardDescription>People who signed up with your code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{escortData.referral.referrals}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{dictionary.referral.earnings}</CardTitle>
                  <CardDescription>Total earnings from referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold gold-gradient">{escortData.referral.earnings}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{dictionary.referral.howItWorks}</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Share your unique referral link with friends or on social media</li>
                  <li>When someone signs up using your link and subscribes to a paid plan, you earn a reward</li>
                  <li>Earn 10% of their first month's subscription fee</li>
                  <li>There's no limit to how many people you can refer</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
