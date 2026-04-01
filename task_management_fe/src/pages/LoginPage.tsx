/* eslint-disable react-hooks/set-state-in-effect */
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { LoginForm } from '../components/LoginForm';
import { SignUpForm } from '../components/SignUpForm';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import {
  pageWrapperStyle, cardStyle, logoContainerStyle,
  headerContainerStyle, dividerStyle
} from './LoginPage.styles';
import { selectors, boundActions } from '../app/index';
import { ROUTES } from '@/constants';

const LoginPage = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const navigate = useNavigate();
  const registrationSuccess = useSelector(selectors.auth.registrationSuccess);
  const isLoginSuccess = useSelector(selectors.auth.isLoginSuccess);

  // Auto-switch to login view after successful registration
  useEffect(() => {
    if (registrationSuccess) {
      boundActions.auth.clearError();
      setView('login');
    }
  }, [registrationSuccess]);

  // Navigate to dashboard/app after successful login
  useEffect(() => {
    if (isLoginSuccess) {
      navigate(ROUTES.tasks);
    }
  }, [isLoginSuccess, navigate]);

  const getHeaderText = () => {
    if (view === 'login') return 'Sign in';
    if (view === 'signup') return 'Create Account';
    return 'Reset Password';
  };

  return (
    <Box style={pageWrapperStyle}>
      <Paper style={cardStyle}>
        <Box style={logoContainerStyle}>
          <Avatar style={{ backgroundColor: '#D35F55', borderRadius: '12px', marginRight: '12px' }}>F</Avatar>
          <Typography variant="h5" style={{ fontWeight: 600, fontFamily: 'Georgia, serif' }}>FocusFlow</Typography>
        </Box>

        <Box style={headerContainerStyle}>
          <Typography variant="body1" style={{ color: '#D35F55', fontWeight: 'bold' }}>
            {getHeaderText()}
          </Typography>
          <Box style={dividerStyle} />
        </Box>

        {view === 'login' && (
          <LoginForm
            onSignUpClick={() => setView('signup')}
            onForgotClick={() => setView('forgot')}
          />
        )}

        {view === 'signup' && <SignUpForm onBackToLogin={() => setView('login')} />}
        {view === 'forgot' && <ForgotPasswordForm onBackToLogin={() => setView('login')} />}

        <Typography variant="caption" style={{ marginTop: '32px', color: '#757575', textAlign: 'center' }}>
          Only you can see your tasks. No shared access.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
