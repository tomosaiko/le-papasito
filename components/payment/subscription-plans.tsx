'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Check, 
  X, 
  Star, 
  Crown, 
  Zap, 
  TrendingUp,
  Users,
  BarChart3,
  Palette,
  Code,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SubscriptionPlan {
  type: 'BASIC' | 'PREMIUM' | 'VIP';
  name: string;
  price: number;
  features: {
    profileViews: number;
    messagesSent: number;
    photosUpload: number;
    videosUpload: number;
    featuredListing: boolean;
    prioritySupport: boolean;
    analyticsAccess: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    commissionRate: number;
  };
  limits: {
    dailyMessages: number;
    monthlyBookings: number;
    profileUpdates: number;
  };
}

interface UserSubscription {
  id: string;
  type: 'BASIC' | 'PREMIUM' | 'VIP';
  isActive: boolean;
  price: number;
  currency: string;
  billingCycle: string;
  startDate: string;
  endDate?: string;
  cancelAt?: string;
  canceledAt?: string;
  stripeId?: string;
  features: any;
  limits: any;
}

interface UsageStats {
  subscription: {
    type: string;
    isActive: boolean;
    features: any;
    limits: any;
  };
  usage: {
    messagesSent: number;
    messagesDaily: number;
    bookingsThisMonth: number;
    profileUpdates: number;
  };
  remaining: {
    messagesSent: number;
    messagesDaily: number;
    bookingsThisMonth: number;
    profileUpdates: number;
  };
}

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      
      // Fetch available plans
      const plansResponse = await fetch('/api/subscription/plans');
      const plansData = await plansResponse.json();
      
      // Fetch current subscription
      const subscriptionResponse = await fetch('/api/subscription/current');
      const subscriptionData = await subscriptionResponse.json();
      
      // Fetch usage statistics
      const usageResponse = await fetch('/api/subscription/usage');
      const usageData = await usageResponse.json();
      
      setPlans(plansData);
      setCurrentSubscription(subscriptionData);
      setUsageStats(usageData);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'abonnement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planType: string) => {
    try {
      setUpgrading(planType);
      
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: planType,
          billingCycle: billingCycle,
        }),
      });
      
      if (!response.ok) throw new Error('Upgrade failed');
      
      const data = await response.json();
      
      if (data.clientSecret) {
        // Redirect to Stripe checkout or handle payment
        window.location.href = data.checkoutUrl;
      } else {
        // Free plan upgrade
        toast({
          title: "Abonnement mis à jour",
          description: `Vous êtes maintenant sur le plan ${planType}`,
        });
        await fetchSubscriptionData();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à niveau l'abonnement",
        variant: "destructive",
      });
    } finally {
      setUpgrading(null);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancelAtPeriodEnd: true }),
      });
      
      if (!response.ok) throw new Error('Cancellation failed');
      
      toast({
        title: "Abonnement annulé",
        description: "Votre abonnement sera annulé à la fin de la période de facturation",
      });
      
      await fetchSubscriptionData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler l'abonnement",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return num === -1 ? 'Illimité' : num.toLocaleString('fr-FR');
  };

  const getProgress = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'BASIC':
        return <Shield className="w-6 h-6 text-blue-600" />;
      case 'PREMIUM':
        return <Star className="w-6 h-6 text-purple-600" />;
      case 'VIP':
        return <Crown className="w-6 h-6 text-yellow-600" />;
      default:
        return <Shield className="w-6 h-6 text-gray-600" />;
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'BASIC':
        return 'border-blue-200 bg-blue-50';
      case 'PREMIUM':
        return 'border-purple-200 bg-purple-50';
      case 'VIP':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getPlanIcon(currentSubscription.type)}
                <div>
                  <CardTitle>Abonnement Actuel: {currentSubscription.type}</CardTitle>
                  <CardDescription>
                    {currentSubscription.price > 0 
                      ? `${formatCurrency(currentSubscription.price)}/${currentSubscription.billingCycle}`
                      : 'Gratuit'
                    }
                  </CardDescription>
                </div>
              </div>
              <Badge variant={currentSubscription.isActive ? 'success' : 'destructive'}>
                {currentSubscription.isActive ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {currentSubscription.cancelAt && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Votre abonnement sera annulé le {new Date(currentSubscription.cancelAt).toLocaleDateString('fr-FR')}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Usage Statistics */}
            {usageStats && (
              <div className="space-y-4">
                <h4 className="font-medium">Utilisation ce mois</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Messages envoyés</span>
                      <span>{usageStats.usage.messagesSent} / {formatNumber(usageStats.subscription.limits.messagesSent)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getProgress(usageStats.usage.messagesSent, usageStats.subscription.limits.messagesSent)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Réservations</span>
                      <span>{usageStats.usage.bookingsThisMonth} / {formatNumber(usageStats.subscription.limits.monthlyBookings)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${getProgress(usageStats.usage.bookingsThisMonth, usageStats.subscription.limits.monthlyBookings)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center space-x-4 p-4 bg-muted rounded-lg">
        <span className={billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}>
          Mensuel
        </span>
        <Switch
          checked={billingCycle === 'yearly'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
        />
        <span className={billingCycle === 'yearly' ? 'font-medium' : 'text-muted-foreground'}>
          Annuel
        </span>
        <Badge variant="secondary">-20% sur l'annuel</Badge>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.type === plan.type;
          const yearlyPrice = plan.price * 12 * 0.8; // 20% discount
          const displayPrice = billingCycle === 'yearly' ? yearlyPrice : plan.price;
          
          return (
            <Card 
              key={plan.type} 
              className={`relative ${getPlanColor(plan.type)} ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.type === 'PREMIUM' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white">Populaire</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {getPlanIcon(plan.type)}
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <div className="text-3xl font-bold">
                    {plan.price === 0 ? 'Gratuit' : formatCurrency(displayPrice)}
                  </div>
                  {plan.price > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {billingCycle === 'yearly' ? '/an' : '/mois'}
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Features List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Vues de profil</span>
                    <span className="font-medium">{formatNumber(plan.features.profileViews)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Messages par mois</span>
                    <span className="font-medium">{formatNumber(plan.features.messagesSent)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Photos</span>
                    <span className="font-medium">{formatNumber(plan.features.photosUpload)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Vidéos</span>
                    <span className="font-medium">{formatNumber(plan.features.videosUpload)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Mise en avant</span>
                      {plan.features.featuredListing ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Support prioritaire</span>
                      {plan.features.prioritySupport ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Analytics</span>
                      {plan.features.analyticsAccess ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    
                    {plan.type === 'VIP' && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span>Branding personnalisé</span>
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span>Accès API</span>
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Taux de commission</div>
                    <div className="text-lg font-bold text-green-600">
                      {(plan.features.commissionRate * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="pt-4">
                  {isCurrentPlan ? (
                    <div className="space-y-2">
                      <Button variant="outline" disabled className="w-full">
                        Plan Actuel
                      </Button>
                      {currentSubscription?.price > 0 && !currentSubscription?.cancelAt && (
                        <Button variant="destructive" size="sm" onClick={handleCancel} className="w-full">
                          Annuler l'abonnement
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleUpgrade(plan.type)}
                      disabled={upgrading === plan.type}
                      variant={plan.type === 'VIP' ? 'default' : plan.type === 'PREMIUM' ? 'secondary' : 'outline'}
                    >
                      {upgrading === plan.type ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Traitement...
                        </div>
                      ) : plan.price === 0 ? (
                        'Passer au gratuit'
                      ) : currentSubscription?.type === 'BASIC' ? (
                        'Mettre à niveau'
                      ) : (
                        'Changer de plan'
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Benefits Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Pourquoi mettre à niveau ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto" />
              <h4 className="font-medium">Augmentez vos revenus</h4>
              <p className="text-sm text-muted-foreground">
                Taux de commission réduits et plus de visibilité
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <Users className="w-8 h-8 text-blue-600 mx-auto" />
              <h4 className="font-medium">Plus de clients</h4>
              <p className="text-sm text-muted-foreground">
                Mise en avant et fonctionnalités premium
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto" />
              <h4 className="font-medium">Analytics avancées</h4>
              <p className="text-sm text-muted-foreground">
                Suivez vos performances en détail
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 