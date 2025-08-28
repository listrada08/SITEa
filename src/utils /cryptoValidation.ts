
// Lista de criptomoedas válidas
const validCryptos = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'BNB', name: 'Binance Coin' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'XRP', name: 'Ripple' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'AVAX', name: 'Avalanche' },
  { symbol: 'SHIB', name: 'Shiba Inu' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'LTC', name: 'Litecoin' },
  { symbol: 'UNI', name: 'Uniswap' },
  { symbol: 'LINK', name: 'Chainlink' },
  { symbol: 'ATOM', name: 'Cosmos' },
  { symbol: 'FTT', name: 'FTX Token' },
  { symbol: 'NEAR', name: 'NEAR Protocol' },
  { symbol: 'ALGO', name: 'Algorand' },
  { symbol: 'VET', name: 'VeChain' },
  { symbol: 'ICP', name: 'Internet Computer' }
];

export const validateCrypto = (symbol: string) => {
  const crypto = validCryptos.find(crypto => crypto.symbol.toLowerCase() === symbol.toLowerCase());
  return crypto || null;
};

export const getValidCryptos = () => validCryptos;

export const searchCryptos = (query: string) => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return validCryptos.filter(crypto => 
    crypto.symbol.toLowerCase().includes(lowerQuery) || 
    crypto.name.toLowerCase().includes(lowerQuery)
  ).slice(0, 5);
};
