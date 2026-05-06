import { useState } from 'react';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment,TextField } from '@mui/material';

type PasswordInputProps = {
  name:         string;
  label?:       string;
  placeholder?: string;
  className?:   string;
  value?:       string;
  onChange?:    (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?:       boolean;
  helperText?:  string;
};

export const PasswordInput = ({
  name,
  placeholder,
  className,
  value,
  onChange,
  error,
  helperText,
}: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      size="small"
      type={visible ? 'text' : 'password'}
      placeholder={placeholder}
      className={className}
      error={error}
      helperText={helperText}
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
