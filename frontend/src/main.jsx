import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { FiltersProvider } from "./Components/Context/FiltersContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <FiltersProvider>
    <App />
</FiltersProvider>
  </StrictMode>,
)
