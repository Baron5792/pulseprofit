import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';  // boostrap
import 'bootstrap-icons/font/bootstrap-icons.css';  // boostrap icons
import 'react-toastify/dist/ReactToastify.css'; // react-toastify
import { CsrfTokenProvider } from './component/middleware/Csrf-token.jsx';
import { UserProvider } from './component/middleware/Authentication.jsx';
import "flag-icons/css/flag-icons.min.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <CsrfTokenProvider>
            <UserProvider>
                <App />
            </UserProvider>
          </CsrfTokenProvider>
      </BrowserRouter>
  </StrictMode>
)
