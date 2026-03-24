// src/components/SignUpForm.tsx
import {
  Box, TextField, Button, Typography, Grid, styled,
} from '@mui/material';
import { labelStyle, primaryButtonStyle } from '../styles/Form.styles';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { boundActions } from '../app/boundActions';  // ← only import needed

import { selectors } from '@/app/selectors';

// ─── Styled Components ────────────────────────────────────────────────────────

const GridContainer = styled(Grid)({
  marginBottom: '16px',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
});

const FormTextField = styled(TextField)({
  borderRadius: '6px',
});

// ─── Types ────────────────────────────────────────────────────────────────────

type SignUpFormProps = {
  onBackToLogin: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export const SignUpForm = ({ onBackToLogin }: SignUpFormProps) => {
  const loading = useSelector(selectors.auth.isRegisterLoading);
  const error = useSelector(selectors.auth.isError);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) boundActions.auth.clearError();       // ← boundActions.auth.actionName
  }, [error]);

  const onRegister = useCallback(() => {
    boundActions.auth.registerRequest({
      // ← boundActions.auth.actionName
      firstName: form.firstName,
      lastName: form.lastName,
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

      <GridContainer container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" style={labelStyle}>First name</Typography>
          <FormTextField fullWidth name="firstName" placeholder="First Name"
            size="small" value={form.firstName} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" style={labelStyle}>Last name</Typography>
          <FormTextField fullWidth name="lastName" placeholder="Last Name"
            size="small" value={form.lastName} onChange={handleChange} />
        </Grid>
      </GridContainer>

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="body2" style={labelStyle}>Email</Typography>
        <FormTextField fullWidth name="email" type="email"
          placeholder="Enter email address" size="small"
          value={form.email} onChange={handleChange} />
      </Box>

      <Box style={{ marginBottom: '32px' }}>
        <Typography variant="body2" style={labelStyle}>Password</Typography>
        <FormTextField fullWidth name="password" type="password"
          placeholder="Enter Account Password" size="small"
          value={form.password} onChange={handleChange} />
      </Box>

      <Button fullWidth variant="contained" style={primaryButtonStyle}
        onClick={onRegister} disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </Button>

      <Button fullWidth variant="text" onClick={onBackToLogin}
        style={{ marginTop: '16px', color: '#888', textTransform: 'none' }}>
        Already have an account? Sign In
      </Button>
    </Box>
  );
};
