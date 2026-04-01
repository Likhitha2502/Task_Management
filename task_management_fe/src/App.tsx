// src/App.tsx
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { selectors } from './app/index';
import { ROUTES } from './constants';
import UserProfilePage from './pages/UserProfilePage';

const theme = createTheme({
  palette: {
    primary: { main: '#D35F55' },
    background: { default: '#ffffff' },
    text: { primary: '#333333', secondary: '#757575' },
  },
  typography: {
    fontFamily: '"Georgia", "serif"',
    button: { textTransform: 'none', fontSize: '1rem' },
  },
});

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoginSuccess = useSelector(selectors.auth.isLoginSuccess);
  return isLoginSuccess
    ? <Navigate to={ROUTES.tasks} replace />
    : <>{children}</>;
};

// Redirect to login if not authenticated
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoginSuccess = useSelector(selectors.auth.isLoginSuccess);
  return isLoginSuccess
    ? <>{children}</>
    : <Navigate to={ROUTES.auth.login} replace />;
};

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Default → redirect to login */}
          <Route path="/" element={<Navigate to={ROUTES.auth.login} replace />} />

          {/* Auth routes — redirect to tasks if already logged in */}
          <Route path={ROUTES.auth.root} element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path={ROUTES.auth.login} element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path={ROUTES.auth.signup} element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path={ROUTES.auth.forgot} element={<PublicRoute><LoginPage /></PublicRoute>} />

          {/* Protected routes — redirect to login if not authenticated */}
          <Route path={ROUTES.tasks} element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path={ROUTES.progress} element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path={ROUTES.userProfile} element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.auth.login} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
