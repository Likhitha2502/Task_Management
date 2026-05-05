import { useSelector } from 'react-redux';

import { Alert,Snackbar } from '@mui/material';

import { boundActions,selectors  } from '../../app/index';

export const ToastProvider = () => {
  const open     = useSelector(selectors.toast.open);
  const message  = useSelector(selectors.toast.message);
  const severity = useSelector(selectors.toast.severity);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => boundActions.toast.hideToast()}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity={severity}
        onClose={() => boundActions.toast.hideToast()}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
