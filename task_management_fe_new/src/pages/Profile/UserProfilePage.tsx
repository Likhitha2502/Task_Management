import { useEffect, useRef,useState } from 'react';
import { useSelector } from 'react-redux';

import { Edit } from '@mui/icons-material';
import {
Avatar,
  Box, Button, CircularProgress,
  IconButton, TextField, Typography, } from '@mui/material';
import { equals } from 'ramda';

import { profileFile } from '@/utils/profileFile';

import { boundActions, selectors } from '../../app/index';
import { ChangePasswordModal } from '../../components/Dialog/PasswordChangeModal';
import { AppLayout } from '../AppLayout';
import { ProfilePictureDialog } from './ProfilePictureDialog';
import {
  fieldSx,
  useUserProfileStyles,
} from './UserProfilePage.styles';

const CORAL = '#D35F55';

export const UserProfilePage = () => {
  const { classes } = useUserProfileStyles();

  const currentUser = useSelector(selectors.profile.userProfile, equals);
  const profileIcon = useSelector(selectors.profile.userIcon);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // Initialize with empty strings
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
  });

  // 1. Ref to track if we have already filled the form with DB data
  const hasInitialized = useRef(false);

  // 2. Load profile data only ONCE when currentUser becomes available
  useEffect(() => {
    if (currentUser && !hasInitialized.current) {
      setForm({
        firstName: currentUser.firstName ?? '',
        lastName: currentUser.lastName ?? '',
      });
      hasInitialized.current = true;
    }
  }, [currentUser]);

  // 3. Fetch initial data on mount
  useEffect(() => {
    boundActions.profile.fetchUserProfilePictureRequest();
    boundActions.profile.fetchUserProfileRequest();
  }, []);

  // 4. Handle Typing (Local State only)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleModalConfirm = (file: File | null) => {
    setPendingFile(file);
    if (pendingUrl) URL.revokeObjectURL(pendingUrl);
    if (file instanceof File) {
      setPendingUrl(URL.createObjectURL(file));
    } else {
      setPendingUrl(null);
    }
  };

  const handleSave = () => {
    setSaving(true);
    const payload: any = {
      firstName: form.firstName,
      lastName: form.lastName,
    };

    profileFile.set(pendingFile);
    boundActions.profile.updateUserProfileRequest({
      values: payload
    });

    // Stop loader after a brief delay
    setTimeout(() => setSaving(false), 1000);
  };

  const initials = `${currentUser?.firstName?.[0] || ''}${currentUser?.lastName?.[0] || ''}` || 'U';

  return (
    // activeNav=null means neither Tasks nor Progress is highlighted
    <AppLayout>

      <Box className={classes.grid}>

        {/* Left — Profile Form */}
        <Box className={classes.card}>
          <Typography className={classes.cardTitle}>Profile</Typography>
          <Typography className={classes.cardSubtitle}>Update your personal information</Typography>

          <Box className={classes.avatarWrapper}>
            <Avatar
              src={pendingFile === null ? undefined : (pendingUrl || profileIcon || undefined)}
              className={classes.avatarLarge}
            >
              {initials}
            </Avatar>
            <IconButton className={classes.cameraBtn} onClick={() => setIsModalOpen(true)}>
              <Edit style={{ fontSize: 14, color: CORAL }} />
            </IconButton>
          </Box>

          <ProfilePictureDialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initials={initials}
            currentImage={pendingFile === null ? null : (pendingUrl as string || profileIcon as string)}
            onConfirm={handleModalConfirm}
          />

          <Box className={classes.fieldRow}>
            <Box>
              <Typography className={classes.fieldLabel}>First name</Typography>
              <TextField
                fullWidth
                name="firstName"
                size="small"
                value={form.firstName}
                onChange={handleInputChange} // Fix: Use local handler
                sx={fieldSx}
              />
            </Box>
            <Box>
              <Typography className={classes.fieldLabel}>Last name</Typography>
              <TextField
                fullWidth
                name="lastName"
                size="small"
                value={form.lastName}
                onChange={handleInputChange} // Fix: Use local handler
                sx={fieldSx}
              />
            </Box>
          </Box>

          {/* Save Button triggers the API call ONLY when clicked */}
          <Button onClick={handleSave} style={{
            borderColor: CORAL, color: CORAL, borderRadius: '8px',
            textTransform: 'none', fontFamily: 'Georgia, serif',
            fontWeight: 600, fontSize: '14px', padding: '9px 0',
          }}>
            {saving ? <CircularProgress size={16} /> : 'Save'}
          </Button>
        </Box>

        {/* Right — Change Password */}
        <Box className={classes.card}>
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
