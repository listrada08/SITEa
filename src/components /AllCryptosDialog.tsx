
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
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
  amount: number;
  avgPrice: string;
  profit: string;
  positive: boolean;
  marketCap: string;
  lastUpdate: string;
}

interface AllCryptosDialogProps {
  trigger: React.ReactNode;
  cryptos: any[];
  onDeleteCrypto: (id: string) => void;
}

const AllCryptosDialog = ({ trigger, cryptos, onDeleteCrypto }: AllCryptosDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { formatValue, parseValueFromString } = useCurrency();
  
  const [allCryptos, setAllCryptos] = useState<Cryptocurrency[]>([]);

  // Converte os cryptos recebidos para o formato completo
  useEffect(() => {
    const enhancedCryptos = cryptos.map(crypto => ({
      ...crypto,
      avgPrice: crypto.price,
      profit: Math.random() > 0.5 ? '+' + (Math.random() * 1000).toFixed(2) : '-' + (Math.random() * 500).toFixed(2),
      marketCap: (Math.random() * 1000000).toFixed(0),
      lastUpdate: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }));
    setAllCryptos(enhancedCryptos);
  }, [cryptos]);

  // Atualização em tempo real
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setAllCryptos(prevCryptos => 
        prevCryptos.map(crypto => {
          const changePercent = (Math.random() - 0.5) * 6;
          const isPositive = changePercent > 0;
          const formattedChange = `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`;
          
          const currentPrice = parseValueFromString(crypto.price);
          const newPrice = currentPrice * (1 + changePercent / 100);
          const formattedPrice = formatValue(newPrice);
          
          const now = new Date();
          const lastUpdate = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          
          return {
            ...crypto,
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

  const handleDeleteCrypto = (cryptoId: string) => {
    const cryptoToDelete = allCryptos.find(crypto => crypto.id === cryptoId);
    onDeleteCrypto(cryptoId);
    
    toast({
      title: "Criptomoeda removida",
      description: `${cryptoToDelete?.name} foi removida do seu portfólio.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Todas as Criptomoedas</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Criptomoeda</TableHead>
                <TableHead>Preço Atual</TableHead>
                <TableHead>Variação 24h</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço Médio</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Lucro/Prejuízo</TableHead>
                <TableHead>Market Cap</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCryptos.map((crypto) => (
                <TableRow key={crypto.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{crypto.name}</div>
                      <div className="text-sm text-gray-500">{crypto.symbol}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatValue(crypto.price)}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center ${crypto.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {crypto.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {crypto.change}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{crypto.amount}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-600">{formatValue(crypto.avgPrice)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatValue(crypto.value)}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${crypto.profit?.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {formatValue(crypto.profit)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{formatValue(crypto.marketCap)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">{crypto.lastUpdate}</div>
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

export default AllCryptosDialog;
