import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { fetchPropertyListings, type PropertyListing } from '../../services/marketDataService';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface PropertyRecommendationsProps {
  zipCode: string;
  maxPrice: number;
}

export function PropertyRecommendations({ zipCode, maxPrice }: PropertyRecommendationsProps) {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch listings in budget (slightly below max to ensure comfortable fit)
        const minPrice = Math.max(0, maxPrice * 0.7);
        const results = await fetchPropertyListings(zipCode, maxPrice, minPrice);
        setListings(results);
      } catch (err) {
        setError('Unable to load property listings');
        console.error('Error loading listings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [zipCode, maxPrice]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-sm text-neutral-600">Finding properties in your budget...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || listings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-neutral-600 mb-2">No listings found in this price range</p>
            <p className="text-xs text-neutral-500">
              {import.meta.env.VITE_USE_MOCK_DATA === 'true'
                ? 'Mock data mode - showing sample properties'
                : 'Try expanding your search or checking back later'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isMockData ? 'Sample Properties in Your Price Range' : 'Homes Within Your Budget'}
        </CardTitle>
        <p className="text-sm text-neutral-600 mt-1">
          {isMockData
            ? 'These are example properties to show what you could afford. Enable live data to see actual listings.'
            : `${listings.length} propert${listings.length === 1 ? 'y' : 'ies'} currently available in your price range`
          }
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {listings.map((listing, index) => (
            <div
              key={listing.id}
              className="p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-neutral-900 text-lg">
                    {formatCurrency(listing.price)}
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">{listing.address}</p>
                  <p className="text-xs text-neutral-500">
                    {listing.city}, {listing.state} {listing.zipCode}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isMockData && (
                    <span className="px-2 py-1 bg-neutral-200 text-neutral-700 text-xs font-semibold rounded">
                      Sample
                    </span>
                  )}
                  {!isMockData && index === 0 && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded">
                      Top Pick
                    </span>
                  )}
                  {!isMockData && listing.price <= maxPrice * 0.8 && (
                    <span className="px-2 py-1 bg-success-light text-success-dark text-xs font-semibold rounded">
                      Great Value
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3">
                <div className="text-center p-2 bg-neutral-50 rounded">
                  <p className="text-xs text-neutral-600">Beds</p>
                  <p className="font-semibold text-neutral-900">{listing.bedrooms || 'N/A'}</p>
                </div>
                <div className="text-center p-2 bg-neutral-50 rounded">
                  <p className="text-xs text-neutral-600">Baths</p>
                  <p className="font-semibold text-neutral-900">{listing.bathrooms || 'N/A'}</p>
                </div>
                <div className="text-center p-2 bg-neutral-50 rounded">
                  <p className="text-xs text-neutral-600">Sqft</p>
                  <p className="font-semibold text-neutral-900">
                    {listing.squareFeet ? formatNumber(listing.squareFeet) : 'N/A'}
                  </p>
                </div>
                <div className="text-center p-2 bg-neutral-50 rounded">
                  <p className="text-xs text-neutral-600">Type</p>
                  <p className="font-semibold text-neutral-900 text-xs truncate">
                    {listing.propertyType}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500">
                <div className="flex gap-4">
                  {listing.yearBuilt && <span>Built: {listing.yearBuilt}</span>}
                  {listing.daysOnMarket && <span>{listing.daysOnMarket} days on market</span>}
                </div>
                {listing.listingUrl && (
                  <a
                    href={listing.listingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Listing →
                  </a>
                )}
              </div>

              {listing.squareFeet && (
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-600">
                    <span className="font-semibold">Price per sqft:</span>{' '}
                    ${Math.round(listing.price / listing.squareFeet)}/sqft
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {isMockData ? (
          <div className="mt-6 p-4 bg-neutral-100 rounded-lg border border-neutral-300">
            <p className="text-sm text-neutral-700 mb-2">
              <span className="font-semibold">⚠️ These are sample properties</span> - not real listings
            </p>
            <p className="text-xs text-neutral-600">
              To see actual homes for sale with real addresses, prices, and listing links,
              configure the RapidAPI key in your .env file. See README.md for instructions.
            </p>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-900">
              💡 <span className="font-semibold">Pro tip:</span> These are real properties currently on the market.
              Consider homes in the lower end of your range to maintain a healthy financial cushion.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
