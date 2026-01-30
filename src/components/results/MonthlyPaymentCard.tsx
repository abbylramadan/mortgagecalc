
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';
import type { MonthlyPayment } from '../../types/calculator';

interface MonthlyPaymentCardProps {
  payment: MonthlyPayment;
}

export function MonthlyPaymentCard({ payment }: MonthlyPaymentCardProps) {
  const paymentItems = [
    { label: 'Principal & Interest', amount: payment.principal + payment.interest, color: 'primary' },
    { label: 'Property Tax', amount: payment.propertyTax, color: 'blue' },
    { label: 'Homeowners Insurance', amount: payment.homeownersInsurance, color: 'green' },
    ...(payment.mortgageInsurance > 0
      ? [{ label: 'Mortgage Insurance', amount: payment.mortgageInsurance, color: 'orange' }]
      : []),
    { label: 'Utilities', amount: payment.utilities.total, color: 'purple' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimated Monthly Housing Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-neutral-700">{item.label}</span>
              <span className="font-semibold text-neutral-900">{formatCurrency(item.amount)}</span>
            </div>
          ))}

          <div className="border-t-2 border-neutral-200 pt-4 mt-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-bold text-neutral-900">Total Monthly Payment</span>
              <span className="font-bold text-primary-600 text-2xl">
                {formatCurrency(payment.total + payment.utilities.total)}
              </span>
            </div>
          </div>

          {/* Utility Breakdown */}
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm font-semibold text-neutral-700 mb-2">Utility Breakdown:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600">
              <div>Electric: {formatCurrency(payment.utilities.electric)}</div>
              <div>Gas: {formatCurrency(payment.utilities.gas)}</div>
              <div>Water: {formatCurrency(payment.utilities.water)}</div>
              <div>Internet: {formatCurrency(payment.utilities.internet)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
