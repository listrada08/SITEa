import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Header from './Header';
import Sidebar from './Sidebar';
import PortfolioAssets from './PortfolioAssets';
import DetailedTransactionsSection from './DetailedTransactionsSection';
import CryptocurrencySection from './CryptocurrencySection';
import ProfileSection from './ProfileSection';
import WalletsSection from './WalletsSection';
import SettingsSection from './SettingsSection';
import DashboardStats from './DashboardStats';

interface Investment {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  value: string;
  positive: boolean;
  category: string;
  amount?: number;
}

// Cryptocurrency interface
interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  value: string;
  positive: boolean;
  amount: number;
  category: string;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'visao-geral');
  const [totalBalance, setTotalBalance] = useLocalStorage('totalBalance', 43650.75);
  const [investments, setInvestments] = useLocalStorage<Investment[]>('investments', [
    {
      id: '1',
      name: 'Apple Inc.',
      symbol: 'AAPL',
      price: '175.43',
      change: '+2.15%',
      value: '8,500.00',
      positive: true,
      category: 'Ações'
    },
    {
      id: '2',
      name: 'Microsoft Corp.',
      symbol: 'MSFT',
      price: '378.85',
      change: '-0.75%',
      value: '12,250.00',
      positive: false,
      category: 'Ações'
    }
  ]);
  const [cryptos, setCryptos] = useLocalStorage<Cryptocurrency[]>('cryptos', [
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: '43,250.00',
      change: '+3.25%',
      value: '21,625.00',
      positive: true,
      amount: 0.5,
      category: 'Criptomoedas'
    },
    {
      id: '2',
      name: 'Ethereum',
      symbol: 'ETH',
      price: '2,650.00',
      change: '+1.85%',
      value: '7,950.00',
      positive: true,
      amount: 3,
      category: 'Criptomoedas'
    }
  ]);
  

  const handleBalanceChange = (newBalance: number) => {
    setTotalBalance(newBalance);
  };

  const handleInvestmentDeleted = (id: string) => {
    setInvestments(prev => prev.filter(investment => investment.id !== id));
  };

  const handleInvestmentAdded = (newInvestment: any) => {
    const investment: Investment = {
      ...newInvestment,
      category: 'Ações'
    };
    setInvestments(prev => [...prev, investment]);
  };

  const handleCryptoDeleted = (id: string) => {
    setCryptos(prev => prev.filter(crypto => crypto.id !== id));
  };


  const handleCryptoAdded = (newCrypto: any) => {
    const crypto: Cryptocurrency = {
      ...newCrypto,
      category: 'Criptomoedas'
    };
    setCryptos(prev => [...prev, crypto]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'visao-geral':
        return <DashboardStats totalBalance={totalBalance} onBalanceChange={handleBalanceChange} />;
      case 'portfolio':
        return (
          <PortfolioAssets 
            onBalanceUpdate={handleBalanceChange}
            investments={investments}
            onInvestmentDeleted={handleInvestmentDeleted}
            onInvestmentAdded={handleInvestmentAdded}
          />
        );
      case 'transacoes':
        return <DetailedTransactionsSection />;
      case 'cripto':
        return (
          <CryptocurrencySection 
            onBalanceUpdate={handleBalanceChange}
            cryptos={cryptos}
            onCryptoDeleted={handleCryptoDeleted}
            onCryptoAdded={handleCryptoAdded}
          />
        );
      case 'perfil':
        return <ProfileSection />;
      case 'carteiras':
        return (
          <WalletsSection 
            investments={investments} 
            cryptos={cryptos}
          />
        );
      case 'configuracoes':
        return <SettingsSection />;
      default:
        return <DashboardStats totalBalance={totalBalance} onBalanceChange={handleBalanceChange} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#a8e6cf' }}>
      <Header />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 lg:ml-64">
          <main className="min-h-full p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
