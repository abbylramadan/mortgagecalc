# 🏡 Home Affordability Calculator

A modern, TurboTax-style web application that helps users calculate home affordability using **live real estate market data**. Enter any US ZIP code to get real-time median home prices, property tax rates, and personalized affordability recommendations.

## ✨ Features

- **Live Market Data Integration** - Real-time home prices from any US ZIP code
- **TurboTax-Style UX** - One question at a time, smooth animations, clean design
- **9-Step Wizard Flow** - Income, ZIP code, debts, credit score, expenses, down payment, loan type
- **Smart Calculations** - DTI ratios, tax estimates, FICO-based rates, utility forecasting
- **Market Comparison** - See how your budget compares to local median/average home prices
- **Budget Breakdown Charts** - Visual breakdown of monthly budget and payment components
- **Personalized Recommendations** - Context-aware suggestions based on your financial situation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- (Optional) RapidAPI account for live market data

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173/`

## 🔑 API Setup (Optional but Recommended)

To enable **live real estate market data**, you'll need a free RapidAPI key:

### Step 1: Get Your API Key

1. Sign up at [RapidAPI.com](https://rapidapi.com/)
2. Subscribe to [Realty Mole Property API](https://rapidapi.com/realtymole/api/realty-mole-property-api) (free tier available)
3. Copy your API key from the dashboard

### Step 2: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your API key to `.env`:
   ```env
   VITE_RAPIDAPI_KEY=your_api_key_here
   VITE_USE_MOCK_DATA=false
   ```

3. Restart the dev server

### Without API Key

The app works perfectly fine **without an API key** using intelligent mock data based on ZIP code regions. Just keep `VITE_USE_MOCK_DATA=true` in your `.env` file.

## 🎯 How It Works

### Input Steps

1. **Annual Income** - Pretax salary/income
2. **ZIP Code** - Any US ZIP code (fetches live market data)
3. **Monthly Debts** - Car loans, student loans, credit cards, etc.
4. **FICO Score** - Credit score (affects interest rates)
5. **Food Expenses** - Monthly food/groceries budget
6. **Emergency Fund** - Current savings
7. **Fun Expenses** - Discretionary spending
8. **Down Payment** - Amount in dollars
9. **Loan Type** - FHA vs Conventional

### Calculation Logic

The calculator uses industry-standard formulas:

- **DTI Ratios**: Front-end (28%) and back-end (43% FHA / 36% Conventional)
- **Tax Calculations**: Federal + State + FICA deductions
- **Interest Rates**: Based on FICO score and loan type
- **Property Taxes**: Live data from ZIP code lookup
- **Utility Forecasting**: Estimated based on home price → sqft → utility costs
- **Market Comparison**: Real median/average home prices for the area

### Results Page

- **Maximum Home Price** - Based on your full financial profile
- **Market Comparison** - How your budget compares to local prices
- **Monthly Payment Breakdown** - P&I, taxes, insurance, PMI, utilities
- **Budget Breakdown** - How your monthly income is allocated
- **Personalized Recommendations** - FHA vs Conventional suggestions, market insights

## 📊 Market Data Sources

- **Live Data**: RapidAPI → Realty Mole (free tier: 100 requests/month)
- **Fallback**: Regional estimates based on ZIP code prefixes
- **Property Tax Rates**: State-by-state averages
- **Utility Multipliers**: Climate-adjusted regional estimates

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Routing**: React Router v6
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Validation**: Zod
- **Formatting**: Numeral.js

## 📁 Project Structure

```
mortgagecalc/
├── src/
│   ├── components/
│   │   ├── steps/          # 9 wizard steps
│   │   ├── results/        # Results page components
│   │   ├── wizard/         # Wizard framework
│   │   └── ui/             # Reusable UI components
│   ├── services/
│   │   └── marketDataService.ts  # Live API integration
│   ├── data/               # Mock data & configs
│   ├── utils/
│   │   └── calculations/   # Affordability logic
│   ├── store/              # Zustand state management
│   └── types/              # TypeScript definitions
├── .env                    # API configuration (create from .env.example)
└── README.md
```

## 🔒 Privacy & Security

- All calculations happen **client-side** (no data sent to our servers)
- API keys are **never exposed** to the client (Vite env variables)
- ZIP code data is **cached for 24 hours** to minimize API calls
- No personal financial information is stored or transmitted

## 🧪 Testing

Try these scenarios:

1. **High Income** ($200k+) in Denver → Should afford $800k+ homes
2. **Low Budget** ($50k income, $10k down) in Manhattan → Will show realistic market warnings
3. **FHA Candidate** (Low down payment, 620 FICO) → Will recommend FHA over Conventional
4. **Tight DTI** (High debts) → Will warn about qualification challenges

## 🚢 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy the `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- Any static host

**Remember to set your environment variables** in your hosting platform's dashboard.

## 🤝 Contributing

This is a demo/educational project. Feel free to fork and customize for your needs!

## 📄 License

MIT License - Free to use and modify

## 🙏 Acknowledgments

- Market data provided by [RapidAPI](https://rapidapi.com/) & [Realty Mole](https://www.realtymole.com/)
- Property tax rates from public state tax records
- Design inspired by TurboTax's user-friendly wizard flow

---

**Note**: This calculator provides estimates only. Always consult with a licensed mortgage professional before making homebuying decisions.
