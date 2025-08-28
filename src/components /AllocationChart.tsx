
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useState, useMemo } from 'react';
import AllocationDetailsDialog from './AllocationDetailsDialog';

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

interface AllocationChartProps {
  investments: Investment[];
}

const AllocationChart = ({ investments }: AllocationChartProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Calcula a alocação baseada nos investimentos reais
  const allocationData = useMemo(() => {
    // Adiciona verificação de segurança para investments
    if (!investments || !Array.isArray(investments)) {
      return [
        { name: 'Ações', value: 45, color: '#ff7043' },
        { name: 'Imóveis', value: 15, color: '#F59E0B' },
        { name: 'Cripto', value: 10, color: '#8B5CF6' },
        { name: 'Dinheiro', value: 10, color: '#6B7280' },
      ];
    }

    const categoryTotals = investments.reduce((acc, investment) => {
      const value = parseFloat(investment.value.replace('R$', '').replace('.', '').replace(',', '.'));
      acc[investment.category] = (acc[investment.category] || 0) + value;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);
    
    // Se não há investimentos, mostra dados padrão
    if (total === 0) {
      return [
        { name: 'Ações', value: 45, color: '#ff7043' },
        { name: 'Imóveis', value: 15, color: '#F59E0B' },
        { name: 'Cripto', value: 10, color: '#8B5CF6' },
        { name: 'Dinheiro', value: 10, color: '#6B7280' },
      ];
    }

    const colors = {
      'Ações': '#ff7043',
      'Imóveis': '#F59E0B',
      'Cripto': '#8B5CF6',
      'Dinheiro': '#6B7280',
    };

    return Object.entries(categoryTotals).map(([category, value]) => ({
      name: category,
      value: Math.round((value / total) * 100),
      color: colors[category as keyof typeof colors] || '#6B7280'
    }));
  }, [investments]);

  // Dados simulados para cada categoria quando clicada
  const investmentDetails = useMemo(() => {
    const details: Record<string, any[]> = {};
    
    // Verifica se investments existe antes de iterar
    if (investments && Array.isArray(investments)) {
      investments.forEach(investment => {
        if (!details[investment.category]) {
          details[investment.category] = [];
        }
        
        details[investment.category].push({
          id: investment.id,
          name: investment.name,
          symbol: investment.symbol,
          value: investment.value,
          percentage: '20%', // Calculado dinamicamente se necessário
          change: investment.change,
          positive: investment.positive
        });
      });
    }

    // Adiciona dados padrão para categorias sem investimentos

    if (!details['Imóveis']) {
      details['Imóveis'] = [
        {
          id: '6',
          name: 'FII Shopping',
          symbol: 'XPML11',
          value: 'R$4.200',
          percentage: '45%',
          change: '+0,95%',
          positive: true
        },
        {
          id: '7',
          name: 'FII Logístico',
          symbol: 'VILG11',
          value: 'R$5.100',
          percentage: '55%',
          change: '+1,25%',
          positive: true
        }
      ];
    }

    if (!details['Dinheiro']) {
      details['Dinheiro'] = [
        {
          id: '10',
          name: 'Conta Corrente',
          symbol: 'CC',
          value: 'R$3.000',
          percentage: '30%',
          change: '0,00%',
          positive: true
        },
        {
          id: '11',
          name: 'Poupança',
          symbol: 'POUP',
          value: 'R$7.000',
          percentage: '70%',
          change: '+0,05%',
          positive: true
        }
      ];
    }

    return details;
  }, [investments]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-blue-600">{payload[0].value}%</p>
          <p className="text-xs text-gray-500 mt-1">Clique para ver detalhes</p>
        </div>
      );
    }
    return null;
  };

  const handlePieClick = (data: any) => {
    console.log('Clicked on:', data.name);
    setSelectedCategory(data.name);
    setDialogOpen(true);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Alocação de Ativos</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              onClick={handlePieClick}
              style={{ cursor: 'pointer' }}
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color }}>{value}: {entry.payload.value}%</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <AllocationDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        investments={investmentDetails[selectedCategory] || []}
      />
    </div>
  );
};

export default AllocationChart;
