

import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import AddCryptoDialog from './AddCryptoDialog';
import AllCryptosDialog from './AllCryptosDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';

interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  value: string;
  positive: boolean;
  amount: number;
}

interface CryptocurrencySectionProps {
  onBalanceUpdate?: (amount: number) => void;
  cryptos: Cryptocurrency[];
  onCryptoDeleted: (id: string) => void;
  onCryptoAdded: (crypto: any) => void;
}

const CryptocurrencySection = ({ onBalanceUpdate, cryptos, onCryptoDeleted, onCryptoAdded }: CryptocurrencySectionProps) => {
  const { toast } = useToast();
  const { formatValue, parseValueFromString } = useCurrency();
  const [localCryptos, setLocalCryptos] = useState<Cryptocurrency[]>(cryptos);

  // Sincroniza com as props quando mudam
  useEffect(() => {
    setLocalCryptos(cryptos);
  }, [cryptos]);

  // Simulação de atualização em tempo real dos preços - mais frequente para criptos
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalCryptos(prevCryptos => 
        prevCryptos.map(crypto => {
          // Simula mudanças aleatórias nos preços - mais volátil para criptos
          const changePercent = (Math.random() - 0.5) * 8; // Variação de -4% a +4%
          const isPositive = changePercent > 0;
          const formattedChange = `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`;
          
          // Atualiza o preço baseado na mudança
          const currentPrice = parseValueFromString(crypto.price);
          const newPrice = currentPrice * (1 + changePercent / 100);
          const formattedPrice = formatValue(newPrice);
          
          // Atualiza o valor total
          const newValue = newPrice * crypto.amount;
          const formattedValue = formatValue(newValue);
          
          return {
            ...crypto,
            price: formattedPrice,
            change: formattedChange,
            value: formattedValue,
            positive: isPositive
          };
        })
      );
    }, 2000); // Atualiza a cada 2 segundos (mais frequente)

    return () => clearInterval(interval);
  }, [formatValue, parseValueFromString]);

  const handleCryptoAdded = (newCrypto: any) => {
    onCryptoAdded(newCrypto);
    toast({
      title: "Criptomoeda adicionada",
      description: `${newCrypto.name} foi adicionada ao seu portfólio.`,
    });
  };

  const handleDeleteCrypto = (cryptoId: string) => {
    const cryptoToDelete = localCryptos.find(crypto => crypto.id === cryptoId);
    onCryptoDeleted(cryptoId);
    
    toast({
      title: "Criptomoeda removida",
      description: `${cryptoToDelete?.name} foi removida do seu portfólio.`,
    });
  };

  const totalCryptoValue = localCryptos.reduce((total, crypto) => {
    const value = parseValueFromString(crypto.value);
    return total + value;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Estatísticas das Criptomoedas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Valor Total em Cripto</h3>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatValue(totalCryptoValue)}
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+5,2%</span>
            <span className="text-gray-500 ml-1">24h</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Moedas</h3>
          <div className="text-2xl font-bold text-gray-900 mb-2">{localCryptos.length}</div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500">Diferentes criptomoedas</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Melhor Performance</h3>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {localCryptos.length > 0 ? localCryptos[0].symbol : 'N/A'}
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+12,5%</span>
            <span className="text-gray-500 ml-1">7 dias</span>
          </div>
        </div>
      </div>

      {/* Lista de Criptomoedas */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Minhas Criptomoedas</h3>
          <div className="flex gap-2">
            <AddCryptoDialog 
              onCryptoAdded={handleCryptoAdded} 
              onBalanceUpdate={onBalanceUpdate}
            />
            <AllCryptosDialog 
              cryptos={localCryptos}
              onDeleteCrypto={onCryptoDeleted}
              trigger={
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Ver Todas
                </button>
              }
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-200">
            <div>Criptomoeda</div>
            <div>Preço / Variação</div>
            <div>Quantidade</div>
            <div>Valor Total</div>
            <div>Ações</div>
          </div>
          
          {localCryptos.map((crypto) => (
            <div key={crypto.id} className="grid grid-cols-5 gap-4 items-center py-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div>
                <div className="font-medium text-gray-900">{crypto.name}</div>
                <div className="text-sm text-gray-500">{crypto.symbol}</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">{formatValue(crypto.price)}</div>
                <div className={`text-sm flex items-center ${crypto.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {crypto.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {crypto.change}
                </div>
              </div>
              <div className="font-medium text-gray-900">{crypto.amount}</div>
              <div className="font-medium text-gray-900">{formatValue(crypto.value)}</div>
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-red-600 hover:text-red-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Criptomoeda</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover {crypto.name} do seu portfólio? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteCrypto(crypto.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CryptocurrencySection;
