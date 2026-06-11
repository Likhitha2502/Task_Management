import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import {
  Alert, Autocomplete, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormHelperText, styled, TextField, Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { CORAL } from '@/models/color';

import { boundActions, selectors } from '../../app/index';
import { type CreateTaskPayload, PRIORITIES, STATUSES, type TasksPriority, type TaskStatus } from '../../models/task';

// ─── Validation ───────────────────────────────────────────────────────────────

const addTaskSchema = yup.object({
  title:       yup.string().trim().required('Task title is required').max(255, 'Title must be 255 characters or less'),
  description: yup.string().nullable().max(255, 'Description must be 255 characters or less'),
  status:      yup.string().oneOf(STATUSES as string[], 'Status is required').required('Status is required'),
  priority:    yup.string().oneOf(PRIORITIES as string[], 'Priority is required').required('Priority is required'),
  dueDate:     yup.string().required('Due date is required'),
});

type FormValues = {
  title:       string;
  description: string;
  status:      TaskStatus | '';
  priority:    TasksPriority | '';
  dueDate:     string;
};

const EMPTY_FORM: FormValues = {
  title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '',
};

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
    '&:hover fieldset':        { borderColor: CORAL },
    '&.Mui-focused fieldset':  { borderColor: CORAL },
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

  const formik = useFormik<FormValues>({
    initialValues: EMPTY_FORM,
    validationSchema: addTaskSchema,
    validateOnMount: true,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload: CreateTaskPayload = {
        title:       values.title.trim(),
        description: values.description || null,
        status:      values.status as TaskStatus,
        priority:    values.priority as TasksPriority,
        dueDate:     values.dueDate,
      };
      boundActions.tasks.createTaskRequest(payload);
      handleClose();
    },
  });

  const handleClose = useCallback(() => {
    formik.resetForm();
    boundActions.tasks.clearTasksErrors();
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const saveDisabled = loading || !formik.isValid;

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

        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <Typography id="add-title-label" style={labelStyle}>Task title</Typography>
          <TextField
            fullWidth size="small" placeholder="Enter task title"
            value={formik.values.title}
            sx={fieldSx}
            slotProps={{ htmlInput: { 'aria-labelledby': 'add-title-label' } }}
            onChange={(e) => { formik.setFieldValue('title', e.target.value); if (error) boundActions.tasks.clearTasksErrors(); }}
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
          <Typography id="add-description-label" style={labelStyle}>
            Description <span style={{ fontWeight: 400, color: '#bbb' }}>(optional)</span>
          </Typography>
          <TextField
            fullWidth multiline minRows={2} maxRows={4}
            placeholder="Add a description…"
            value={formik.values.description}
            sx={fieldSx}
            slotProps={{ htmlInput: { 'aria-labelledby': 'add-description-label' } }}
            onChange={(e) => formik.setFieldValue('description', e.target.value)}
          />
        </div>

        {/* Status + Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <Typography id="add-status-label" style={labelStyle}>Status</Typography>
            <Autocomplete
              options={STATUSES}
              value={formik.values.status || null}
              onChange={(_, val) => {
                formik.setFieldValue('status', val ?? '');
                formik.setFieldTouched('status', true);
                if (error) boundActions.tasks.clearTasksErrors();
              }}
              onBlur={() => formik.setFieldTouched('status', true)}
              size="small"
              renderInput={({ inputProps: acInputProps, ...params }) => (
                <TextField
                  {...params}
                  placeholder="Select status"
                  sx={fieldSx}
                  slotProps={{ htmlInput: { ...acInputProps, 'aria-labelledby': 'add-status-label' } }}
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
            <Typography id="add-priority-label" style={labelStyle}>Priority</Typography>
            <Autocomplete
              options={PRIORITIES}
              value={formik.values.priority || null}
              onChange={(_, val) => {
                formik.setFieldValue('priority', val ?? '');
                formik.setFieldTouched('priority', true);
                if (error) boundActions.tasks.clearTasksErrors();
              }}
              onBlur={() => formik.setFieldTouched('priority', true)}
              size="small"
              renderInput={({ inputProps: acInputProps, ...params }) => (
                <TextField
                  {...params}
                  placeholder="Select priority"
                  sx={fieldSx}
                  slotProps={{ htmlInput: { ...acInputProps, 'aria-labelledby': 'add-priority-label' } }}
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
          <Typography id="add-due-date-label" style={labelStyle}>Due Date</Typography>
          <TextField
            fullWidth size="small" type="date"
            value={formik.values.dueDate}
            sx={fieldSx}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { 'aria-labelledby': 'add-due-date-label' } }}
            onChange={(e) => {
              let value = e.target.value;
              if (value) {
                const [year, ...rest] = value.split('-');
                if (year.length > 4) value = [year.slice(0, 4), ...rest].join('-');
              }
              formik.setFieldValue('dueDate', value);
              formik.setFieldTouched('dueDate', true);
              if (error) boundActions.tasks.clearTasksErrors();
            }}
            onBlur={() => formik.setFieldTouched('dueDate', true)}
            error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
          />
          {formik.touched.dueDate && formik.errors.dueDate && (
            <FormHelperText error sx={{ fontFamily: 'Georgia, serif', ml: 0.5 }}>
              {formik.errors.dueDate}
            </FormHelperText>
          )}
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
          fullWidth variant="contained"
          onClick={() => formik.submitForm()}
          disabled={saveDisabled}
          style={{ fontFamily: 'Georgia, serif', backgroundColor: CORAL,
            textTransform: 'none', fontSize: '14px', borderRadius: '8px', fontWeight: 600 }}
        >
          {loading ? <CircularProgress size={18} style={{ color: '#fff' }} /> : 'Create Task'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
