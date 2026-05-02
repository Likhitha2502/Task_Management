import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar } from '@mui/material';
import { Delete, CloudUpload } from '@mui/icons-material';

interface Props {
  open: boolean;
  onClose: () => void;
  currentImage: string | null; // The image currently on the MAIN PAGE
  initials: string;
  onConfirm: (file: File | null) => void;
}

export const ProfilePictureDialog = ({ open, onClose, currentImage, initials, onConfirm }: Props) => {
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const [isDeletedInModal, setIsDeletedInModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset internal modal state every time it opens
  useEffect(() => {
    if (open) {
      setTempFile(null);
      setTempPreview(null);
      setIsDeletedInModal(false);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (tempPreview) URL.revokeObjectURL(tempPreview);
    setTempFile(file);
    setTempPreview(URL.createObjectURL(file));
    setIsDeletedInModal(false); // Reset delete flag if a new file is picked
  };

  const handleSet = () => {
    // This is the ONLY place that communicates back to the Page
    if (isDeletedInModal) {
      onConfirm(null);
    } else if (tempFile) {
      onConfirm(tempFile);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: 'Georgia, serif' }}>Update Photo</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
        <Avatar 
          // Visual priority: Local Delete > Local Upload > Existing Image > Initials
          src={isDeletedInModal ? undefined : (tempPreview || currentImage || undefined)} 
          sx={{ width: 120, height: 120, mb: 2 }}
        >
          {initials}
        </Avatar>
        <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => fileInputRef.current?.click()}>
          Upload New
        </Button>
        <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          startIcon={<Delete />} 
          color="error" 
          onClick={() => {
            setTempFile(null);
            setIsDeletedInModal(true); // Only changes the modal's preview
          }}
        >
          Delete
        </Button>
        <Button variant="contained" onClick={handleSet} sx={{ backgroundColor: '#D35F55' }}>
          Set
        </Button>
      </DialogActions>
    </Dialog>
  );
};
