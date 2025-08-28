

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface AllTransactionsDialogProps {
  trigger: React.ReactNode;
}

const AllTransactionsDialog = ({ trigger }: AllTransactionsDialogProps) => {
  const { t } = useTranslation();
  
  const allTransactions = [
    {
      id: 1,
      name: 'Apple Inc.',
      symbol: 'AAPL',
      type: t('recentTransactions.buy'),
      shares: `5 ${t('recentTransactions.shares')}`,
      price: 'R$187,10',
      amount: '+R$935,50',
      time: `${t('recentTransactions.today')}, 10:30`,
      status: t('common.success'),
      positive: true,
    },
    {
      id: 2,
      name: 'Bitcoin',
      symbol: 'BTC',
      type: t('recentTransactions.sell'),
      shares: '0,25 BTC',
      price: 'R$62.960,00',
      amount: '-R$15.240,00',
      time: `${t('recentTransactions.yesterday')}, 14:45`,
      status: t('common.success'),
      positive: false,
    },
    {
      id: 3,
      name: 'S&P 500 ETF',
      symbol: 'SPY',
      type: t('recentTransactions.buy'),
      shares: `10 ${t('recentTransactions.shares')}`,
      price: 'R$435,02',
      amount: '+R$4.350,25',
      time: '15 Jun, 09:15',
      status: t('common.success'),
      positive: true,
    },
    {
      id: 4,
      name: 'Tesla Inc.',
      symbol: 'TSLA',
      type: t('recentTransactions.buy'),
      shares: `2 ${t('recentTransactions.shares')}`,
      price: 'R$255,37',
      amount: '+R$510,75',
      time: '10 Jun, 11:30',
      status: t('common.success'),
      positive: true,
    },
    {
      id: 5,
      name: 'Microsoft',
      symbol: 'MSFT',
      type: t('recentTransactions.sell'),
      shares: `3 ${t('recentTransactions.shares')}`,
      price: 'R$402,25',
      amount: '-R$1.206,75',
      time: '08 Jun, 16:20',
      status: t('common.success'),
      positive: false,
    },
    {
      id: 6,
      name: 'Amazon',
      symbol: 'AMZN',
      type: t('recentTransactions.buy'),
      shares: `4 ${t('recentTransactions.shares')}`,
      price: 'R$178,75',
      amount: '+R$715,00',
      time: '05 Jun, 13:45',
      status: t('dashboard.transactionHistory'),
      positive: true,
    },
    {
      id: 7,
      name: 'Google',
      symbol: 'GOOGL',
      type: t('recentTransactions.buy'),
      shares: `1 ${t('recentTransactions.shares')}`,
      price: 'R$2.750,30',
      amount: '+R$2.750,30',
      time: '02 Jun, 10:15',
      status: t('common.success'),
      positive: true,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{t('recentTransactions.allTransactions')}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('recentTransactions.asset')}</TableHead>
                <TableHead>{t('common.type')}</TableHead>
                <TableHead>{t('recentTransactions.quantity')}</TableHead>
                <TableHead>{t('recentTransactions.price')}</TableHead>
                <TableHead>{t('recentTransactions.totalValue')}</TableHead>
                <TableHead>{t('recentTransactions.dateTime')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell>
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
                        <div className="font-medium">{transaction.name}</div>
                        <div className="text-sm text-muted-foreground">{transaction.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === t('recentTransactions.buy') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.shares}</TableCell>
                  <TableCell className="font-medium">{transaction.price}</TableCell>
                  <TableCell className={`font-medium ${transaction.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{transaction.time}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === t('common.success') 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllTransactionsDialog;
