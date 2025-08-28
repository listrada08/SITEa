import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/hooks/useCurrency';

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

interface WalletsSectionProps {
  investments: Investment[];
  cryptos: Cryptocurrency[];
}

const WalletsSection = ({ investments, cryptos }: WalletsSectionProps) => {
  const [showValues, setShowValues] = useState(true);
  const { formatValue, parseValueFromString } = useCurrency();

  const allAssets = [...investments, ...cryptos];

  const formatValueDisplay = (value: string) => {
    if (!showValues) return '•••••';
    return formatValue(value);
  };

  const getTotalInvested = () => {
    const assetsTotal = allAssets.reduce((sum, asset) => {
      const value = parseValueFromString(asset.value);
      return sum + value;
    }, 0);
    
    return formatValue(assetsTotal);
  };

  const getAssetsByCategory = () => {
    const categories = allAssets.reduce((acc, asset) => {
      if (!acc[asset.category]) {
        acc[asset.category] = [];
      }
      acc[asset.category].push(asset);
      return acc;
    }, {} as Record<string, Investment[]>);

    return categories;
  };

  const getCategoryTotal = (assets: Investment[]) => {
    const total = assets.reduce((sum, asset) => {
      const value = parseValueFromString(asset.value);
      return sum + value;
    }, 0);
    return formatValue(total);
  };

  const assetsByCategory = getAssetsByCategory();

  return (
    <div className="space-y-4">
      {/* Header com total investido */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Wallet className="w-5 h-5 mr-2" />
            Total Investido
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowValues(!showValues)}
            className="flex items-center gap-2"
          >
            {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showValues ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>
        <div className="text-3xl font-bold text-gray-900">
          {formatValueDisplay(getTotalInvested())}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {allAssets.length} ativos em carteira
        </div>
      </div>

      {/* Carteiras por categoria */}
      {Object.entries(assetsByCategory).map(([category, assets]) => (
        <div key={category} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
            <div className="text-lg font-medium text-gray-700">
              {formatValueDisplay(getCategoryTotal(assets))}
            </div>
          </div>
          
          <div className="space-y-2">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    asset.positive ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {asset.positive ? 
                      <TrendingUp className="w-4 h-4 text-green-600" /> : 
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    }
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{asset.name}</div>
                    <div className="text-sm text-gray-500">{asset.symbol}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {formatValueDisplay(asset.value)}
                  </div>
                  <div className={`text-sm flex items-center justify-end ${
                    asset.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {asset.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {allAssets.length === 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum investimento encontrado</h3>
          <p className="text-gray-500">Adicione seus primeiros investimentos para começar a acompanhar sua carteira.</p>
        </div>
      )}
    </div>
  );
};

export default WalletsSection;
