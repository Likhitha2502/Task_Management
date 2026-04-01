import React, { useState } from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Typography, 
  styled,
  TextFieldProps 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// --- Styled Components ---
const CORAL = '#D35F55';

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontFamily: 'Georgia, serif',
    fontSize: '14px',
    '&:hover fieldset': { borderColor: CORAL },
    '&.Mui-focused fieldset': { borderColor: CORAL },
  },
});

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#555',
  marginBottom: '6px',
  fontFamily: 'Georgia, serif',
  letterSpacing: '0.02em',
};

// --- Props Type ---
interface PasswordFieldProps extends Omit<TextFieldProps, 'type'> {
  label: string;
}

export const PasswordField = ({ label, sx, ...props }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ marginBottom: '20px' }}>
      <Typography style={labelStyle}>{label}</Typography>
      <StyledTextField
        {...props}
        fullWidth
        size="small"
        type={showPassword ? 'text' : 'password'}
        // Modern MUI v6 slotProps
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                  sx={{ color: '#aaa' }}
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
};
