import { makeStyles } from 'tss-react/mui';

export const useForgotPasswordFormStyles = makeStyles({ name: 'ForgotPasswordForm' })({
  form: {
    width: '100%',
  },
  emailSection: {
    marginBottom: '24px',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '4px',
    fontFamily: 'Georgia, serif',
    fontSize: '14px',
    color: '#333',
  },
  textField: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
    },
  },
  helperText: {
    display: 'block',
    marginTop: '12px',
    color: '#666',
    fontSize: '12px',
    lineHeight: '1.4',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#D35F55',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'none',
  },
  secondaryButton: {
    marginTop: '16px',
    color: '#888',
    textTransform: 'none',
  },
});
