import { makeStyles } from 'tss-react/mui';

export const useLoginFormStyles = makeStyles({ name: 'LoginForm' })({
  form: {
    width: '100%',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: '12px',
    fontSize: '0.85rem',
  },
  fieldGroup: {
    marginBottom: '16px',
  },
  passwordFieldGroup: {
    marginBottom: '8px',
  },
  forgotRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '24px',
  },
  orDivider: {
    textAlign: 'center',
    margin: '8px 0',
    color: '#757575',
  },
  textField: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
    },
  },
});
