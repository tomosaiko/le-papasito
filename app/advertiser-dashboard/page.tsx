"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building, CreditCard, BarChart, Eye, MousePointer, Upload, Calendar } from "lucide-react"

export default function AdvertiserDashboard() {
  const { dictionary } = useLanguage()
  const [activeTab, setActiveTab] = useState("stats")

  // Sample data
  const advertiserData = {
    companyName: "Luxury Hotels",
    contact: "John Doe",
    email: "john@luxuryhotels.com",
    phone: "+33 1 23 45 67 89",
    package: "premium",
    nextBilling: "2023-12-15",
    banner: "/placeholder.svg?height=300&width=1200",
    stats: {
      impressions: 12450,
      clicks: 387,
      ctr: "3.1%",
      impressionsThisWeek: 2450,
      clicksThisWeek: 87,
    },
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 gold-gradient">{dictionary.advertiser.dashboard.title}</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-secondary border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Eye className="mr-2 h-4 w-4 text-gold-DEFAULT" />
                {dictionary.advertiser.dashboard.stats.impressions}
              </CardTitle>
              <CardDescription>Total ad impressions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{advertiserData.stats.impressions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{advertiserData.stats.impressionsThisWeek} this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MousePointer className="mr-2 h-4 w-4 text-gold-DEFAULT" />
                {dictionary.advertiser.dashboard.stats.clicks}
              </CardTitle>
              <CardDescription>Total ad clicks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{advertiserData.stats.clicks}</div>
              <p className="text-xs text-muted-foreground mt-1">+{advertiserData.stats.clicksThisWeek} this week</p>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart className="mr-2 h-4 w-4 text-gold-DEFAULT" />
                CTR
              </CardTitle>
              <CardDescription>Click-through rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{advertiserData.stats.ctr}</div>
              <p className="text-xs text-muted-foreground mt-1">Industry avg: 2.5%</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-secondary rounded-xl overflow-hidden">
          <TabsList className="grid grid-cols-3 p-0 h-auto">
            <TabsTrigger
              value="stats"
              className="py-3 rounded-none data-[state=active]:bg-background data-[state=active]:text-gold-DEFAULT"
            >
              <BarChart className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger
              value="sponsorship"
              className="py-3 rounded-none data-[state=active]:bg-background data-[state=active]:text-gold-DEFAULT"
            >
              <Building className="h-4 w-4 mr-2" />
              {dictionary.advertiser.dashboard.sponsorship}
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="py-3 rounded-none data-[state=active]:bg-background data-[state=active]:text-gold-DEFAULT"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats" className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Detailed Statistics</h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full bg-muted rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Chart visualization would go here</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Pages</CardTitle>
                    <CardDescription>Where your ad gets the most engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Homepage</span>
                        <span className="font-semibold">6,245 impressions</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Escort Listings</span>
                        <span className="font-semibold">3,872 impressions</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Individual Profiles</span>
                        <span className="font-semibold">2,333 impressions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Audience Demographics</CardTitle>
                    <CardDescription>Who is seeing your ads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 w-full bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Demographics chart would go here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Sponsorship Tab */}
          <TabsContent value="sponsorship" className="p-6">
            <h2 className="text-2xl font-semibold mb-6">{dictionary.advertiser.dashboard.sponsorship}</h2>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Current Sponsorship</CardTitle>
                  <CardDescription>Your active sponsorship package</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Package:</span>
                      <span className="font-semibold capitalize">{advertiserData.package}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-semibold text-green-500">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{dictionary.advertiser.dashboard.duration}:</span>
                      <span className="font-semibold">Monthly</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next billing date:</span>
                      <span className="font-semibold">{advertiserData.nextBilling}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-xl mb-4">Current Banner</h3>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={advertiserData.banner || "/placeholder.svg"}
                    alt="Advertisement Banner"
                    className="w-full h-auto"
                  />
                </div>

                <div className="mt-4">
                  <Button className="bg-gold-DEFAULT hover:bg-gold-dark text-black">
                    <Upload className="h-4 w-4 mr-2" />
                    Update Banner
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Upgrade Options</CardTitle>
                  <CardDescription>Enhance your visibility with a better package</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {advertiserData.package !== "exclusive" && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-lg font-semibold mb-2">
                          Upgrade to {advertiserData.package === "standard" ? "Premium" : "Exclusive"}
                        </h4>
                        <p className="text-muted-foreground mb-4">
                          {advertiserData.package === "standard"
                            ? "Get more visibility with premium placement on all pages"
                            : "Get maximum visibility with exclusive placement and priority positioning"}
                        </p>
                        <Button className="bg-gold-DEFAULT hover:bg-gold-dark text-black">Upgrade Now</Button>
                      </div>
                    )}

                    <div className="p-4 border rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">Add Special Promotion</h4>
                      <p className="text-muted-foreground mb-4">
                        Feature your ad in our weekly newsletter sent to all users
                      </p>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Billing Information</h2>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Manage your payment details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center p-4 border rounded-lg mb-4">
                    <div className="mr-4">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline">Update Payment Method</Button>
                    <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Your recent invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border-b">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>November 15, 2023</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">€399.00</p>
                        <p className="text-xs text-green-500">Paid</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border-b">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>October 15, 2023</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">€399.00</p>
                        <p className="text-xs text-green-500">Paid</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 border-b">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>September 15, 2023</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">€399.00</p>
                        <p className="text-xs text-green-500">Paid</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" className="mt-4 w-full">
                    View All Invoices
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                  <CardDescription>Your billing information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" defaultValue={advertiserData.companyName} className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="contact">Contact Name</Label>
                      <Input id="contact" defaultValue={advertiserData.contact} className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue="123 Business St" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="Paris" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="postal">Postal Code</Label>
                      <Input id="postal" defaultValue="75001" className="mt-1" />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" defaultValue="France" className="mt-1" />
                    </div>
                  </div>

                  <Button className="mt-6 bg-gold-DEFAULT hover:bg-gold-dark text-black">Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
