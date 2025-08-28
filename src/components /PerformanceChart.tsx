
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Mês');

  const performanceData = {
    'Semana': [
      { date: '22/12', value: 1200 },
      { date: '23/12', value: 1225 },
      { date: '24/12', value: 1250 },
      { date: '25/12', value: 1275 },
      { date: '26/12', value: 1290 },
      { date: '27/12', value: 1310 },
      { date: '28/12', value: 1275 },
    ],
    'Mês': [
      { date: '5/5', value: 1050 },
      { date: '10/5', value: 1075 },
      { date: '15/5', value: 1125 },
      { date: '20/5', value: 1150 },
      { date: '25/5', value: 1200 },
      { date: '30/5', value: 1275 },
    ],
    'Ano': [
      { date: 'Jan', value: 950 },
      { date: 'Fev', value: 980 },
      { date: 'Mar', value: 1020 },
      { date: 'Abr', value: 1050 },
      { date: 'Mai', value: 1275 },
      { date: 'Jun', value: 1180 },
      { date: 'Jul', value: 1220 },
      { date: 'Ago', value: 1190 },
      { date: 'Set', value: 1250 },
      { date: 'Out', value: 1280 },
      { date: 'Nov', value: 1310 },
      { date: 'Dez', value: 1275 },
    ]
  };

  const tabs = ['Semana', 'Mês', 'Ano'];
  const currentData = performanceData[selectedPeriod as keyof typeof performanceData];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Desempenho do Portfólio</h3>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedPeriod(tab)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              domain={['dataMin - 50', 'dataMax + 50']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 shadow-lg rounded-lg border">
                      <p className="text-gray-600 text-sm">{label}</p>
                      <p className="text-blue-600 font-medium">R${payload[0].value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
