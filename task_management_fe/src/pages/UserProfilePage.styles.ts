import type { SxProps, Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

const CORAL = '#D35F55';
const CORAL_LIGHT = '#fdf1f0';

export const useUserProfileStyles = makeStyles({ name: 'UserProfile' })({
 // ── Page header inside content ─────────────────────────────────────────────
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
  },
  backBtn: {
    color: '#555',
    border: '1px solid #ebebeb',
    borderRadius: '8px',
    padding: '7px 14px',
    fontFamily: 'Georgia, serif',
    fontSize: '13px',
    background: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    '&:hover': { borderColor: '#ccc' },
  },
  pageTitle: {
    fontFamily: 'Georgia, serif',
    fontWeight: 700,
    fontSize: '20px',
    color: '#1a1a1a',
  },

  // ── Two-column grid ────────────────────────────────────────────────────────
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    alignItems: 'start',
    '@media (max-width: 1100px)': {
      gridTemplateColumns: '1fr',
    },
  },

  // ── Cards ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    border: '1px solid #ebebeb',
    padding: '32px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    '@media (max-width: 600px)': {
      padding: '20px 16px',
    },
  },
  cardTitle: {
    fontFamily: 'Georgia, serif',
    fontWeight: 700,
    fontSize: '16px',
    color: '#1a1a1a',
    marginBottom: '4px',
    textAlign: 'center' as const,
  },
  cardSubtitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '12px',
    color: '#999',
    marginBottom: '24px',
    textAlign: 'center' as const,
  },

  // ── Avatar ─────────────────────────────────────────────────────────────────
  avatarWrapper: {
    position: 'relative' as const,
    width: 'fit-content',
    margin: '0 auto 24px',
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

  // ── Fields ─────────────────────────────────────────────────────────────────
  fieldLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#555',
    marginBottom: '6px',
    fontFamily: 'Georgia, serif',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
    marginBottom: '16px',
    '@media (max-width: 700px)': {
      gridTemplateColumns: '1fr',
    },
  },
  fieldBox: {
    marginBottom: '16px',
  },

  // ── Password card ──────────────────────────────────────────────────────────
  passwordIcon: {
    width: 52,
    height: 52,
    backgroundColor: CORAL_LIGHT,
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    fontSize: '24px',
  },
  passwordCardTitle: {
    fontFamily: 'Georgia, serif',
    fontWeight: 700,
    fontSize: '16px',
    color: '#1a1a1a',
    marginBottom: '4px',
    textAlign: 'center' as const,
  },
  passwordHint: {
    fontSize: '13px',
    color: '#999',
    fontFamily: 'Georgia, serif',
    lineHeight: 1.6,
    marginBottom: '28px',
    textAlign: 'center' as const,
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
