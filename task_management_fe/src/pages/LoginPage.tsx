/* eslint-disable react-hooks/set-state-in-effect */
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { LoginForm } from '../components/LoginForm';
import { SignUpForm } from '../components/SignUpForm';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { useLoginPageStyles } from './LoginPage.styles';
import { selectors, boundActions } from '../app/index';
import { ROUTES } from '@/constants';

const LoginPage = () => {
  const { classes } = useLoginPageStyles();
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
    <Box className={classes.pageWrapper}>
      <Paper className={classes.card}>
        <Box className={classes.logoContainer}>
          <Avatar className={classes.logoAvatar}>F</Avatar>
          <Typography variant="h5" className={classes.logoTitleTypography}>
            FocusFlow
          </Typography>
        </Box>

        <Box className={classes.headerContainer}>
          <Typography variant="body1" className={classes.headerAccentTypography}>
            {getHeaderText()}
          </Typography>
          <Box className={classes.divider} />
        </Box>

        {view === 'login' && (
          <LoginForm
            onSignUpClick={() => setView('signup')}
            onForgotClick={() => setView('forgot')}
          />
        )}

        {view === 'signup' && <SignUpForm onBackToLogin={() => setView('login')} />}
        {view === 'forgot' && <ForgotPasswordForm onBackToLogin={() => setView('login')} />}

        <Typography variant="caption" className={classes.footerCaption}>
          Only you can see your tasks. No shared access.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
