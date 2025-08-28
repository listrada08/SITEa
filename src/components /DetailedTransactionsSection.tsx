

import { useState } from 'react';
import { TrendingUp, TrendingDown, Filter, Search, Calendar, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AllTransactionsDialog from './AllTransactionsDialog';

interface Transaction {
  id: number;
  name: string;
  symbol: string;
  type: 'Compra' | 'Venda';
  shares: string;
  price: string;
  amount: string;
  time: string;
  status: 'Concluída' | 'Pendente' | 'Cancelada';
  positive: boolean;
  fee: string;
  total: string;
  category: string;
}

const DetailedTransactionsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const allTransactions: Transaction[] = [
    {
      id: 1,
      name: 'Apple Inc.',
      symbol: 'AAPL',
      type: 'Compra',
      shares: '5 ações',
      price: 'R$187,10',
      amount: 'R$935,50',
      time: 'Hoje, 10:30',
      status: 'Concluída',
      positive: true,
      fee: 'R$2,50',
      total: 'R$938,00',
      category: 'Ações'
    },
    {
      id: 2,
      name: 'Bitcoin',
      symbol: 'BTC',
      type: 'Venda',
      shares: '0,25 BTC',
      price: 'R$62.960,00',
      amount: 'R$15.240,00',
      time: 'Ontem, 14:45',
      status: 'Concluída',
      positive: false,
      fee: 'R$15,24',
      total: 'R$15.224,76',
      category: 'Cripto'
    },
    {
      id: 3,
      name: 'S&P 500 ETF',
      symbol: 'SPY',
      type: 'Compra',
      shares: '10 ações',
      price: 'R$435,02',
      amount: 'R$4.350,25',
      time: '15 Jun, 09:15',
      status: 'Concluída',
      positive: true,
      fee: 'R$8,70',
      total: 'R$4.358,95',
      category: 'ETF'
    },
    {
      id: 4,
      name: 'Tesla Inc.',
      symbol: 'TSLA',
      type: 'Compra',
      shares: '2 ações',
      price: 'R$255,37',
      amount: 'R$510,75',
      time: '10 Jun, 11:30',
      status: 'Pendente',
      positive: true,
      fee: 'R$1,02',
      total: 'R$511,77',
      category: 'Ações'
    },
    {
      id: 5,
      name: 'Microsoft',
      symbol: 'MSFT',
      type: 'Venda',
      shares: '3 ações',
      price: 'R$402,25',
      amount: 'R$1.206,75',
      time: '08 Jun, 16:20',
      status: 'Concluída',
      positive: false,
      fee: 'R$2,41',
      total: 'R$1.204,34',
      category: 'Ações'
    },
    {
      id: 6,
      name: 'Ethereum',
      symbol: 'ETH',
      type: 'Compra',
      shares: '2 ETH',
      price: 'R$3.450,00',
      amount: 'R$6.900,00',
      time: '05 Jun, 13:45',
      status: 'Cancelada',
      positive: true,
      fee: 'R$6,90',
      total: 'R$6.906,90',
      category: 'Cripto'
    }
  ];

  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch = transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type.toLowerCase() === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status.toLowerCase() === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluída':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.type === 'Compra') {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros e busca */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por ativo ou símbolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="compra">Compra</SelectItem>
                <SelectItem value="venda">Venda</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="concluída">Concluída</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Período
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de transações */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Histórico de Transações ({filteredTransactions.length})
            </h3>
            <AllTransactionsDialog 
              trigger={
                <Button variant="outline" size="sm">
                  Ver Tabela Completa
                </Button>
              }
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'Compra' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {getTransactionIcon(transaction)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{transaction.name}</h4>
                      <span className="text-sm text-gray-500">({transaction.symbol})</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'Compra' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Quantidade:</span>
                        <div className="font-medium">{transaction.shares}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Preço Unitário:</span>
                        <div className="font-medium">{transaction.price}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Taxa:</span>
                        <div className="font-medium">{transaction.fee}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Total:</span>
                        <div className={`font-medium ${
                          transaction.type === 'Compra' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'Compra' ? '-' : '+'}{transaction.total}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">{transaction.time}</div>
                  <div className="text-xs text-gray-400">{transaction.category}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">Nenhuma transação encontrada</div>
            <div className="text-sm text-gray-500">Tente ajustar os filtros de busca</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedTransactionsSection;
