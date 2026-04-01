// src/components/LoginForm.tsx
import { Box, Button, TextField, Typography } from '@mui/material';
import { useLoginPageStyles } from '../pages/LoginPage.styles';
import { useLoginFormStyles } from './LoginForm.styles';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { boundActions, selectors } from '../app/index';
import { PasswordField } from './PasswordField';

type LoginFormProps = {
  onSignUpClick: () => void;
  onForgotClick: () => void;
};

export const LoginForm = ({ onSignUpClick, onForgotClick }: LoginFormProps) => {
  const { classes } = useLoginFormStyles();
  const { classes: pageClasses, cx } = useLoginPageStyles();
  const error = useSelector(selectors.auth.isError);

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) boundActions.auth.clearError();
  }, [error]);

  const onLogin = useCallback(() => {
    boundActions.auth.loginRequest({
      email: form.email,
      password: form.password,
    });
  }, [form]);

  return (
    <Box component="form" className={classes.form}>
      {error && (
        <Typography variant="body2" className={classes.errorText}>
          {error}
        </Typography>
      )}

      <Box className={classes.fieldGroup}>
        <Typography variant="body2" className={pageClasses.label}>Email</Typography>
        <TextField
          fullWidth
          className={classes.textField}
          name="email"
          type="email"
          placeholder="Enter email address"
          size="small"
          value={form.email}
          onChange={handleChange}
        />
      </Box>

      <Box className={classes.passwordFieldGroup}>
        <PasswordField
          name="password"
          label="Password"
          placeholder="Enter Account Password"
          value={form.password}
          onChange={handleChange}
        />
      </Box>

      <Box className={classes.forgotRow}>
        <Button variant="text" onClick={onForgotClick} className={pageClasses.forgotPasswordButton}>
          Forgot Password?
        </Button>
      </Box>

      <Button
        fullWidth
        variant="contained"
        className={pageClasses.primaryButton}
        onClick={onLogin}
      >
        Sign in to my workspace
      </Button>

      <Typography className={classes.orDivider}>or</Typography>

      <Button
        fullWidth
        variant="contained"
        onClick={onSignUpClick}
        className={cx(pageClasses.primaryButton, pageClasses.primaryButtonFlush)}
      >
        Create an account
      </Button>
    </Box>
  );
};
