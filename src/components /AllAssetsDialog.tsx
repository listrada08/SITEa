

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';

interface AllAssetsDialogProps {
  trigger: React.ReactNode;
}

interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  value: string;
  shares: number;
  avgPrice: string;
  profit: string;
  positive: boolean;
  sector: string;
  lastUpdate: string;
}

const AllAssetsDialog = ({ trigger }: AllAssetsDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { formatValue, parseValueFromString } = useCurrency();
  
  const [allAssets, setAllAssets] = useState<Asset[]>([
    {
      id: '1',
      name: 'Apple Inc.',
      symbol: 'AAPL',
      price: 'R$187,00',
      change: '+1,87%',
      value: 'R$9.350',
      shares: 50,
      avgPrice: 'R$185,50',
      profit: '+R$75,00',
      positive: true,
      sector: 'Tecnologia',
      lastUpdate: '15:30'
    },
    {
      id: '2',
      name: 'Microsoft',
      symbol: 'MSFT',
      price: 'R$402,25',
      change: '+1,45%',
      value: 'R$12.067',
      shares: 30,
      avgPrice: 'R$398,90',
      profit: '+R$100,50',
      positive: true,
      sector: 'Tecnologia',
      lastUpdate: '15:30'
    },
    {
      id: '3',
      name: 'Amazon',
      symbol: 'AMZN',
      price: 'R$178,75',
      change: '+1,24%',
      value: 'R$7.150',
      shares: 40,
      avgPrice: 'R$180,00',
      profit: '-R$50,00',
      positive: false,
      sector: 'E-commerce',
      lastUpdate: '15:30'
    },
    {
      id: '4',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 'R$61.250',
      change: '+2,08%',
      value: 'R$15.312',
      shares: 0.25,
      avgPrice: 'R$59.800',
      profit: '+R$362,50',
      positive: true,
      sector: 'Criptomoeda',
      lastUpdate: '15:30'
    },
    {
      id: '5',
      name: 'Tesla Inc.',
      symbol: 'TSLA',
      price: 'R$245,30',
      change: '-0,85%',
      value: 'R$4.906',
      shares: 20,
      avgPrice: 'R$250,00',
      profit: '-R$94,00',
      positive: false,
      sector: 'Automotivo',
      lastUpdate: '15:30'
    },
    {
      id: '6',
      name: 'NVIDIA',
      symbol: 'NVDA',
      price: 'R$520,75',
      change: '+3,25%',
      value: 'R$5.207',
      shares: 10,
      avgPrice: 'R$485,00',
      profit: '+R$357,50',
      positive: true,
      sector: 'Semicondutores',
      lastUpdate: '15:30'
    }
  ]);

  // Atualização em tempo real
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setAllAssets(prevAssets => 
        prevAssets.map(asset => {
          const changePercent = (Math.random() - 0.5) * 4;
          const isPositive = changePercent > 0;
          const formattedChange = `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`;
          
          const currentPrice = parseValueFromString(asset.price);
          const newPrice = currentPrice * (1 + changePercent / 100);
          const formattedPrice = formatValue(newPrice);
          
          const now = new Date();
          const lastUpdate = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          
          return {
            ...asset,
            price: formattedPrice,
            change: formattedChange,
            positive: isPositive,
            lastUpdate
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [open, formatValue, parseValueFromString]);

  const handleDeleteAsset = (assetId: string) => {
    const assetToDelete = allAssets.find(asset => asset.id === assetId);
    setAllAssets(prev => prev.filter(asset => asset.id !== assetId));
    
    toast({
      title: "Investimento removido",
      description: `${assetToDelete?.name} foi removido do seu portfólio.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Todos os Investimentos</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Ativo</TableHead>
                <TableHead>Preço Atual</TableHead>
                <TableHead>Variação</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço Médio</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Lucro/Prejuízo</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allAssets.map((asset) => (
                <TableRow key={asset.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{asset.name}</div>
                      <div className="text-sm text-gray-500">{asset.symbol}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatValue(asset.price)}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center ${asset.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {asset.change}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{asset.shares}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-600">{formatValue(asset.avgPrice)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatValue(asset.value)}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${asset.profit.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {formatValue(asset.profit)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{asset.sector}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">{asset.lastUpdate}</div>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllAssetsDialog;
