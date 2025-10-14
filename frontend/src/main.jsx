import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { FiltersProvider } from "./Components/Context/FiltersContext.jsx";
import "./i18n/i18n.js";
 import { ToastContainer, toast } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <FiltersProvider>
    <ToastContainer />
    <App />
</FiltersProvider>
  </StrictMode>,
)
