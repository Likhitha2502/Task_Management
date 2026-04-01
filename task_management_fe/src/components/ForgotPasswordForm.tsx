import { Box, TextField, Button, Typography, styled } from '@mui/material';
import { labelStyle, primaryButtonStyle, helperTextStyle } from '../styles/Form.styles';
import { useCallback, useState } from 'react';
import { boundActions } from '../app/index';

const FormTextField = styled(TextField)({
  borderRadius: '6px',
});

export const ForgotPasswordForm = ({ onBackToLogin }: any) => {
  const [form, setForm] = useState({ email: '' });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));     // ← boundActions.auth.actionName
  }, []);

  const onSendEmail = useCallback(() => {
    boundActions.auth.forgotPasswordRequest({
      email: form.email,
    })
  }, [form]);
  return (
    <Box component="form" style={{ width: '100%' }}>
      <Box style={{ marginBottom: '24px' }}>
        <Typography variant="body2" style={labelStyle}>Email</Typography>
        <FormTextField
          fullWidth
          name="email"
          placeholder="Enter email address"
          size="small"
          value={form.email}
          onChange={handleChange}
        />
        <Typography style={helperTextStyle}>
          Enter the email address associated with your account to receive a temporary password.
        </Typography>
      </Box>

      <Button fullWidth variant="contained" style={primaryButtonStyle} onClick={onSendEmail}>
        Send Email
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={onBackToLogin}
        style={{ marginTop: '16px', color: '#888', textTransform: 'none' }}
      >
        Back to Sign In
      </Button>
    </Box>
  );
};
