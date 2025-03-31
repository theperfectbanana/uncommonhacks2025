import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme";
import { BudgetProvider } from "./context/BudgetContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <BudgetProvider>
          <App />
        </BudgetProvider>
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
);
