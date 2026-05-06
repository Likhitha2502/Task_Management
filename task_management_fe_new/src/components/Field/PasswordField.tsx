// src/components/PasswordField.tsx
import { useField } from 'formik';

import { PasswordInput } from './PasswordInput';

type PasswordFieldProps = {
  name:        string;
  label?:      string;
  placeholder?: string;
  className?:  string;
};

export const PasswordField = ({ name, placeholder, className }: PasswordFieldProps) => {
  const [field, meta] = useField(name);

  return (
    <PasswordInput
      {...field}
      placeholder={placeholder}
      className={className}
      error={meta.touched && !!meta.error}
      helperText={meta.touched ? meta.error : undefined}
    />
  );
};
