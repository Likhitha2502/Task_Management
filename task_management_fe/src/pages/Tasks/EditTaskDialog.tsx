// src/components/EditTaskDialog/EditTaskDialog.tsx
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Typography, MenuItem,
  Select, FormControl, CircularProgress, Alert, styled,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { type Task, type TaskStatus, type TasksPriority, STATUSES, PRIORITIES } from '../../models/task'
import { CORAL } from '@/models/color';
import { useSelector } from 'react-redux';
import { selectors } from '@/app/selectors';

// ─── Types ────────────────────────────────────────────────────────────────────

type EditableDraft = Omit<Task, 'id'>;

type EditTaskDialogProps = {
  task:    Task | null;         // null = dialog closed
  saving:  boolean;
  onSave:  (draft: EditableDraft) => void;
  onClose: () => void;
};

// ─── Styled ───────────────────────────────────────────────────────────────────

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: '8px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
  },
});

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontFamily: 'Georgia, serif',
    fontSize: '14px',
    '&:hover fieldset':       { borderColor: CORAL },
    '&.Mui-focused fieldset': { borderColor: CORAL },
  },
};

const selectSx = {
  borderRadius: '8px',
  fontFamily: 'Georgia, serif',
  fontSize: '14px',
  '& .MuiOutlinedInput-notchedOutline': { borderRadius: '8px' },
  '&:hover .MuiOutlinedInput-notchedOutline':       { borderColor: CORAL },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: CORAL },
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px', fontWeight: 600, color: '#555',
  marginBottom: '6px', fontFamily: 'Georgia, serif',
  letterSpacing: '0.02em',
};

// ─── Dirty check ──────────────────────────────────────────────────────────────
// Returns true if draft differs from original task in any field

const isDirty = (original: Task, draft: EditableDraft): boolean =>
  draft.title     !== original.title     ||
  draft.status   !== original.status   ||
  draft.priority !== original.priority ||
  draft.dueDate  !== original.dueDate;

// ─── Component ────────────────────────────────────────────────────────────────

export const EditTaskDialog = ({ task, saving, onSave, onClose }: EditTaskDialogProps) => {
    const error = useSelector(selectors.tasks.getError);

  // Initialise draft from task — reset whenever a new task is passed in
  const [draft, setDraft] = useState<EditableDraft>({
    title:     task?.title     ?? '',
    status:   task?.status   ?? 'TODO',
    priority: task?.priority ?? 'MEDIUM',
    dueDate:  task?.dueDate  ?? '',
  });

  useEffect(() => {
    if (task) {
      setDraft({
        title:     task.title,
        status:   task.status,
        priority: task.priority,
        dueDate:  task.dueDate,
      });
    }
  }, [task]);

  const handleChange = useCallback(
    <K extends keyof EditableDraft>(field: K, value: EditableDraft[K]) => {
      setDraft((prev) => ({ ...prev, [field]: value }));
    }, []
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSave = useCallback(() => {
    if (!task || !isDirty(task, draft)) return;
    onSave(draft);
  }, [task, draft, onSave]);

  // Save is disabled when: no changes, title is empty, or request is in flight
  const saveDisabled = !task || !draft.title?.trim() || !isDirty(task, draft) || saving;

  return (
    <StyledDialog open={!!task} onClose={handleClose}>
      <DialogTitle sx={{ pb: 0, pt: 2.5, px: 3 }}>
        <Typography style={{
          fontFamily: 'Georgia, serif', fontWeight: 700,
          fontSize: '18px', color: '#1a1a1a',
        }}>
          Edit Task
        </Typography>
        <Typography style={{
          fontFamily: 'Georgia, serif', fontSize: '13px',
          color: '#999', marginTop: '4px',
        }}>
          Update the fields below. Save is enabled only when changes are made.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5, px: 3 }}>

        {/* API error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px', fontFamily: 'Georgia, serif' }}>
            {error}
          </Alert>
        )}

        {/* Task title */}
        <div style={{ marginBottom: '20px' }}>
          <Typography style={labelStyle}>Task title</Typography>
          <TextField
            fullWidth size="small"
            placeholder="Enter task title"
            value={draft.title}
            sx={fieldSx}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        {/* Status + Priority — side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <Typography style={labelStyle}>Status</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={draft.status}
                sx={selectSx}
                onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}
                    style={{ fontFamily: 'Georgia, serif', fontSize: '14px' }}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div>
            <Typography style={labelStyle}>Priority</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={draft.priority}
                sx={selectSx}
                onChange={(e) => handleChange('priority', e.target.value as TasksPriority)}
              >
                {PRIORITIES.map((p) => (
                  <MenuItem key={p} value={p}
                    style={{ fontFamily: 'Georgia, serif', fontSize: '14px' }}>
                    {p}
                  </MenuItem>
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
            value={draft.dueDate}
            sx={fieldSx}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1 }}>
        <Button
          fullWidth variant="text"
          onClick={handleClose}
          disabled={saving}
          style={{
            fontFamily: 'Georgia, serif', color: '#888',
            textTransform: 'none', fontSize: '14px', borderRadius: '8px',
          }}
        >
          Cancel
        </Button>

        <Button
          fullWidth variant="contained"
          onClick={handleSave}
          disabled={saveDisabled}
          style={{
            fontFamily: 'Georgia, serif',
            backgroundColor: saveDisabled ? '#e0e0e0' : CORAL,
            color: saveDisabled ? '#aaa' : '#fff',
            textTransform: 'none', fontSize: '14px',
            borderRadius: '8px', fontWeight: 600,
            transition: 'background 0.2s',
          }}
        >
          {saving
            ? <CircularProgress size={18} style={{ color: '#fff' }} />
            : 'Save Changes'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
