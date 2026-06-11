import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  Alert, Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormHelperText, styled, TextField, Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { boundActions, selectors } from '@/app/index';
import { CORAL } from '@/models/color';

import { PRIORITIES, STATUSES, type Task, type TasksPriority, type TaskStatus } from '../../models/task';

// ─── Types ────────────────────────────────────────────────────────────────────

type EditableDraft = Omit<Task, 'id'>;

type FormValues = {
  title:       string;
  description: string;
  status:      TaskStatus | '';
  priority:    TasksPriority | '';
  dueDate:     string;
};

type EditTaskDialogProps = {
  taskId:  number | null;
  saving:  boolean;
  onSave:  (draft: EditableDraft) => void;
  onClose: () => void;
};

// ─── Validation ───────────────────────────────────────────────────────────────

const editTaskSchema = yup.object({
  title:       yup.string().trim().required('Title is required').max(255, 'Title must be 255 characters or less'),
  description: yup.string().nullable().max(255, 'Description must be 255 characters or less'),
  status:      yup.string().oneOf(STATUSES as string[], 'Status is required').required('Status is required'),
  priority:    yup.string().oneOf(PRIORITIES as string[], 'Priority is required').required('Priority is required'),
  dueDate:     yup.string().required('Due date is required'),
});

const EMPTY_FORM: FormValues = { title: '', description: '', status: '', priority: '', dueDate: '' };

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

const labelStyle: React.CSSProperties = {
  fontSize: '12px', fontWeight: 600, color: '#555',
  marginBottom: '6px', fontFamily: 'Georgia, serif',
  letterSpacing: '0.02em',
};

// ─── Component ────────────────────────────────────────────────────────────────

export const EditTaskDialog = ({ taskId, saving, onSave, onClose }: EditTaskDialogProps) => {
  const error        = useSelector(selectors.tasks.getError);
  const fetchedTask  = useSelector(selectors.tasks.fetchedTask);
  const fetchLoading = useSelector(selectors.tasks.fetchByIdLoading);

  const formik = useFormik<FormValues>({
    initialValues: EMPTY_FORM,
    validationSchema: editTaskSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      onSave({
        title:       values.title.trim(),
        description: values.description || null,
        status:      values.status as TaskStatus,
        priority:    values.priority as TasksPriority,
        dueDate:     values.dueDate,
      });
    },
  });

  useEffect(() => {
    if (taskId !== null) {
      boundActions.tasks.fetchTaskByIdRequest(taskId);
    }
    return () => { boundActions.tasks.clearFetchedTask(); };
  }, [taskId]);

  useEffect(() => {
    if (fetchedTask) {
      formik.resetForm({
        values: {
          title:       fetchedTask.title,
          description: fetchedTask.description ?? '',
          status:      fetchedTask.status,
          priority:    fetchedTask.priority,
          dueDate:     fetchedTask.dueDate,
        },
      });
      boundActions.tasks.clearTasksErrors();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedTask]);

  const handleClose = useCallback(() => {
    boundActions.tasks.clearFetchedTask();
    formik.resetForm();
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const saveDisabled = !fetchedTask || !formik.dirty || saving || fetchLoading;

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

        {fetchLoading && (
          <Box style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <CircularProgress size={28} style={{ color: CORAL }} />
          </Box>
        )}

        {!fetchLoading && error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px', fontFamily: 'Georgia, serif' }}>
            {error}
          </Alert>
        )}

        {!fetchLoading && fetchedTask && (
          <>
            {/* Title */}
            <div style={{ marginBottom: '20px' }}>
              <Typography style={labelStyle}>Task title</Typography>
              <TextField
                fullWidth size="small"
                placeholder="Enter task title"
                value={formik.values.title}
                sx={fieldSx}
                onChange={(e) => { formik.setFieldValue('title', e.target.value); boundActions.tasks.clearTasksErrors(); }}
                onBlur={formik.handleBlur('title')}
                error={formik.touched.title && Boolean(formik.errors.title)}
              />
              {formik.touched.title && formik.errors.title && (
                <FormHelperText error sx={{ fontFamily: 'Georgia, serif', ml: 0.5 }}>
                  {formik.errors.title}
                </FormHelperText>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <Typography style={labelStyle}>Description</Typography>
              <TextField
                fullWidth multiline minRows={2} maxRows={4}
                placeholder="Add a description…"
                value={formik.values.description}
                sx={fieldSx}
                onChange={(e) => formik.setFieldValue('description', e.target.value)}
              />
            </div>

            {/* Status + Priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <Typography style={labelStyle}>Status</Typography>
                <Autocomplete
                  options={STATUSES}
                  value={formik.values.status || null}
                  onChange={(_, val) => {
                    formik.setFieldValue('status', val ?? '');
                    formik.setFieldTouched('status', true);
                    boundActions.tasks.clearTasksErrors();
                  }}
                  onBlur={() => formik.setFieldTouched('status', true)}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select status"
                      sx={fieldSx}
                      error={formik.touched.status && Boolean(formik.errors.status)}
                    />
                  )}
                />
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText error sx={{ fontFamily: 'Georgia, serif', ml: 0.5 }}>
                    {formik.errors.status}
                  </FormHelperText>
                )}
              </div>

              <div>
                <Typography style={labelStyle}>Priority</Typography>
                <Autocomplete
                  options={PRIORITIES}
                  value={formik.values.priority || null}
                  onChange={(_, val) => {
                    formik.setFieldValue('priority', val ?? '');
                    formik.setFieldTouched('priority', true);
                    boundActions.tasks.clearTasksErrors();
                  }}
                  onBlur={() => formik.setFieldTouched('priority', true)}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select priority"
                      sx={fieldSx}
                      error={formik.touched.priority && Boolean(formik.errors.priority)}
                    />
                  )}
                />
                {formik.touched.priority && formik.errors.priority && (
                  <FormHelperText error sx={{ fontFamily: 'Georgia, serif', ml: 0.5 }}>
                    {formik.errors.priority}
                  </FormHelperText>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <Typography style={labelStyle}>Due Date</Typography>
              <TextField
                fullWidth size="small" type="date"
                value={formik.values.dueDate}
                sx={fieldSx}
                slotProps={{ inputLabel: { shrink: true } }}
                onChange={(e) => { formik.setFieldValue('dueDate', e.target.value); formik.setFieldTouched('dueDate', true); boundActions.tasks.clearTasksErrors(); }}
                onBlur={() => formik.setFieldTouched('dueDate', true)}
                error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
              />
              {formik.touched.dueDate && formik.errors.dueDate && (
                <FormHelperText error sx={{ fontFamily: 'Georgia, serif', ml: 0.5 }}>
                  {formik.errors.dueDate}
                </FormHelperText>
              )}
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
          onClick={() => formik.submitForm()}
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
