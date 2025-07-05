'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Euro, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WalletData {
  currentBalance: number;
  availableEarnings: number;
  pendingEarnings: number;
  totalEarnings: number;
  totalWithdrawn: number;
  pendingCommissions: number;
  minimumWithdrawal: number;
  isVerified: boolean;
  isActive: boolean;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
  platformFee?: number;
  netAmount?: number;
}

interface WalletStats {
  wallet: WalletData;
  period: {
    earnings: number;
    withdrawals: number;
    commissions: number;
    fees: number;
    netEarnings: number;
  };
  pending: {
    payouts: number;
    amount: number;
  };
  transactions: number;
}

interface Payout {
  id: string;
  amount: number;
  currency: string;
  fee: number;
  netAmount: number;
  status: string;
  paymentMethod: string;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
}

interface EarningsForecast {
  dailyAverage: number;
  weeklyForecast: number;
  monthlyForecast: number;
  pendingEarnings: number;
  totalForecast: number;
}

export default function FinancialDashboard() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [forecast, setForecast] = useState<EarningsForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const { toast } = useToast();

  useEffect(() => {
    fetchFinancialData();
  }, [selectedPeriod]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Fetch wallet data
      const walletResponse = await fetch('/api/wallet/balance');
      const walletData = await walletResponse.json();
      
      // Fetch transactions
      const transactionsResponse = await fetch('/api/wallet/transactions');
      const transactionsData = await transactionsResponse.json();
      
      // Fetch payouts
      const payoutsResponse = await fetch('/api/wallet/payouts');
      const payoutsData = await payoutsResponse.json();
      
      // Fetch statistics
      const statsResponse = await fetch(`/api/wallet/stats?period=${selectedPeriod}`);
      const statsData = await statsResponse.json();
      
      // Fetch forecast
      const forecastResponse = await fetch('/api/wallet/forecast');
      const forecastData = await forecastResponse.json();
      
      setWalletData(walletData);
      setTransactions(transactionsData.transactions || []);
      setPayouts(payoutsData.payouts || []);
      setStats(statsData);
      setForecast(forecastData);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données financières",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (amount: number, method: string) => {
    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, paymentMethod: method }),
      });
      
      if (!response.ok) throw new Error('Withdrawal failed');
      
      toast({
        title: "Demande de retrait",
        description: `Retrait de ${amount}€ demandé avec succès`,
      });
      
      await fetchFinancialData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter la demande de retrait",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string, amount: number) => {
    if (amount > 0) {
      return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    } else {
      return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'En attente', variant: 'secondary' as const },
      PROCESSING: { label: 'Traitement', variant: 'default' as const },
      COMPLETED: { label: 'Terminé', variant: 'success' as const },
      FAILED: { label: 'Échec', variant: 'destructive' as const },
      CANCELLED: { label: 'Annulé', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde Disponible</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(walletData?.availableEarnings || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum retrait: {formatCurrency(walletData?.minimumWithdrawal || 50)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gains Totaux</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(walletData?.totalEarnings || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(stats?.period.earnings || 0)} ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retraits Totaux</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(walletData?.totalWithdrawn || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.pending.payouts || 0} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions En Attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(walletData?.pendingCommissions || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Seront créditées prochainement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Status Alert */}
      {walletData && !walletData.isVerified && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Votre portefeuille n'est pas encore vérifié. Veuillez compléter la vérification pour pouvoir effectuer des retraits.
            <Button variant="link" className="ml-2 h-auto p-0">
              Vérifier maintenant
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Earnings Forecast */}
      {forecast && (
        <Card>
          <CardHeader>
            <CardTitle>Prévisions de Gains</CardTitle>
            <CardDescription>
              Basées sur vos gains des 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(forecast.dailyAverage)}
                </div>
                <p className="text-sm text-muted-foreground">Par jour</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(forecast.weeklyForecast)}
                </div>
                <p className="text-sm text-muted-foreground">Par semaine</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(forecast.monthlyForecast)}
                </div>
                <p className="text-sm text-muted-foreground">Par mois</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(forecast.pendingEarnings)}
                </div>
                <p className="text-sm text-muted-foreground">Réservations confirmées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Retraits</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => handleWithdraw(100, 'bank_transfer')}
                  disabled={!walletData?.isVerified || (walletData?.availableEarnings || 0) < 100}
                  className="w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Retrait Rapide 100€
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleWithdraw(walletData?.availableEarnings || 0, 'bank_transfer')}
                  disabled={!walletData?.isVerified || (walletData?.availableEarnings || 0) < (walletData?.minimumWithdrawal || 50)}
                  className="w-full"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Retirer Tout ({formatCurrency(walletData?.availableEarnings || 0)})
                </Button>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Performance ({selectedPeriod})</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod('week')}
                  >
                    Semaine
                  </Button>
                  <Button
                    variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod('month')}
                  >
                    Mois
                  </Button>
                  <Button
                    variant={selectedPeriod === 'year' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPeriod('year')}
                  >
                    Année
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Gains</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(stats?.period.earnings || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Commissions</span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(stats?.period.commissions || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frais</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(stats?.period.fees || 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm font-medium">
                    <span>Gains nets</span>
                    <span className="text-green-600">
                      {formatCurrency(stats?.period.netEarnings || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions Récentes</CardTitle>
              <CardDescription>
                Historique de vos transactions financières
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type, transaction.amount)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Retraits</CardTitle>
              <CardDescription>
                Vos demandes de retrait et leur statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ArrowDownRight className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium">Retrait {payout.paymentMethod}</p>
                        <p className="text-sm text-muted-foreground">
                          Demandé le {formatDate(payout.requestedAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Frais: {formatCurrency(payout.fee)} - Net: {formatCurrency(payout.netAmount)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-600">
                        -{formatCurrency(payout.amount)}
                      </div>
                      {getStatusBadge(payout.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Financières</CardTitle>
              <CardDescription>
                Analyse détaillée de vos performances financières
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Analytics détaillées disponibles avec l'abonnement Premium
                </p>
                <Button className="mt-4">
                  Mettre à niveau
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 