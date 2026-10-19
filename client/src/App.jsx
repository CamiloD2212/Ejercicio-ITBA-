import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { ToastProvider } from './hooks/useToast.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';
import AppRouter from './routes/AppRouter.jsx';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
