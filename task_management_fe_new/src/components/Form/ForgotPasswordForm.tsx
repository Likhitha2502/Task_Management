import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, Button, TextField, Typography } from '@mui/material';

import { boundActions } from '../../app/index';
import { selectors } from '../../app/selectors';
import { useForgotPasswordFormStyles } from './ForgotPasswordForm.styles';

export const ForgotPasswordForm = ({ onBackToLogin }: any) => {
  const { classes } = useForgotPasswordFormStyles();
  const error = useSelector(selectors.auth.isError);
  const [form, setForm] = useState({ email: '' });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) boundActions.auth.clearError();
  }, [error]);

  const onSendEmail = useCallback(() => {
    boundActions.auth.forgotPasswordRequest({
      email: form.email,
    });
  }, [form]);
  return (
    <Box component="form" className={classes.form}>
      {error && (
        <Typography variant="body2" className={classes.errorText}>
          {error as string}
        </Typography>
      )}

      <Box className={classes.emailSection}>
        <Typography variant="body2" className={classes.label}>Email</Typography>
        <TextField
          fullWidth
          className={classes.textField}
          name="email"
          placeholder="Enter email address"
          size="small"
          value={form.email}
          onChange={handleChange}
        />
        <Typography className={classes.helperText}>
          Enter the email address associated with your account to receive a temporary password.
        </Typography>
      </Box>

      <Button fullWidth variant="contained" className={classes.primaryButton} onClick={onSendEmail}>
        Send Email
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={onBackToLogin}
        className={classes.secondaryButton}
      >
        Back to Sign In
      </Button>
    </Box>
  );
};
