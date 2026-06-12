import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import * as yup from 'yup';

import { boundActions, selectors } from '@/app/index';

import { StyledDialog, useChangePasswordModalStyles } from '../Dialog/PasswordChangeModal.styles';
import { PasswordInput } from '../Field/PasswordInput';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/;

const schema = yup.object({
  currentPassword: yup.string().required('Current password is required.'),
  newPassword: yup
    .string()
    .required('New password is required.')
    .matches(
      PASSWORD_REGEX,
      'Must be 8–16 characters with uppercase, lowercase, a number, and a special character.',
    )
    .notOneOf([yup.ref('currentPassword')], 'New password must differ from current password.'),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password.')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match.'),
});

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  forced?: boolean;
};

type PasswordFieldKey = 'currentPassword' | 'newPassword' | 'confirmPassword';

type FormState    = Record<PasswordFieldKey, string>;
type FieldErrors  = Record<PasswordFieldKey, string>;

const EMPTY_FORM: FormState   = { currentPassword: '', newPassword: '', confirmPassword: '' };
const EMPTY_ERRORS: FieldErrors = { currentPassword: '', newPassword: '', confirmPassword: '' };

export const ChangePasswordModal = ({ open, onClose, forced }: ChangePasswordModalProps) => {
  const { classes } = useChangePasswordModalStyles();
  const passwordChanged = useSelector(selectors.auth.passwordChanged);
  const apiError = useSelector(selectors.auth.isError);

  const [form, setForm]               = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(EMPTY_ERRORS);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) boundActions.auth.clearError();
  }, [apiError]);

  const handleClose = useCallback(() => {
    setForm(EMPTY_FORM);
    setFieldErrors(EMPTY_ERRORS);
    boundActions.auth.clearError();
    boundActions.auth.clearPasswordStatus();
    onClose();
  }, [onClose]);

  const handleSave = useCallback(async () => {
    try {
      await schema.validate(form, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors: Partial<FieldErrors> = {};
        (err.inner.length ? err.inner : [err]).forEach((e) => {
          if (e.path && !errors[e.path as PasswordFieldKey]) {
            errors[e.path as PasswordFieldKey] = e.message;
          }
        });
        setFieldErrors((prev) => ({ ...prev, ...errors }));
      }
      return;
    }

    boundActions.auth.changePasswordRequest({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
  }, [form]);

  useEffect(() => {
    if (passwordChanged) handleClose();
  }, [passwordChanged]);

  const fields: { key: PasswordFieldKey; label: string; placeholder: string }[] = [
    { key: 'currentPassword', label: 'Current Password', placeholder: 'Enter your current password' },
    { key: 'newPassword',     label: 'New Password',     placeholder: 'Enter new password' },
    { key: 'confirmPassword', label: 'Confirm Password', placeholder: 'Confirm new password' },
  ];

  const isSaveEnabled =
    form.currentPassword.length > 0 &&
    form.newPassword.length > 0 &&
    form.confirmPassword.length > 0;

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <DialogTitle className={classes.dialogTitle}>
        <Typography variant="h5" component="span" className={classes.titleText}>
          Change Password
        </Typography>
        <Typography variant="body2" component="span" className={classes.subtitleText}>
          You must set a new password before continuing.
        </Typography>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        {apiError && (
          <Alert
            severity="error"
            onClose={() => boundActions.auth.clearError()}
            className={classes.errorAlert}
          >
            {apiError}
          </Alert>
        )}

        {fields.map(({ key, label, placeholder }, index) => (
          <div
            key={key}
            className={index === fields.length - 1 ? classes.fieldRowLast : classes.fieldRow}
          >
            <PasswordInput
              name={key}
              label={label}
              placeholder={placeholder}
              value={form[key]}
              onChange={handleChange}
              error={!!fieldErrors[key]}
              helperText={fieldErrors[key] || undefined}
            />
          </div>
        ))}
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button
          fullWidth
          variant="text"
          onClick={handleClose}
          disabled={!!forced}
          className={classes.cancelButton}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSave}
          disabled={!isSaveEnabled}
          className={classes.saveButton}
        >
          Save Password
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
