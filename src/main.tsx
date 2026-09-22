
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import App from "./App.tsx";
import { Footer } from "./components/shared/Footer.tsx";
import { UniversalNavBar } from "./components/shared/UniversalNav.tsx";

import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Provider store={store}>
          <AuthProvider>
            <UniversalNavBar />

            <App />

            <Footer />
          </AuthProvider>
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

