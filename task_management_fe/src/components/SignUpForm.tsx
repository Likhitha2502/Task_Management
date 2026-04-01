// src/components/SignUpForm.tsx
import {
  Box, Button, TextField, Typography, Grid,
} from '@mui/material';
import { useSignUpFormStyles } from './SignUpForm.styles';
import { useCallback, useState } from 'react';
import { equals, isNil } from 'ramda';
import { useSelector } from 'react-redux';
import { boundActions } from '../app/boundActions';  // ← only import needed

import { selectors } from '@/app/selectors';

// ─── Types ────────────────────────────────────────────────────────────────────

type SignUpFormProps = {
  onBackToLogin: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export const SignUpForm = ({ onBackToLogin }: SignUpFormProps) => {
  const { classes } = useSignUpFormStyles();
  const loading = useSelector(selectors.auth.isRegisterLoading, equals);
  const error = useSelector(selectors.auth.isError, equals);

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
    <Box component="form" className={classes.form}>
      {!isNil(error) && (
        <Typography variant="body2" className={classes.errorText}>
          {error as string}
        </Typography>
      )}

      <Grid container spacing={2} className={classes.nameRow}>
        <Grid size={6}>
          <Typography variant="body2" className={classes.label}>First name</Typography>
          <TextField fullWidth className={classes.textField} name="firstName" placeholder="First Name"
            size="small" value={form.firstName} onChange={handleChange} />
        </Grid>
        <Grid size={6}>
          <Typography variant="body2" className={classes.label}>Last name</Typography>
          <TextField fullWidth className={classes.textField} name="lastName" placeholder="Last Name"
            size="small" value={form.lastName} onChange={handleChange} />
        </Grid>
      </Grid>

      <Box className={classes.emailField}>
        <Typography variant="body2" className={classes.label}>Email</Typography>
        <TextField fullWidth className={classes.textField} name="email" type="email"
          placeholder="Enter email address" size="small"
          value={form.email} onChange={handleChange} />
      </Box>

      <Box className={classes.passwordField}>
        <Typography variant="body2" className={classes.label}>Password</Typography>
        <TextField fullWidth className={classes.textField} name="password" type="password"
          placeholder="Enter Account Password" size="small"
          value={form.password} onChange={handleChange} />
      </Box>

      <Button fullWidth variant="contained" className={classes.primaryButton}
        onClick={onRegister} disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </Button>

      <Button fullWidth variant="text" onClick={onBackToLogin}
        className={classes.secondaryLink}>
        Already have an account? Sign In
      </Button>
    </Box>
  );
};
