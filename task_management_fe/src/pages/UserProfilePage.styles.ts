import type { SxProps, Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

const CORAL = '#D35F55';
const CORAL_LIGHT = '#fdf1f0';

export const useUserProfileStyles = makeStyles({ name: 'UserProfile' })({
  root: {
    minHeight: '100vh',
    backgroundColor: '#f7f7f5',
    fontFamily: 'Georgia, serif',
  },

  header: {
    height: 56,
    backgroundColor: '#fff',
    borderBottom: '1px solid #ebebeb',
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    gap: '12px',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    color: '#555',
    border: '1px solid #ebebeb',
    borderRadius: '8px',
    padding: '6px 14px',
    fontFamily: 'Georgia, serif',
    fontSize: '13px',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  headerTitle: {
    fontFamily: 'Georgia, serif',
    fontWeight: 700,
    fontSize: '17px',
    color: '#1a1a1a',
  },
  headerDivider: {
    margin: '12px 4px',
  },

  content: {
    maxWidth: 900,
    margin: '40px auto',
    padding: '0 24px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'start',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    border: '1px solid #ebebeb',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  },
  cardTitle: {
    fontFamily: 'Georgia, serif',
    fontWeight: 700,
    fontSize: '16px',
    color: '#1a1a1a',
    marginBottom: '6px',
  },
  cardSubtitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '12px',
    color: '#999',
    marginBottom: '28px',
  },

  avatarWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '28px',
    position: 'relative' as const,
    width: 'fit-content',
    margin: '0 auto 28px',
  },
  avatarLarge: {
    width: 88,
    height: 88,
    backgroundColor: CORAL,
    fontSize: '28px',
    fontWeight: 700,
    fontFamily: 'Georgia, serif',
  },
  cameraBtn: {
    position: 'absolute' as const,
    bottom: 0,
    right: -4,
    width: 28,
    height: 28,
    backgroundColor: '#fff',
    border: `2px solid ${CORAL}`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  },

  hiddenFileInput: {
    display: 'none',
  },

  fieldLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#555',
    marginBottom: '6px',
    fontFamily: 'Georgia, serif',
    letterSpacing: '0.02em',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  fieldBox: {
    marginBottom: '16px',
  },

  passwordCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    border: '1px solid #ebebeb',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  },
  passwordIcon: {
    width: 48,
    height: 48,
    backgroundColor: CORAL_LIGHT,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    fontSize: '22px',
  },
  passwordHint: {
    fontSize: '13px',
    color: '#999',
    fontFamily: 'Georgia, serif',
    lineHeight: 1.6,
    marginBottom: '28px',
  },

  saveRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  saveBtnProgress: {
    color: '#fff',
  },

  saveBtn: {
    backgroundColor: CORAL,
    color: '#fff',
    borderRadius: '8px',
    textTransform: 'none' as const,
    fontFamily: 'Georgia, serif',
    fontWeight: 600,
    fontSize: '14px',
    padding: '9px 24px',
    '&:hover': { backgroundColor: '#c0544a' },
  },
  changePasswordBtn: {
    borderColor: CORAL,
    color: CORAL,
    borderRadius: '8px',
    textTransform: 'none' as const,
    fontFamily: 'Georgia, serif',
    fontWeight: 600,
    fontSize: '14px',
    padding: '9px 24px',
    width: '100%',
    '&:hover': { backgroundColor: CORAL_LIGHT },
  },
});

export const fieldSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontFamily: 'Georgia, serif',
    fontSize: '14px',
    '&:hover fieldset': { borderColor: CORAL },
    '&.Mui-focused fieldset': { borderColor: CORAL },
  },
};

export const cameraIconSx: SxProps<Theme> = {
  fontSize: 14,
  color: CORAL,
};
