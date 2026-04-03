import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectors } from './app/index';
import { ROUTES } from './constants';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
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
          <Route path="/" element={<Navigate to={ROUTES.auth.login} replace />} />

          {/* Auth */}
          <Route path={ROUTES.auth.root}   element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path={ROUTES.auth.login}  element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path={ROUTES.auth.signup} element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path={ROUTES.auth.forgot} element={<PublicRoute><LoginPage /></PublicRoute>} />

          {/* Protected — view prop tells DashboardPage what to render */}
          <Route path={ROUTES.tasks}       element={<PrivateRoute><DashboardPage view="tasks" /></PrivateRoute>} />
          <Route path={ROUTES.progress}    element={<PrivateRoute><DashboardPage view="progress" /></PrivateRoute>} />
          <Route path={ROUTES.userProfile} element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />

          <Route path="*" element={<Navigate to={ROUTES.auth.login} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
