import { Box, TextField, Button, Typography } from '@mui/material';
import { labelStyle, primaryButtonStyle, forgotPasswordBtnStyle } from '../pages/LoginPage.styles';

export const LoginForm = ({ onSignUpClick, onForgotClick }: any) => {
  return (
    <Box component="form" style={{ width: '100%' }}>
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="body2" style={labelStyle}>Email</Typography>
        <TextField 
          fullWidth 
          placeholder="Enter email address" 
          size="small"
          InputProps={{ style: { borderRadius: '6px' } }}
        />
      </Box>

      <Box style={{ marginBottom: '8px' }}>
        <Typography variant="body2" style={labelStyle}>Password</Typography>
        <TextField 
          fullWidth 
          type="password"
          placeholder="Enter Account Password" 
          size="small"
          InputProps={{ style: { borderRadius: '6px' } }}
        />
      </Box>

      <Box style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <Button variant="text" onClick={onForgotClick} style={forgotPasswordBtnStyle}>
          Forgot Password?
        </Button>
      </Box>

      <Button fullWidth variant="contained" style={primaryButtonStyle}>
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
