import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import {
Alert, Button, CircularProgress,   Dialog, DialogActions,
DialogContent, DialogTitle,   FormControl, MenuItem, Select,
styled,
  TextField, Typography, } from '@mui/material';

import { CORAL } from '@/models/color';

import { boundActions, selectors } from '../../app/index';
import { PRIORITIES,STATUSES } from '../../models/task';

import type { CreateTaskPayload} from '../../models/task';

// ─── Styled ───────────────────────────────────────────────────────────────────

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: '8px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
  },
});

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontFamily: 'Georgia, serif',
    fontSize: '14px',
    '&:hover fieldset':  { borderColor: CORAL },
    '&.Mui-focused fieldset': { borderColor: CORAL },
  },
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px', fontWeight: 600, color: '#555',
  marginBottom: '6px', fontFamily: 'Georgia, serif',
};

// ─── Component ────────────────────────────────────────────────────────────────

type Props = { open: boolean; onClose: () => void };

export const AddTaskModal = ({ open, onClose }: Props) => {
  const { create: loading } = useSelector(selectors.tasks.isLoading);

  const error = useSelector(selectors.tasks.getError);
  const [form, setForm] = useState<CreateTaskPayload>({
    title:       '',
    description: null,
    status:      'TODO',
    priority:    'MEDIUM',
    dueDate:     '',
  });

  const handleChange = useCallback((field: keyof CreateTaskPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) boundActions.tasks.clearTasksErrors();
  }, [error]);

  const handleClose = useCallback(() => {
    setForm({ title: '', description: null, status: 'TODO', priority: 'MEDIUM', dueDate: '' });
    onClose();
  }, [onClose]);

  const handleSave = useCallback(() => {
    if (!form.title.trim()) return;
    boundActions.tasks.createTaskRequest(form);
    handleClose();
  }, [form]);


  return (
    <StyledDialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ pb: 0, pt: 2, px: 3 }}>
        <Typography style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '18px', color: '#1a1a1a' }}>
          New Task
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, px: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px', fontFamily: 'Georgia, serif' }}>
            {error}
          </Alert>
        )}

        {/* Task title */}
        <div style={{ marginBottom: '20px' }}>
          <Typography style={labelStyle}>Task title</Typography>
          <TextField
            fullWidth size="small" placeholder="Enter task title"
            value={form.title} sx={fieldSx}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <Typography style={labelStyle}>Description <span style={{ fontWeight: 400, color: '#bbb' }}>(optional)</span></Typography>
          <TextField
            fullWidth multiline minRows={2} maxRows={4}
            placeholder="Add a description…"
            value={form.description ?? ''} sx={fieldSx}
            onChange={(e) => handleChange('description', e.target.value || null as any)}
          />
        </div>

        {/* Status + Priority row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <Typography style={labelStyle}>Status</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                sx={{ borderRadius: '8px', fontFamily: 'Georgia, serif', fontSize: '14px' }}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s} style={{ fontFamily: 'Georgia, serif', fontSize: '14px' }}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <Typography style={labelStyle}>Priority</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={form.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                sx={{ borderRadius: '8px', fontFamily: 'Georgia, serif', fontSize: '14px' }}
              >
                {PRIORITIES.map((p) => (
                  <MenuItem key={p} value={p} style={{ fontFamily: 'Georgia, serif', fontSize: '14px' }}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Due date */}
        <div>
          <Typography style={labelStyle}>Due Date</Typography>
          <TextField
            fullWidth size="small" type="date"
            value={form.dueDate} sx={fieldSx}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button
          fullWidth variant="text" onClick={handleClose} disabled={loading}
          style={{ fontFamily: 'Georgia, serif', color: '#888', textTransform: 'none',
            fontSize: '14px', borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button
          fullWidth variant="contained" onClick={handleSave}
          disabled={loading || !form.title.trim()}
          style={{ fontFamily: 'Georgia, serif', backgroundColor: CORAL,
            textTransform: 'none', fontSize: '14px', borderRadius: '8px', fontWeight: 600 }}
        >
          {loading ? <CircularProgress size={18} style={{ color: '#fff' }} /> : 'Create Task'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
