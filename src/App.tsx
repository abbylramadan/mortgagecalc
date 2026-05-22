import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { WizardLayout } from './components/wizard/WizardLayout';
import { Step1Income } from './components/steps/Step1Income';
import { Step2Metro } from './components/steps/Step2Metro';
import { Step3MonthlyDebts } from './components/steps/Step3MonthlyDebts';
import { Step4FicoScore } from './components/steps/Step4FicoScore';
import { Step5FoodExpenses } from './components/steps/Step5FoodExpenses';
import { Step6EmergencyFund } from './components/steps/Step6EmergencyFund';
import { Step7FunExpenses } from './components/steps/Step7FunExpenses';
import { Step8MonthlySavings } from './components/steps/Step8MonthlySavings';
import { Step8DownPayment as Step9DownPayment } from './components/steps/Step8DownPayment';
import { AffordabilityResults } from './components/results/AffordabilityResults';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/step" element={<WizardLayout />}>
          <Route path="1" element={<Step1Income />} />
          <Route path="2" element={<Step2Metro />} />
          <Route path="3" element={<Step3MonthlyDebts />} />
          <Route path="4" element={<Step4FicoScore />} />
          <Route path="5" element={<Step5FoodExpenses />} />
          <Route path="6" element={<Step6EmergencyFund />} />
          <Route path="7" element={<Step7FunExpenses />} />
          <Route path="8" element={<Step8MonthlySavings />} />
          <Route path="9" element={<Step9DownPayment />} />
        </Route>
        <Route path="/results" element={<AffordabilityResults />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
