import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectors } from './app/index';
import { ROUTES } from './constants';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import { jwtService } from './services/jwt';
import { useEffect } from 'react';

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

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoginSuccess = useSelector(selectors.auth.isLoginSuccess);
  const hasAccessToken = !!jwtService.getToken();
  return (isLoginSuccess || hasAccessToken)
    ? <>{children}</>
    : <Navigate to={ROUTES.auth.login} replace />;
};

function AppRoutes() {
  const navigate = useNavigate();
  const isLoggedOut = useSelector(selectors.auth.isLoggedOut);

  // Navigate to login whenever logout completes (manual or forceLogout)
  useEffect(() => {
    if (isLoggedOut) navigate(ROUTES.auth.login, { replace: true });
  }, [isLoggedOut, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.auth.login} replace />} />

      {/* Auth */}
      <Route path={ROUTES.auth.root} element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path={ROUTES.auth.login} element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path={ROUTES.auth.signup} element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path={ROUTES.auth.forgot} element={<PublicRoute><LoginPage /></PublicRoute>} />

      {/* Protected — view prop tells DashboardPage what to render */}
      <Route path={ROUTES.tasks} element={<PrivateRoute><DashboardPage view="tasks" /></PrivateRoute>} />
      <Route path={ROUTES.progress} element={<PrivateRoute><DashboardPage view="progress" /></PrivateRoute>} />
      <Route path={ROUTES.userProfile} element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />

      <Route path="*" element={<Navigate to={ROUTES.auth.login} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
