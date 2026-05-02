import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { boundActions, selectors } from '@/app/index';
import { PasswordField } from './PasswordField';
import { StyledDialog, useChangePasswordModalStyles } from './PasswordChangeModal.styles';

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  forced?: boolean;
};

type PasswordFieldKey = 'currentPassword' | 'newPassword' | 'confirmPassword';

type FormState = Record<PasswordFieldKey, string>;

export const ChangePasswordModal = ({ open, onClose, forced }: ChangePasswordModalProps) => {
  const { classes } = useChangePasswordModalStyles();
  const passwordChanged = useSelector(selectors.auth.passwordChanged);
  const error = useSelector(selectors.auth.isError);
  const loggedInUser = useSelector(selectors.auth.loggedInUser);

  const [form, setForm] = useState<FormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
    if (error) boundActions.auth.clearError();
  }, [error]);

  const handleClose = useCallback(() => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setValidationError(null);
    boundActions.auth.clearError();
    boundActions.auth.clearPasswordStatus();
    onClose();
  }, [onClose]);

  const handleSave = useCallback(() => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setValidationError('All fields are required.');
      return;
    }
    if (form.newPassword.length < 8) {
      setValidationError('New password must be at least 8 characters.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setValidationError('New passwords do not match.');
      return;
    }
    if (form.currentPassword === form.newPassword) {
      setValidationError('New password must differ from current password.');
      return;
    }

    boundActions.auth.changePasswordRequest({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
  }, [form]);

  useEffect(() => {
    if (passwordChanged) {
      handleClose();
    }
  }, [passwordChanged]);

  const fields: { key: PasswordFieldKey; label: string; placeholder: string }[] = [
    { key: 'currentPassword', label: 'Current Password', placeholder: 'Enter your current password' },
    { key: 'newPassword', label: 'New Password', placeholder: 'Enter new password' },
    { key: 'confirmPassword', label: 'Confirm Password', placeholder: 'Confirm new password' },
  ];

  const displayError = validationError || error;

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <DialogTitle className={classes.dialogTitle}>
        <Typography variant="h6" className={classes.titleText}>
          Change Password
        </Typography>
        <Typography variant="body2" className={classes.subtitleText}>
          You must set a new password before continuing.
        </Typography>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        {displayError && (
          <Alert
            severity="error"
            onClose={() => {
              setValidationError(null);
              boundActions.auth.clearError();
            }}
            className={classes.errorAlert}
          >
            {displayError}
          </Alert>
        )}

        {fields.map(({ key, label, placeholder }, index) => (
          <div
            key={key}
            className={index === fields.length - 1 ? classes.fieldRowLast : classes.fieldRow}
          >
            <PasswordField
              name={key}
              label={label}
              placeholder={placeholder}
              value={form[key]}
              onChange={handleChange}
            />
          </div>
        ))}
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button
          fullWidth
          variant="text"
          onClick={handleClose}
          disabled={!forced}
          className={classes.cancelButton}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSave}
          disabled={!form.newPassword}
          className={classes.saveButton}
        >
          Save Password
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
