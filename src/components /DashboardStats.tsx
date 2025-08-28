
import { TrendingUp, TrendingDown, DollarSign, Target, PieChart, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import PerformanceChart from './PerformanceChart';
import AllocationChart from './AllocationChart';
import RecentTransactions from './RecentTransactions';

import { useCurrency } from '@/hooks/useCurrency';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DashboardStatsProps {
  totalBalance: number;
  onBalanceChange: (newBalance: number) => void;
}

const DashboardStats = ({ totalBalance, onBalanceChange }: DashboardStatsProps) => {
  const { formatValue } = useCurrency();
  const [savedBalance, setSavedBalance] = useLocalStorage('totalBalance', totalBalance);
  
  // Dados dos investimentos para o gráfico de alocação
  const investments = [
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
    },
    {
      id: '3',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: '43,250.00',
      change: '+3.25%',
      value: '21,625.00',
      positive: true,
      category: 'Cripto'
    },
    {
      id: '4',
      name: 'Ethereum',
      symbol: 'ETH',
      price: '2,650.00',
      change: '+1.85%',
      value: '7,950.00',
      positive: true,
      category: 'Cripto'
    }
  ];


  const stats = [
    {
      title: 'Saldo Total',
      value: formatValue(savedBalance),
      change: '+12.5%',
      positive: true,
      icon: DollarSign,
      
    },
    {
      title: 'Ganhos Hoje',
      value: formatValue(1850.75),
      change: '+5.2%',
      positive: true,
      icon: TrendingUp
    },
    {
      title: 'Investimentos',
      value: formatValue(38500.00),
      change: '+8.1%',
      positive: true,
      icon: Target
    },
    {
      title: 'Rendimento Mensal',
      value: formatValue(4250.30),
      change: '+15.8%',
      positive: true,
      icon: BarChart3
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className={`flex items-center mt-2 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.positive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.positive ? 'bg-green-100' : 'bg-red-100'}`}>
                <stat.icon className={`w-6 h-6 ${stat.positive ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart />
        <AllocationChart investments={investments} />
      </div>

      {/* Transações Recentes */}
      <RecentTransactions />
    </div>
  );
};

export default DashboardStats;
