
import { usePreferences } from '@/contexts/PreferencesContext';

export const useCurrency = () => {
  const { formatCurrency } = usePreferences();
  
  const parseValueFromString = (valueString: string): number => {
    // Remove currency symbols and convert to number
    const numericString = valueString
      .replace(/[^\d,.-]/g, '') // Remove non-numeric characters except comma, dot, and minus
      .replace(',', '.'); // Replace comma with dot for decimal
    
    return parseFloat(numericString) || 0;
  };

  const formatValue = (value: string | number): string => {
    if (typeof value === 'string') {
      const numericValue = parseValueFromString(value);
      return formatCurrency(numericValue);
    }
    return formatCurrency(value);
  };

  return {
    formatCurrency,
    formatValue,
    parseValueFromString
  };
};
