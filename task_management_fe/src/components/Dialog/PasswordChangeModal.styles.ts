import { CORAL } from '@/models/color';
import { Dialog, styled } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

export const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: '8px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
  },
});

export const useChangePasswordModalStyles = makeStyles({ name: 'ChangePasswordModal' })(
  (theme) => ({
    dialogTitle: {
      paddingBottom: 0,
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    titleText: {
      fontFamily: 'Georgia, serif',
      fontWeight: 700,
      fontSize: '18px',
      color: '#1a1a1a',
    },
    subtitleText: {
      fontFamily: 'Georgia, serif',
      color: '#999',
      fontSize: '13px',
      marginTop: '4px',
    },
    dialogContent: {
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    errorAlert: {
      marginBottom: theme.spacing(2),
      borderRadius: '8px',
      fontSize: '13px',
      fontFamily: 'Georgia, serif',
    },
    fieldRow: {
      marginBottom: '20px',
    },
    fieldRowLast: {
      marginBottom: '4px',
    },
    dialogActions: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(1),
      gap: theme.spacing(1),
    },
    cancelButton: {
      fontFamily: 'Georgia, serif',
      color: '#888',
      textTransform: 'none',
      fontSize: '14px',
      borderRadius: '8px',
    },
    saveButton: {
      fontFamily: 'Georgia, serif',
      textTransform: 'none',
      fontSize: '14px',
      borderRadius: '8px',
      fontWeight: 600,
      '&&': {
        backgroundColor: CORAL,
        color: '#fff',
      },
      '&&:hover': {
        backgroundColor: CORAL,
      },
    },
  }),
);
