import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';

interface BudgetBreakdownChartProps {
  monthlyNetIncome: number;
  housingCosts: number; // Total housing including utilities
  monthlyDebts: number;
  foodExpenses: number;
  funExpenses: number;
  disposableIncome: number;
}

export function BudgetBreakdownChart({
  monthlyNetIncome,
  housingCosts,
  monthlyDebts,
  foodExpenses,
  funExpenses,
  disposableIncome,
}: BudgetBreakdownChartProps) {
  const data = [
    {
      name: 'Housing & Utilities',
      value: housingCosts,
      color: '#3b82f6', // primary blue
    },
    {
      name: 'Debts',
      value: monthlyDebts,
      color: '#ef4444', // red
    },
    {
      name: 'Food & Necessities',
      value: foodExpenses,
      color: '#10b981', // green
    },
    {
      name: 'Fun & Discretionary',
      value: funExpenses,
      color: '#f59e0b', // orange
    },
    {
      name: 'Savings/Disposable',
      value: Math.max(0, disposableIncome),
      color: '#8b5cf6', // purple
    },
  ];

  // Filter out zero values
  const filteredData = data.filter(d => d.value > 0);

  const totalAllocated = housingCosts + monthlyDebts + foodExpenses + funExpenses;
  const percentRemaining = ((monthlyNetIncome - totalAllocated) / monthlyNetIncome) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget Breakdown</CardTitle>
        <p className="text-sm text-neutral-600 mt-1">
          How your after-tax income of {formatCurrency(monthlyNetIncome)}/month will be allocated
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => {
                const percent = entry.percent || 0;
                return `${entry.name}: ${(percent * 100).toFixed(0)}%`;
              }}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => formatCurrency(Number(value || 0))}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredData.map((item) => (
            <div key={item.name} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-xs text-neutral-600">{item.name}</p>
              </div>
              <p className="text-lg font-semibold text-neutral-900">
                {formatCurrency(item.value)}
              </p>
            </div>
          ))}
        </div>

        {disposableIncome < 0 && (
          <div className="mt-6 p-4 bg-error-light rounded-lg">
            <p className="text-sm text-error-dark font-semibold">
              ⚠️ Budget Shortfall: Your expenses exceed your income by{' '}
              {formatCurrency(Math.abs(disposableIncome))}/month
            </p>
          </div>
        )}

        {disposableIncome > 0 && percentRemaining > 20 && (
          <div className="mt-6 p-4 bg-success-light rounded-lg">
            <p className="text-sm text-success-dark font-semibold">
              ✓ Healthy Budget: You'll have {percentRemaining.toFixed(0)}% of your income ({formatCurrency(disposableIncome)}) remaining for savings and unexpected expenses
            </p>
          </div>
        )}

        {disposableIncome > 0 && percentRemaining <= 20 && percentRemaining > 5 && (
          <div className="mt-6 p-4 bg-warning-light rounded-lg">
            <p className="text-sm text-warning-dark font-semibold">
              ⚡ Tight Budget: Only {percentRemaining.toFixed(0)}% of your income remaining. Consider building a larger emergency fund.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
