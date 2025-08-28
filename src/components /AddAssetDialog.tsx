import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateStock, searchStocks } from '../utils/stockValidation';

const AddAssetDialog = ({ onAssetAdded, onBalanceUpdate }: AddAssetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    price: '',
    shares: ''
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const handleSymbolChange = (value: string) => {
    setFormData(prev => ({ ...prev, symbol: value.toUpperCase() }));
    
    if (value.length > 0) {
      const results = searchStocks(value);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (stock: any) => {
    setFormData(prev => ({ 
      ...prev, 
      symbol: stock.symbol,
      name: stock.name 
    }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.symbol || !formData.price || !formData.shares) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    // Validar se a ação existe
    const validStock = validateStock(formData.symbol);
    if (!validStock) {
      toast({
        title: "Ação inválida",
        description: "Por favor, selecione uma ação válida da lista de sugestões.",
        variant: "destructive"
      });
      return;
    }

    const totalInvestment = parseFloat(formData.price) * parseInt(formData.shares);

    const newAsset = {
      name: formData.name,
      symbol: formData.symbol.toUpperCase(),
      price: `R$${parseFloat(formData.price).toFixed(2)}`,
      change: '+0,00%',
      value: `R$${totalInvestment.toFixed(0)}`,
      positive: true
    };

    console.log('Nova ação adicionada:', newAsset);
    
    toast({
      title: "Sucesso!",
      description: `Ação ${newAsset.symbol} adicionada com sucesso.`
    });

    if (onAssetAdded) {
      onAssetAdded(newAsset);
    }

    // Atualizar saldo total (diminuir o valor investido)
    if (onBalanceUpdate) {
      onBalanceUpdate(-totalInvestment);
    }

    setFormData({ name: '', symbol: '', price: '', shares: '' });
    setSuggestions([]);
    setShowSuggestions(false);
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar Ação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Ação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
              Símbolo da Ação
            </label>
            <input
              id="symbol"
              type="text"
              value={formData.symbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
              placeholder="Ex: AAPL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="off"
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {suggestions.map((stock, index) => (
                  <div
                    key={index}
                    onClick={() => selectSuggestion(stock)}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-sm text-gray-500">{stock.name}</div>
                    </div>
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Apple Inc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Preço por Ação (R$)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="187.50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="shares" className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade de Ações
            </label>
            <input
              id="shares"
              type="number"
              value={formData.shares}
              onChange={(e) => handleInputChange('shares', e.target.value)}
              placeholder="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {formData.price && formData.shares && (
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="text-sm text-blue-700">
                <strong>Investimento Total: R$ {(parseFloat(formData.price || '0') * parseInt(formData.shares || '0')).toFixed(2)}</strong>
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Este valor será descontado do seu saldo total
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Adicionar Ação
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssetDialog;
