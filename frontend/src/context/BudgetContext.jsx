import { createContext, useContext, useState } from 'react';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const BUDGET = 5000;
  const [remainingBudget, setRemainingBudget] = useState(BUDGET);

  // Function to deduct from budget
  const deductPurchase = (amount) => {
    setRemainingBudget(prev => Math.max(prev - amount, 0));
  };

  return (
    <BudgetContext.Provider value={{ remainingBudget, deductPurchase }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  return useContext(BudgetContext);
};
