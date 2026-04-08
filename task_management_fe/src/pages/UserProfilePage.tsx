import { equals, isNil } from 'ramda';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Button, Typography, TextField, Avatar,
  IconButton, CircularProgress,
} from '@mui/material';
import { Edit } from '@mui/icons-material';

import { boundActions, selectors } from '../app/index';
import { ChangePasswordModal } from '../components/PasswordChangeModal';

import { AppLayout } from './AppLayout';
import { ProfilePictureDialog } from './ProfilePicturedialog';
import {
  useUserProfileStyles,
  fieldSx,
} from './UserProfilePage.styles';

const CORAL = '#D35F55';

export const UserProfilePage = () => {
  // const { classes } = useUserProfileStyles();

  // // 1. SELECTORS
  // const currentUser = useSelector(selectors.profile.userProfile, equals);
  // const loggedInUser = useSelector(selectors.auth.loggedInUser);
  // const profileIcon = useSelector(selectors.profile.userIcon); // The binary from API

  // // 2. STATE MANAGEMENT
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  // const [pendingFile, setPendingFile] = useState<File | null | undefined>(undefined);
  // const [saving, setSaving] = useState(false);
  // const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // const [form, setForm] = useState({
  //   firstName: currentUser?.firstName ?? '',
  //   lastName: currentUser?.lastName ?? '',
  //   profilePicture: currentUser?.profilePicture ?? profileIcon,
  // });

  // const handleModalConfirm = (file: File | null) => {
  //   setPendingFile(file);
  //   if (pendingUrl) URL.revokeObjectURL(pendingUrl);

  //   if (file instanceof File) {
  //     setPendingUrl(URL.createObjectURL(file));
  //   } else {
  //     setPendingUrl(null);
  //   }
  // };
  // const handleSave = () => {
  //   // Dispatch a plain serializable object instead of FormData
  //   const payload = !isNil(pendingFile) ? {
  //     firstName: form?.firstName,
  //     lastName: form?.lastName, profilePicture: pendingFile
  //   } : {
  //     firstName: form?.firstName,
  //     lastName: form?.lastName,
  //   };

  //   boundActions.profile.updateUserProfileRequest({ values: payload, email: loggedInUser?.email });
  // };

  // const initials = `${currentUser?.firstName?.[0] || ''}${currentUser?.lastName?.[0] || ''}` || 'U';

  // useEffect(() => {
  //   boundActions.profile.fetchUserProfilePictureRequest({
  //     email: loggedInUser?.email as string
  //   });
  //   boundActions.profile.fetchUserProfileRequest({
  //     email: loggedInUser?.email as string
  //   })
  // }, []);

  // // Sync form state when currentUser data is loaded from Redux
  // useEffect(() => {
  //   if (currentUser) {
  //     setForm({
  //       firstName: currentUser.firstName ?? '',
  //       lastName: currentUser.lastName ?? '',
  //       profilePicture: profileIcon ?? '',
  //     });
  //   }
  // }, [currentUser, profileIcon]); // This runs every time currentUser changes

  const { classes } = useUserProfileStyles();

  const currentUser = useSelector(selectors.profile.userProfile, equals);
  const loggedInUser = useSelector(selectors.auth.loggedInUser);
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
    const email = loggedInUser?.email;
    if (email) {
      boundActions.profile.fetchUserProfilePictureRequest({ email });
      boundActions.profile.fetchUserProfileRequest({ email });
    }
  }, [loggedInUser?.email]);

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

    // If user deleted (null) or picked a file (File), include it
    if (pendingFile !== undefined) {
      payload.profilePicture = pendingFile;
    }

    boundActions.profile.updateUserProfileRequest({
      values: payload,
      email: loggedInUser?.email as string
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
            currentImage={pendingFile === null ? null : (pendingUrl || profileIcon)}
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
          <Button onClick={handleSave}>
            {saving ? <CircularProgress size={16} /> : 'Save'}
          </Button>
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
