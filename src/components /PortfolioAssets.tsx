
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import AddAssetDialog from './AddAssetDialog';
import AllAssetsDialog from './AllAssetsDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  value: string;
  positive: boolean;
}

interface PortfolioAssetsProps {
  onBalanceUpdate?: (amount: number) => void;
  investments: Asset[];
  onInvestmentDeleted: (id: string) => void;
  onInvestmentAdded: (investment: any) => void;
}

const PortfolioAssets = ({ onBalanceUpdate, investments, onInvestmentDeleted, onInvestmentAdded }: PortfolioAssetsProps) => {
  const { toast } = useToast();
  const { formatValue, parseValueFromString } = useCurrency();
  const [localAssets, setLocalAssets] = useState<Asset[]>(investments);

  // Sincroniza com as props quando mudam
  useEffect(() => {
    setLocalAssets(investments);
  }, [investments]);

  // Simulação de atualização em tempo real dos preços
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalAssets(prevAssets => 
        prevAssets.map(asset => {
          // Simula mudanças aleatórias nos preços
          const changePercent = (Math.random() - 0.5) * 4; // Variação de -2% a +2%
          const isPositive = changePercent > 0;
          const formattedChange = `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`;
          
          // Atualiza o preço baseado na mudança
          const currentPrice = parseValueFromString(asset.price);
          const newPrice = currentPrice * (1 + changePercent / 100);
          const formattedPrice = formatValue(newPrice);
          
          return {
            ...asset,
            price: formattedPrice,
            change: formattedChange,
            positive: isPositive
          };
        })
      );
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval);
  }, [formatValue, parseValueFromString]);

  const handleAssetAdded = (newAsset: any) => {
    onInvestmentAdded(newAsset);
    toast({
      title: "Investimento adicionado",
      description: `${newAsset.name} foi adicionado ao seu portfólio.`,
    });
  };

  const handleDeleteAsset = (assetId: string) => {
    const assetToDelete = localAssets.find(asset => asset.id === assetId);
    onInvestmentDeleted(assetId);
    
    toast({
      title: "Investimento removido",
      description: `${assetToDelete?.name} foi removido do seu portfólio.`,
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Principais Ativos</h3>
        <div className="flex gap-2">
          <AddAssetDialog 
            onAssetAdded={handleAssetAdded} 
            onBalanceUpdate={onBalanceUpdate}
          />
          <AllAssetsDialog 
            trigger={
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                Ver Todos
              </button>
            }
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-200">
          <div>Ativo</div>
          <div>Preço / Variação</div>
          <div>Investimento</div>
          <div></div>
          <div></div>
        </div>
        
        {localAssets.map((asset) => (
          <div key={asset.id} className="grid grid-cols-5 gap-4 items-center py-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div>
              <div className="font-medium text-gray-900">{asset.name}</div>
              <div className="text-sm text-gray-500">{asset.symbol}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">{formatValue(asset.price)}</div>
              <div className={`text-sm flex items-center ${asset.positive ? 'text-green-600' : 'text-red-600'}`}>
                {asset.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {asset.change}
              </div>
            </div>
            <div className="font-medium text-gray-900">{formatValue(asset.value)}</div>
            <div>
              <AllAssetsDialog 
                trigger={
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Detalhes
                  </button>
                }
              />
            </div>
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="text-red-600 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Investimento</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja remover {asset.name} do seu portfólio? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDeleteAsset(asset.id)}
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
  );
};

export default PortfolioAssets;
