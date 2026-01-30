
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
      title: 'Smart Affordability',
      description: 'Calculate exactly how much home you can afford based on your full financial picture',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Location-Based Estimates',
      description: 'Get accurate property tax and utility cost estimates for your desired area',
    },
    {
      icon: ChartBarIcon,
      title: 'Personalized Insights',
      description: 'Receive tailored recommendations and see detailed payment breakdowns',
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
            Find Your Perfect Home Budget
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
            A modern, TurboTax-style calculator that considers your income, debts, location, and
            lifestyle to determine what you can truly afford.
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
                        One question at a time - income, location, debts, credit score, expenses,
                        savings, and down payment
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900">Get Your Results</p>
                      <p className="text-sm text-neutral-600">
                        See your maximum affordable home price, monthly payments, and utility
                        estimates
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900">Make Informed Decisions</p>
                      <p className="text-sm text-neutral-600">
                        Review personalized recommendations and adjust your inputs to explore
                        different scenarios
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
            This calculator uses mock data for demonstration purposes. Results should be used as
            estimates only.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
