import { equals } from 'ramda';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, TextField, Avatar,
  IconButton, CircularProgress,
} from '@mui/material';
import { CameraAlt } from '@mui/icons-material';
import { ChangePasswordModal } from '../components/PasswordChangeModal';

import {
  useUserProfileStyles,
  fieldSx,
} from './UserProfilePage.styles';
import { AppLayout } from './AppLayout';
import { boundActions, selectors } from '../app/index';

const CORAL = '#D35F55';

export const UserProfilePage = () => {
  const { classes } = useUserProfileStyles();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = useSelector(selectors.profile.userProfile, equals);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const loggedInUser = useSelector(selectors.auth.loggedInUser);

  const [form, setForm] = useState({
    firstName: currentUser?.firstName ?? '',
    lastName: currentUser?.lastName ?? '',
    profilePicture: currentUser?.profilePicture ?? ''
  });

  const initials = form.firstName && form.lastName
    ? `${form.firstName[0]}${form.lastName[0]}`.toUpperCase()
    : (currentUser?.email?.[0] ?? 'U').toUpperCase();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSave = useCallback(() => {
    setSaving(true);
    boundActions.profile.updateUserProfileRequest({ values: { ...form }, email: loggedInUser?.email as string });
    setTimeout(() => setSaving(false), 800);
  }, [form]);

  useEffect(() => {
    boundActions.profile.fetchUserProfileRequest({
      email: loggedInUser?.email as string
    })
  }, []);

  // Sync form state when currentUser data is loaded from Redux
  useEffect(() => {
    if (currentUser) {
      setForm({
        firstName: currentUser.firstName ?? '',
        lastName: currentUser.lastName ?? '',
        profilePicture: currentUser.profilePicture ?? '',
      });
    }
  }, [currentUser]); // This runs every time currentUser changes

  return (
    // activeNav=null means neither Tasks nor Progress is highlighted
    <AppLayout>

      {/* ── Back button + Title inside content ────────────────────────────
      <Box className={classes.pageHeader}>
        <button className={classes.backBtn} onClick={() => navigate(ROUTES.tasks)}>
          ← Back
        </button>
        <Typography className={classes.pageTitle}>User Profile</Typography>
      </Box> */}

      {/* ── Two-column grid ─────────────────────────────────────────────── */}
      <Box className={classes.grid}>

        {/* Left — Profile Form */}
        <Box className={classes.card}>
          <Typography className={classes.cardTitle}>Profile</Typography>
          <Typography className={classes.cardSubtitle}>Update your personal information</Typography>

          {/* Avatar */}
          <Box className={classes.avatarWrapper}>
            <Avatar src={avatarPreview ?? undefined} className={classes.avatarLarge}>
              {!avatarPreview && initials}
            </Avatar>
            <IconButton className={classes.cameraBtn} onClick={() => fileInputRef.current?.click()}>
              <CameraAlt style={{ fontSize: 14, color: CORAL }} />
            </IconButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </Box>

          {/* First + Last name */}
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>First name</Typography>
              <TextField fullWidth name="firstName" size="small"
                placeholder="First name" value={form.firstName}
                onChange={handleChange} sx={fieldSx} />
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Last name</Typography>
              <TextField fullWidth name="lastName" size="small"
                placeholder="Last name" value={form.lastName}
                onChange={handleChange} sx={fieldSx} />
            </Box>
          </Box>

          {/* Email */}
          <Box className={classes.fieldBox}>
            <Typography className={classes.fieldLabel}>Email</Typography>
            <TextField fullWidth name="email" type="email" size="small"
              placeholder="Email address" value={loggedInUser?.email as string}
              onChange={handleChange} sx={fieldSx} disabled={true} />
          </Box>

          {/* Save — bottom right */}
          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              style={{
                backgroundColor: CORAL, color: '#fff', borderRadius: '8px',
                textTransform: 'none', fontFamily: 'Georgia, serif',
                fontWeight: 600, fontSize: '14px', padding: '9px 28px',
              }}
            >
              {saving ? <CircularProgress size={16} style={{ color: '#fff' }} /> : 'Save'}
            </Button>
          </Box>
        </Box>

        {/* Right — Change Password */}
        <Box className={classes.card}>
          <Box className={classes.passwordIcon}>🔒</Box>
          <Typography className={classes.passwordCardTitle}>Change Password</Typography>
          <Typography className={classes.passwordHint}>
            For your security, we recommend using a strong password
            that you don't use for other accounts.
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => setChangePasswordOpen(true)}
            style={{
              borderColor: CORAL, color: CORAL, borderRadius: '8px',
              textTransform: 'none', fontFamily: 'Georgia, serif',
              fontWeight: 600, fontSize: '14px', padding: '9px 0',
            }}
          >
            Change Password
          </Button>
        </Box>
      </Box>

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </AppLayout>
  );
};

export default UserProfilePage;
