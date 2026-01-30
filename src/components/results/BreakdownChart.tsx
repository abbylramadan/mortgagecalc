import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import type { MonthlyPayment } from '../../types/calculator';

interface BreakdownChartProps {
  payment: MonthlyPayment;
}

export function BreakdownChart({ payment }: BreakdownChartProps) {
  const data = [
    {
      name: 'Principal & Interest',
      value: payment.principal + payment.interest,
      color: '#3b82f6',
    },
    { name: 'Property Tax', value: payment.propertyTax, color: '#06b6d4' },
    { name: 'Homeowners Insurance', value: payment.homeownersInsurance, color: '#10b981' },
    ...(payment.mortgageInsurance > 0
      ? [{ name: 'Mortgage Insurance', value: payment.mortgageInsurance, color: '#f59e0b' }]
      : []),
    { name: 'Utilities', value: payment.utilities.total, color: '#8b5cf6' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => {
                const percent = entry.percent || 0;
                return `${entry.name}: ${(percent * 100).toFixed(0)}%`;
              }}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => `$${Number(value || 0).toFixed(0)}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
