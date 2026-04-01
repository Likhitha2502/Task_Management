// src/components/ChangePasswordModal/ChangePasswordModal.tsx
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Typography, IconButton,
    InputAdornment, Alert,
    styled,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { boundActions, selectors } from '@/app/index';
import { PasswordField } from './PasswordField';

// ─── Types ────────────────────────────────────────────────────────────────────

type ChangePasswordModalProps = {
    open: boolean;
    onClose: () => void;
    forced?: boolean;
};

type PasswordField = 'currentPassword' | 'newPassword' | 'confirmPassword';

type FormState = Record<PasswordField, string>;
type VisibilityState = Record<PasswordField, boolean>;

// ─── Styled ───────────────────────────────────────────────────────────────────

const CORAL = '#D35F55';

const StyledDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        borderRadius: '16px',
        padding: '8px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
    },
});

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        fontFamily: 'Georgia, serif',
        fontSize: '14px',
        '&:hover fieldset': { borderColor: CORAL },
        '&.Mui-focused fieldset': { borderColor: CORAL },
    },
});

const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    color: '#555',
    marginBottom: '6px',
    fontFamily: 'Georgia, serif',
    letterSpacing: '0.02em',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const ChangePasswordModal = ({ open, onClose, forced }: ChangePasswordModalProps) => {
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

        // Reset the success flag so the modal can be used again later
        boundActions.auth.clearPasswordStatus();

        onClose();
    }, [onClose]);

    const handleSave = useCallback(() => {
        // Client-side validation
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
            email: loggedInUser?.email as string,
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
        });
    }, [form]);

    useEffect(() => {
        if (passwordChanged) {
            handleClose();
        }
    }, [passwordChanged]);


    const fields: { key: PasswordField; label: string; placeholder: string }[] = [
        { key: 'currentPassword', label: 'Current Password', placeholder: 'Enter your current password' },
        { key: 'newPassword', label: 'New Password', placeholder: 'Enter new password' },
        { key: 'confirmPassword', label: 'Confirm Password', placeholder: 'Confirm new password' },
    ];

    const displayError = validationError || error;

    return (
        <StyledDialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ pb: 0, pt: 2, px: 3 }}>
                <Typography
                    variant="h6"
                    style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '18px', color: '#1a1a1a' }}
                >
                    Change Password
                </Typography>
                <Typography
                    variant="body2"
                    style={{ fontFamily: 'Georgia, serif', color: '#999', fontSize: '13px', marginTop: '4px' }}
                >
                    You must set a new password before continuing.
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ pt: 2, px: 3 }}>
                {/* Error banner */}
                {displayError && (
                    <Alert
                        severity="error"
                        onClose={() => { setValidationError(null); boundActions.auth.clearError(); }}
                        sx={{ mb: 2, borderRadius: '8px', fontSize: '13px', fontFamily: 'Georgia, serif' }}
                    >
                        {displayError}
                    </Alert>
                )}

                {/* Password fields */}
                {fields.map(({ key, label, placeholder }, index) => (
                    <div key={key} style={{ marginBottom: index < fields.length - 1 ? '20px' : '4px' }}>
                        <PasswordField
                            key={key}
                            name={key}
                            label={label}
                            placeholder={placeholder}
                            value={form[key]}
                            onChange={handleChange}
                        />
                    </div>
                ))}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
                <Button
                    fullWidth
                    variant="text"
                    onClick={handleClose}
                    disabled={!forced}
                    style={{
                        fontFamily: 'Georgia, serif',
                        color: '#888',
                        textTransform: 'none',
                        fontSize: '14px',
                        borderRadius: '8px',
                    }}
                >
                    Cancel
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSave}
                    disabled={!form.newPassword}
                    style={{
                        fontFamily: 'Georgia, serif',
                        backgroundColor: CORAL,
                        textTransform: 'none',
                        fontSize: '14px',
                        borderRadius: '8px',
                        fontWeight: 600,
                    }}
                >
                    Save Password
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};
