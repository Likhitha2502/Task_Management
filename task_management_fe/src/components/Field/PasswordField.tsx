// src/components/PasswordField.tsx
import { useField } from 'formik';
import { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type PasswordFieldProps = {
  name:        string;
  label?:      string;
  placeholder?: string;
  className?:  string;
};

export const PasswordField = ({ name, placeholder, className }: PasswordFieldProps) => {
  const [field, meta] = useField(name);   // ← connects to Formik by name
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...field}                           // ← value, onChange, onBlur all wired
      fullWidth
      size="small"
      type={visible ? 'text' : 'password'}
      placeholder={placeholder}
      className={className}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setVisible((v) => !v)} edge="end" size="small">
              {visible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};