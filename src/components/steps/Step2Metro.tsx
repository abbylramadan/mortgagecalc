import { useEffect } from 'react';
import { Card } from '../ui/Card';
import { Select, type SelectOption } from '../ui/Select';
import { useCalculatorStore } from '../../store/calculatorStore';
import { formatPercent, formatCurrency } from '../../utils/formatters';
import { topMetros, getMetroByZip } from '../../data/metros';
import { chicagoNeighborhoods, getNeighborhoodByZip } from '../../data/chicagoNeighborhoods';

export function Step2Metro() {
  const { inputs, updateInput } = useCalculatorStore();

  useEffect(() => {
    const button = document.querySelector('button');
    button?.focus();
  }, []);

  const metroOptions: SelectOption[] = topMetros.map((m) => ({
    value: m.id,
    label: `${m.name}, ${m.state}`,
  }));

  // Determine selected metro from zipCode in the store
  const selectedNeighborhood = getNeighborhoodByZip(inputs.zipCode || '');
  const selectedMetro =
    selectedNeighborhood
      ? topMetros.find((m) => m.id === 'chicago')
      : getMetroByZip(inputs.zipCode || '');

  const handleMetroChange = (metroId: string) => {
    const metro = topMetros.find((m) => m.id === metroId);
    if (!metro) return;
    if (metro.id === 'chicago') {
      // Default to The Loop; user can refine via neighborhood selector
      updateInput('zipCode', '60601');
      updateInput('municipalityId', 'chicago-60601');
    } else {
      updateInput('zipCode', metro.zipCode);
      updateInput('municipalityId', `metro-${metro.id}`);
    }
  };

  const neighborhoodOptions: SelectOption[] = chicagoNeighborhoods.map((n) => ({
    value: n.zipCode,
    label: `${n.name} (${n.zipCode})`,
    group: n.area,
  }));

  const isChicago = selectedMetro?.id === 'chicago';

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Where are you looking to buy?
          </h2>
          <p className="text-neutral-600">
            Pick one of the largest U.S. metros so we can use accurate home prices and property tax rates.
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <Select
            label="Metro area"
            value={selectedMetro?.id || ''}
            onChange={handleMetroChange}
            options={metroOptions}
            placeholder="Select a metro"
            helpText="Top 10 U.S. metros by population"
          />

          {isChicago && (
            <Select
              label="Chicago neighborhood"
              value={inputs.zipCode || ''}
              onChange={(value) => {
                updateInput('zipCode', value);
                updateInput('municipalityId', `chicago-${value}`);
              }}
              options={neighborhoodOptions}
              placeholder="Select a neighborhood"
              helpText="Choose a specific Chicago neighborhood"
            />
          )}

          {selectedNeighborhood && (
            <div className="space-y-3">
              <div className="p-4 bg-success-light rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-success-dark text-xl">✓</span>
                  <p className="text-sm font-semibold text-success-dark">
                    {selectedNeighborhood.name}
                  </p>
                </div>
                <p className="text-xs text-success-dark">
                  {selectedNeighborhood.area} • {selectedNeighborhood.description}
                </p>
              </div>

              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm font-semibold text-primary-900 mb-2">Local Market Snapshot</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-primary-700">Median Price</p>
                    <p className="font-semibold text-primary-900">{formatCurrency(selectedNeighborhood.medianHomePrice)}</p>
                  </div>
                  <div>
                    <p className="text-primary-700">Average Price</p>
                    <p className="font-semibold text-primary-900">{formatCurrency(selectedNeighborhood.avgHomePrice)}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-100 rounded-lg">
                <p className="text-sm text-neutral-700">
                  <span className="font-semibold">Property tax rate: </span>
                  {formatPercent(selectedNeighborhood.propertyTaxRate)}
                </p>
              </div>
            </div>
          )}

          {selectedMetro && !selectedNeighborhood && (
            <div className="space-y-3">
              <div className="p-4 bg-success-light rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-success-dark text-xl">✓</span>
                  <p className="text-sm font-semibold text-success-dark">
                    {selectedMetro.name}, {selectedMetro.state}
                  </p>
                </div>
                <p className="text-xs text-success-dark">{selectedMetro.description}</p>
              </div>

              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm font-semibold text-primary-900 mb-2">Metro Market Snapshot</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-primary-700">Median Price</p>
                    <p className="font-semibold text-primary-900">{formatCurrency(selectedMetro.medianHomePrice)}</p>
                  </div>
                  <div>
                    <p className="text-primary-700">Average Price</p>
                    <p className="font-semibold text-primary-900">{formatCurrency(selectedMetro.avgHomePrice)}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-neutral-100 rounded-lg">
                <p className="text-sm text-neutral-700">
                  <span className="font-semibold">Property tax rate: </span>
                  {formatPercent(selectedMetro.propertyTaxRate)}
                </p>
                <p className="text-xs text-neutral-600 mt-1">
                  On a $300,000 home, that's about ${Math.round(300000 * selectedMetro.propertyTaxRate / 12)}/month
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
