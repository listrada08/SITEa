
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Plus, Check, Bitcoin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateCrypto, searchCryptos } from '../utils/cryptoValidation';

interface AddCryptoDialogProps {
  onCryptoAdded?: (crypto: any) => void;
  onBalanceUpdate?: (amount: number) => void;
}

const AddCryptoDialog = ({ onCryptoAdded, onBalanceUpdate }: AddCryptoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    price: '',
    amount: ''
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  const handleSymbolChange = (value: string) => {
    setFormData(prev => ({ ...prev, symbol: value.toUpperCase() }));
    
    if (value.length > 0) {
      const results = searchCryptos(value);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (crypto: any) => {
    setFormData(prev => ({ 
      ...prev, 
      symbol: crypto.symbol,
      name: crypto.name 
    }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.symbol || !formData.price || !formData.amount) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    // Validar se a criptomoeda existe
    const validCrypto = validateCrypto(formData.symbol);
    if (!validCrypto) {
      toast({
        title: "Criptomoeda inválida",
        description: "Por favor, selecione uma criptomoeda válida da lista de sugestões.",
        variant: "destructive"
      });
      return;
    }

    const totalInvestment = parseFloat(formData.price) * parseFloat(formData.amount);

    const newCrypto = {
      name: formData.name,
      symbol: formData.symbol.toUpperCase(),
      price: `R$${parseFloat(formData.price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+0,00%',
      value: `R$${totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      amount: parseFloat(formData.amount),
      positive: true
    };

    console.log('Nova criptomoeda adicionada:', newCrypto);
    
    toast({
      title: "Sucesso!",
      description: `Criptomoeda ${newCrypto.symbol} adicionada com sucesso.`
    });

    if (onCryptoAdded) {
      onCryptoAdded(newCrypto);
    }

    // Atualizar saldo total (diminuir o valor investido)
    if (onBalanceUpdate) {
      onBalanceUpdate(-totalInvestment);
    }

    setFormData({ name: '', symbol: '', price: '', amount: '' });
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
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Bitcoin className="w-4 h-4 mr-1" />
          Adicionar Cripto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Criptomoeda</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
              Símbolo da Criptomoeda
            </label>
            <input
              id="symbol"
              type="text"
              value={formData.symbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
              placeholder="Ex: BTC"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoComplete="off"
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {suggestions.map((crypto, index) => (
                  <div
                    key={index}
                    onClick={() => selectSuggestion(crypto)}
                    className="px-3 py-2 hover:bg-orange-50 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{crypto.symbol}</div>
                      <div className="text-sm text-gray-500">{crypto.name}</div>
                    </div>
                    <Check className="w-4 h-4 text-orange-600" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Criptomoeda
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Bitcoin"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Preço Unitário (R$)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="61250.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade
            </label>
            <input
              id="amount"
              type="number"
              step="0.00000001"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="0.25"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {formData.price && formData.amount && (
            <div className="bg-orange-50 p-3 rounded-md">
              <div className="text-sm text-orange-700">
                <strong>Investimento Total: R$ {(parseFloat(formData.price || '0') * parseFloat(formData.amount || '0')).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
              <div className="text-xs text-orange-600 mt-1">
                Este valor será descontado do seu saldo total
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
              Adicionar Cripto
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

export default AddCryptoDialog;
