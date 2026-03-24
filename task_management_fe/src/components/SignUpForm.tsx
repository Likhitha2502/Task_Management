import { Box, TextField, Button, Typography, Grid, withStyles } from '@mui/material';
import { labelStyle, primaryButtonStyle } from '../styles/Form.styles';

const GridContainer = withStyles(() => ({
  root: {
    marginBottom: '16px', display: 'flex', flexDirection: 'row',
    flexWrap: 'nowrap'
  }
}));

export const SignUpForm = ({ onBackToLogin }: any) => {
  return (
    <Box component="form" style={{ width: '100%' }}>
      <GridContainer spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" style={labelStyle}>First name</Typography>
          <TextField
            fullWidth
            placeholder="First Name"
            size="small"
            InputProps={{ style: { borderRadius: '6px' } }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" style={labelStyle}>Last name</Typography>
          <TextField
            fullWidth
            placeholder="Last Name"
            size="small"
            InputProps={{ style: { borderRadius: '6px' } }}
          />
        </Grid>
      </GridContainer>

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="body2" style={labelStyle}>Email</Typography>
        <TextField
          fullWidth
          placeholder="Enter email address"
          size="small"
          InputProps={{ style: { borderRadius: '6px' } }}
        />
      </Box>

      <Box style={{ marginBottom: '32px' }}>
        <Typography variant="body2" style={labelStyle}>Password</Typography>
        <TextField
          fullWidth
          type="password"
          placeholder="Enter Account Password"
          size="small"
          InputProps={{ style: { borderRadius: '6px' } }}
        />
      </Box>

      <Button fullWidth variant="contained" style={primaryButtonStyle}>
        Sign Up
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={onBackToLogin}
        style={{ marginTop: '16px', color: '#888', textTransform: 'none' }}
      >
        Already have an account? Sign In
      </Button>
    </Box>
  );
};
