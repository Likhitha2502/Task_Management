import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

import type { Task } from "@/models";

type DeleteDialogProps = {
  task:      Task | null;
  deleting:  boolean;
  onConfirm: () => void;
  onCancel:  () => void;
};

export const DeleteTaskDialog = ({ task, deleting, onConfirm, onCancel }: DeleteDialogProps) => (
  <Dialog open={!!task} onClose={onCancel}>
    <DialogTitle style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '17px' }}>
      Delete task?
    </DialogTitle>
    <DialogContent>
      <Typography style={{ fontFamily: 'Georgia, serif', fontSize: '14px', color: '#555' }}>
        Are you sure you want to delete the task <strong>{task?.title}</strong>?
      </Typography>
    </DialogContent>
    <DialogActions style={{ padding: '8px 24px 20px', gap: '8px' }}>
      <Button fullWidth variant="text" onClick={onCancel} disabled={deleting}
        style={{ fontFamily: 'Georgia, serif', textTransform: 'none', color: '#888', borderRadius: '8px' }}>
        Cancel
      </Button>
      <Button fullWidth variant="contained" onClick={onConfirm} disabled={deleting}
        style={{ fontFamily: 'Georgia, serif', textTransform: 'none', backgroundColor: '#d32f2f',
          borderRadius: '8px', fontWeight: 600 }}>
        {deleting ? <CircularProgress size={16} style={{ color: '#fff' }} /> : 'Delete'}
      </Button>
    </DialogActions>
  </Dialog>
);
