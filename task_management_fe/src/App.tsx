// src/App.tsx
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { selectors } from './app/index';

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

function App() {
  const loginSuccess = useSelector(selectors.auth.isLoginSuccess);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loginSuccess ? <DashboardPage /> : <LoginPage />}
    </ThemeProvider>
  );
}

export default App;
