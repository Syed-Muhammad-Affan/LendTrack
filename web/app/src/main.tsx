import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./providers/AuthProvider";
import { AppProvider } from "./providers/AppProvider";
import { getInitialTheme, setTheme } from "./lib/theme";
import { DataRefreshProvider } from "./providers/DataResfreshProvider";
setTheme(getInitialTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <DataRefreshProvider>
            <App />
          </DataRefreshProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
