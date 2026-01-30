import { useEffect } from 'react';
import { Card } from '../ui/Card';
import { Select, type SelectOption } from '../ui/Select';
import { useCalculatorStore } from '../../store/calculatorStore';
import { municipalities } from '../../data/municipalities';
import { formatPercent } from '../../utils/formatters';

export function Step2Municipality() {
  const { inputs, updateInput } = useCalculatorStore();

  useEffect(() => {
    // Auto-focus select on mount
    const button = document.querySelector('button');
    button?.focus();
  }, []);

  // Create options grouped by state
  const options: SelectOption[] = municipalities.map((m) => ({
    value: m.id,
    label: `${m.name}, ${m.state}`,
    group: m.state,
  }));

  const selectedMunicipality = municipalities.find((m) => m.id === inputs.municipalityId);

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Where do you want to buy?
          </h2>
          <p className="text-neutral-600">
            Property taxes vary significantly by location. We'll factor this into your affordability
            calculation.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Select
            value={inputs.municipalityId || ''}
            onChange={(value) => updateInput('municipalityId', value)}
            options={options}
            placeholder="Select a city"
            helpText="Choose the city where you plan to purchase your home"
          />

          {selectedMunicipality && (
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-900">
                  <span className="font-semibold">Property tax rate: </span>
                  {formatPercent(selectedMunicipality.propertyTaxRate)}
                </p>
                <p className="text-xs text-primary-700 mt-1">
                  On a $300,000 home, that's about ${Math.round(300000 * selectedMunicipality.propertyTaxRate / 12)}/month
                </p>
              </div>

              <div className="p-4 bg-neutral-100 rounded-lg">
                <p className="text-sm text-neutral-700">
                  <span className="font-semibold">Region: </span>
                  {selectedMunicipality.region.charAt(0).toUpperCase() + selectedMunicipality.region.slice(1)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
