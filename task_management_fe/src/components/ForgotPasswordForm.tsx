import { Box, TextField, Button, Typography } from '@mui/material';
import { labelStyle, primaryButtonStyle, helperTextStyle } from '../styles/Form.styles';

export const ForgotPasswordForm = ({ onBackToLogin }: any) => {
  return (
    <Box component="form" style={{ width: '100%' }}>
      <Box style={{ marginBottom: '24px' }}>
        <Typography variant="body2" style={labelStyle}>Email</Typography>
        <TextField 
          fullWidth 
          placeholder="Enter email address" 
          size="small" 
          InputProps={{ style: { borderRadius: '6px' } }} 
        />
        <Typography style={helperTextStyle}>
          Enter the email address associated with your account to receive a temporary password.
        </Typography>
      </Box>

      <Button fullWidth variant="contained" style={primaryButtonStyle}>
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
