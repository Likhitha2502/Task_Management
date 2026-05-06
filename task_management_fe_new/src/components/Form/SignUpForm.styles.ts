import { makeStyles } from 'tss-react/mui';

export const useSignUpFormStyles = makeStyles({ name: 'SignUpForm' })({
  form: {
    width: '100%',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: '12px',
    fontSize: '0.85rem',
  },
  nameRow: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '12px',
  },
  emailField: {
    marginBottom: '16px',
  },
  passwordField: {
    marginBottom: '32px',
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
  primaryButton: {
    backgroundColor: '#D35F55',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'none',
  },
  secondaryLink: {
    marginTop: '16px',
    color: '#888',
    textTransform: 'none',
    fontFamily: 'Georgia, serif',
  },
});
