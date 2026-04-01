// src/pages/UserProfile/UserProfilePage.tsx
import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, TextField, Avatar,
  IconButton, Divider, CircularProgress,
} from '@mui/material';
import { CameraAlt } from '@mui/icons-material';
import { ChangePasswordModal } from '../components/PasswordChangeModal';
import { ROUTES } from '../constants/routes';
import {
  useUserProfileStyles,
  fieldSx,
  cameraIconSx,
} from './UserProfilePage.styles';

export const UserProfilePage = () => {
  const { classes } = useUserProfileStyles();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = { firstName: "Crysta", lastName: "stenne", email: 'crystastenne@gmail.com' };
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const [form, setForm] = useState({
    firstName: currentUser?.firstName ?? '',
    lastName:  currentUser?.lastName  ?? '',
    email:     currentUser?.email     ?? '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const initials = form.firstName && form.lastName
    ? `${form.firstName[0]}${form.lastName[0]}`.toUpperCase()
    : (currentUser?.email?.[0] ?? 'U').toUpperCase();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSave = useCallback(() => {
    setSaving(true);
    // dispatch updateProfile action here when BE endpoint is ready
    // boundActions.user.updateProfileRequest({ ...form });
    setTimeout(() => setSaving(false), 800); // placeholder
  }, [form]);

  return (
    <Box className={classes.root}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Box className={classes.header}>
        <button className={classes.backBtn} onClick={() => navigate(ROUTES.tasks)}>
          ← Back
        </button>
        <Divider orientation="vertical" flexItem className={classes.headerDivider} />
        <Typography className={classes.headerTitle}>User Profile</Typography>
      </Box>

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <Box className={classes.content}>

        {/* ── Left: Profile Form ────────────────────────────────────────── */}
        <Box className={classes.card}>
          <Typography className={classes.cardTitle}>Profile</Typography>
          <Typography className={classes.cardSubtitle}>
            Update your personal information
          </Typography>

          {/* Avatar */}
          <Box className={classes.avatarWrapper}>
            <Avatar
              src={avatarPreview ?? undefined}
              className={classes.avatarLarge}
            >
              {!avatarPreview && initials}
            </Avatar>
            <IconButton className={classes.cameraBtn} onClick={handleAvatarClick}>
              <CameraAlt sx={cameraIconSx} />
            </IconButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={classes.hiddenFileInput}
              onChange={handleAvatarChange}
            />
          </Box>

          {/* First + Last name row */}
          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>First name</Typography>
              <TextField
                fullWidth
                name="firstName"
                size="small"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                sx={fieldSx}
              />
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Last name</Typography>
              <TextField
                fullWidth
                name="lastName"
                size="small"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                sx={fieldSx}
              />
            </Box>
          </Box>

          {/* Email */}
          <Box className={classes.fieldBox}>
            <Typography className={classes.fieldLabel}>Email</Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              size="small"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Box>

          {/* Save — bottom right */}
          <Box className={classes.saveRow}>
            <Button
              variant="contained"
              className={classes.saveBtn}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <CircularProgress size={16} className={classes.saveBtnProgress} /> : 'Save'}
            </Button>
          </Box>
        </Box>

        {/* ── Right: Change Password ────────────────────────────────────── */}
        <Box className={classes.passwordCard}>
          <Box className={classes.passwordIcon}>🔒</Box>
          <Typography className={classes.cardTitle}>Change Password</Typography>
          <Typography className={classes.passwordHint}>
            For your security, we recommend using a strong password that you
            don't use for other accounts.
          </Typography>

          <Button
            variant="outlined"
            className={classes.changePasswordBtn}
            onClick={() => setChangePasswordOpen(true)}
          >
            Change Password
          </Button>
        </Box>
      </Box>

      {/* ── Change Password Modal ────────────────────────────────────────── */}
      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </Box>
  );
};

export default UserProfilePage;
