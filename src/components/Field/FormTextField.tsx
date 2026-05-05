import { TextField } from '@mui/material';
import { useField } from 'formik';

export const FormTextField = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const [field, meta] = useField(name);
  return (
    <TextField
      {...field}        // ← spreads value, onChange, onBlur onto the input
      {...props}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
    />
  );
};