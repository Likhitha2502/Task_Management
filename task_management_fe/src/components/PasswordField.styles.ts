import { makeStyles } from 'tss-react/mui';

const CORAL = '#D35F55';

export const usePasswordFieldStyles = makeStyles({ name: 'PasswordField' })({
  wrapper: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#555',
    marginBottom: '6px',
    fontFamily: 'Georgia, serif',
    letterSpacing: '0.02em',
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      '&:hover fieldset': { borderColor: CORAL },
      '&.Mui-focused fieldset': { borderColor: CORAL },
    },
  },
  visibilityButton: {
    color: '#aaa',
  },
});
