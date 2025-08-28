import { TrendingUp, TrendingDown } from 'lucide-react';
import AllTransactionsDialog from './AllTransactionsDialog';
import { useTranslation } from '@/hooks/useTranslation';

const RecentTransactions = () => {
  const { t } = useTranslation();
  
  const transactions = [
    {
      name: 'Apple Inc.',
      type: t('recentTransactions.buy'),
      shares: `5 ${t('recentTransactions.shares')}`,
      amount: '+R$935,50',
      time: `${t('recentTransactions.today')}, 10:30`,
      positive: true,
    },
    {
      name: 'Bitcoin',
      type: t('recentTransactions.sell'),
      shares: '0,25 BTC',
      amount: '-R$5.240,00',
      time: `${t('recentTransactions.yesterday')}, 14:45`,
      positive: false,
    },
    {
      name: 'S&P 500 ETF',
      type: t('recentTransactions.buy'),
      shares: `10 ${t('recentTransactions.shares')}`,
      amount: '+R$4.350,25',
      time: '15 Jun, 09:15',
      positive: true,
    },
    {
      name: 'Tesla Inc.',
      type: t('recentTransactions.buy'),
      shares: `2 ${t('recentTransactions.shares')}`,
      amount: '+R$510,75',
      time: '10 Jun, 11:30',
      positive: true,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t('recentTransactions.title')}</h3>
        <AllTransactionsDialog 
          trigger={
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              {t('recentTransactions.viewAll')}
            </button>
          }
        />
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div key={index} className="flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg transition-colors px-2">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                transaction.positive ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {transaction.positive ? 
                  <TrendingDown className="w-4 h-4 text-green-600 rotate-180" /> : 
                  <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                }
              </div>
              <div>
                <div className="font-medium text-gray-900">{transaction.name}</div>
                <div className="text-sm text-gray-500">{transaction.shares}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-medium ${transaction.positive ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.amount}
              </div>
              <div className="text-sm text-gray-500">{transaction.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
