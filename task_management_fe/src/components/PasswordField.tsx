import React, { useState } from 'react';
import { InputAdornment, IconButton, TextField, Typography, TextFieldProps } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { usePasswordFieldStyles } from './PasswordField.styles';

interface PasswordFieldProps extends Omit<TextFieldProps, 'type'> {
  label: string;
}

export const PasswordField = ({ label, sx, className, ...props }: PasswordFieldProps) => {
  const { classes, cx } = usePasswordFieldStyles();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.label}>{label}</Typography>
      <TextField
        {...props}
        className={cx(classes.textField, className)}
        sx={sx}
        fullWidth
        size="small"
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                  className={classes.visibilityButton}
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
