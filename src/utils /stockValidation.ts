
// Lista de ações válidas (simulando uma API de ações reais)
const validStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'PETR4', name: 'Petrobras' },
  { symbol: 'VALE3', name: 'Vale S.A.' },
  { symbol: 'ITUB4', name: 'Itaú Unibanco' },
  { symbol: 'BBDC4', name: 'Bradesco' },
  { symbol: 'ABEV3', name: 'Ambev' },
  { symbol: 'MGLU3', name: 'Magazine Luiza' },
  { symbol: 'WEGE3', name: 'WEG' },
  { symbol: 'RENT3', name: 'Localiza' }
];

export const validateStock = (symbol: string) => {
  const stock = validStocks.find(stock => stock.symbol.toLowerCase() === symbol.toLowerCase());
  return stock || null;
};

export const getValidStocks = () => validStocks;

export const searchStocks = (query: string) => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return validStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(lowerQuery) || 
    stock.name.toLowerCase().includes(lowerQuery)
  ).slice(0, 5);
};
