
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { HomeIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: HomeIcon,
      title: 'Real Property Listings',
      description: 'See actual homes within your budget - not just numbers, but real places you can buy',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Metro-Specific Data',
      description: 'Accurate property taxes and home prices for the top 10 U.S. metros',
    },
    {
      icon: ChartBarIcon,
      title: 'Smart Budget Analysis',
      description: 'See if housing costs are healthy for your income with clear warnings and recommendations',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-neutral-900 mb-6">
            Find Your Perfect Home
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            A smart home affordability calculator for buyers in the largest U.S. metros. Get your budget,
            see real properties, and make informed decisions about where you can afford to live.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/step/1')}
            className="text-xl px-12 py-5"
          >
            Get Started
          </Button>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
            >
              <Card hover>
                <CardContent className="text-center py-8">
                  <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="py-8">
                <ol className="text-left space-y-4">
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900">Answer 9 Simple Questions</p>
                      <p className="text-sm text-neutral-600">
                        Income, metro area, debts, credit score, expenses, savings, and down payment - one at a time
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900">See Real Homes You Can Buy</p>
                      <p className="text-sm text-neutral-600">
                        Browse actual properties within your budget with prices, photos, and details
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900">Get Budget Health Warnings</p>
                      <p className="text-sm text-neutral-600">
                        Clear alerts if housing costs are too high, plus personalized financial recommendations
                      </p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          <Button
            size="lg"
            onClick={() => navigate('/step/1')}
            className="mt-12 text-xl px-12 py-5"
          >
            Start Calculating
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-center text-sm text-neutral-500"
        >
          <p>
            Covers the top 10 U.S. metros. Property recommendations show real listings when live data is enabled.
            Results should be used as estimates only - always consult with a mortgage professional.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
