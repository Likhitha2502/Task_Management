// src/components/LoginForm.tsx
import { Box, TextField, Button, Typography, styled } from '@mui/material';
import { labelStyle, primaryButtonStyle, forgotPasswordBtnStyle } from '../pages/LoginPage.styles';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { boundActions, selectors } from '../app/index';
import { PasswordField } from './PasswordField';

const FormTextField = styled(TextField)({
  borderRadius: '6px',
});

type LoginFormProps = {
  onSignUpClick: () => void;
  onForgotClick: () => void;
};

export const LoginForm = ({ onSignUpClick, onForgotClick }: LoginFormProps) => {
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
    <Box component="form" style={{ width: '100%' }}>
      {error && (
        <Typography variant="body2" style={{ color: '#d32f2f', marginBottom: '12px', fontSize: '0.85rem' }}>
          {error}
        </Typography>
      )}

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="body2" style={labelStyle}>Email</Typography>
        <FormTextField
          fullWidth
          name="email"
          type="email"
          placeholder="Enter email address"
          size="small"
          value={form.email}
          onChange={handleChange}
        />
      </Box>

      <Box style={{ marginBottom: '8px' }}>
        {/* <Typography variant="body2" style={labelStyle}>Password</Typography> */}
        {/* <FormTextField
          fullWidth
          name="password"
          type="password"
          placeholder="Enter Account Password"
          size="small"
          value={form.password}
          onChange={handleChange}
        /> */}
        <PasswordField
          name="password"
          label="Password"
          placeholder="Enter Account Password"
          value={form.password}
          onChange={handleChange}
        />
      </Box>

      <Box style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <Button variant="text" onClick={onForgotClick} style={forgotPasswordBtnStyle}>
          Forgot Password?
        </Button>
      </Box>

      <Button
        fullWidth
        variant="contained"
        style={primaryButtonStyle}
        onClick={onLogin}
      >
        Sign in to my workspace
      </Button>

      <Typography style={{ textAlign: 'center', margin: '8px 0', color: '#757575' }}>or</Typography>

      <Button
        fullWidth
        variant="contained"
        onClick={onSignUpClick}
        style={{ ...primaryButtonStyle, marginBottom: 0 }}
      >
        Create an account
      </Button>
    </Box>
  );
};
