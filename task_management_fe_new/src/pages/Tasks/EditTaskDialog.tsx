import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, MenuItem,
  Select, styled, TextField, Typography,
} from '@mui/material';

import { boundActions, selectors } from '@/app/index';
import { CORAL } from '@/models/color';

import { PRIORITIES, STATUSES, type Task, type TasksPriority, type TaskStatus } from '../../models/task';

// ─── Types ────────────────────────────────────────────────────────────────────

type EditableDraft = Omit<Task, 'id'>;

type EditTaskDialogProps = {
  taskId:  number | null;   // null = dialog closed
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

const isDirty = (original: Task, draft: EditableDraft): boolean =>
  draft.title       !== original.title       ||
  draft.description !== original.description ||
  draft.status      !== original.status      ||
  draft.priority    !== original.priority    ||
  draft.dueDate     !== original.dueDate;

// ─── Component ────────────────────────────────────────────────────────────────

export const EditTaskDialog = ({ taskId, saving, onSave, onClose }: EditTaskDialogProps) => {
  const error          = useSelector(selectors.tasks.getError);
  const fetchedTask    = useSelector(selectors.tasks.fetchedTask);
  const fetchLoading   = useSelector(selectors.tasks.fetchByIdLoading);

  const [draft, setDraft] = useState<EditableDraft>({
    title: '', description: null, status: 'TODO', priority: 'MEDIUM', dueDate: '',
  });

  // Fetch task from BE whenever the dialog opens for a new id
  useEffect(() => {
    if (taskId !== null) {
      boundActions.tasks.fetchTaskByIdRequest(taskId);
    }
    return () => { boundActions.tasks.clearFetchedTask(); };
  }, [taskId]);

  // Populate draft once the task arrives
  useEffect(() => {
    if (fetchedTask) {
      setDraft({
        title:       fetchedTask.title,
        description: fetchedTask.description,
        status:      fetchedTask.status,
        priority:    fetchedTask.priority,
        dueDate:     fetchedTask.dueDate,
      });
      boundActions.tasks.clearTasksErrors();
    }
  }, [fetchedTask]);

  const handleChange = useCallback(
    <K extends keyof EditableDraft>(field: K, value: EditableDraft[K]) => {
      setDraft((prev) => ({ ...prev, [field]: value }));
      boundActions.tasks.clearTasksErrors();
    }, []
  );

  const handleClose = useCallback(() => {
    boundActions.tasks.clearFetchedTask();
    onClose();
  }, [onClose]);

  const handleSave = useCallback(() => {
    if (!fetchedTask || !isDirty(fetchedTask, draft)) return;
    onSave(draft);
  }, [fetchedTask, draft, onSave]);

  const saveDisabled = !fetchedTask || !draft.title?.trim() || !isDirty(fetchedTask, draft) || saving || fetchLoading;

  return (
    <StyledDialog open={taskId !== null} onClose={handleClose}>
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

        {/* Fetching task */}
        {fetchLoading && (
          <Box style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <CircularProgress size={28} style={{ color: CORAL }} />
          </Box>
        )}

        {/* API error */}
        {!fetchLoading && error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px', fontFamily: 'Georgia, serif' }}>
            {error}
          </Alert>
        )}

        {/* Form — only rendered once task is loaded */}
        {!fetchLoading && fetchedTask && (
          <>
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

            <div style={{ marginBottom: '20px' }}>
              <Typography style={labelStyle}>Description</Typography>
              <TextField
                fullWidth multiline minRows={2} maxRows={4}
                placeholder="Add a description…"
                value={draft.description ?? ''}
                sx={fieldSx}
                onChange={(e) => handleChange('description', (e.target.value || null) as any)}
              />
            </div>

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

            <div>
              <Typography style={labelStyle}>Due Date</Typography>
              <TextField
                fullWidth size="small" type="date"
                value={draft.dueDate}
                sx={fieldSx}
                slotProps={{ inputLabel: { shrink: true } }}
                onChange={(e) => handleChange('dueDate', e.target.value)}
              />
            </div>
          </>
        )}
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
