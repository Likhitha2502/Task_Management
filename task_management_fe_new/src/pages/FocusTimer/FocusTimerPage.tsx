import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { boundActions, selectors } from '@/app/index';

import { useFocusTimerStyles } from './FocusTimerPage.styles';

const parseMins = (s: string) => (s === '' ? 0 : parseInt(s, 10));

const timerSchema = yup.object({
  hours: yup.number(),
  minutes: yup
    .string()
    .test('max-59', 'Minutes must be between 0 and 59.', (val) => {
      if (!val) return true;
      const n = parseInt(val, 10);
      return n >= 0 && n <= 59;
    })
    .test('min-total', 'Minimum focus timer duration is 10 minutes.', function (val) {
      const { hours } = this.parent as { hours: number };
      return (hours ?? 0) * 60 + parseMins(val ?? '') >= 10;
    }),
});

export const FocusTimerPage = () => {
  const { classes } = useFocusTimerStyles();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const postStatus  = useSelector(selectors.focusTimer.postStatus);
  const isLoading   = useSelector(selectors.focusTimer.isLoading);
  const error       = useSelector(selectors.focusTimer.error);
  const timerStatus = useSelector(selectors.focusTimer.timerStatus);

  useEffect(() => {
    if (postStatus === 'success') {
      boundActions.focusTimer.fetchFocusTimerRequest();
      const timer = setTimeout(() => boundActions.focusTimer.clearFocusTimerPostStatus(), 3000);
      return () => clearTimeout(timer);
    }
  }, [postStatus]);

  const formik = useFormik({
    initialValues: { hours: 0, minutes: '10' },
    validationSchema: timerSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      if (timerStatus?.active) {
        setConfirmOpen(true);
        return;
      }
      boundActions.focusTimer.startFocusTimerRequest({
        durationMinutes: values.hours * 60 + parseMins(values.minutes),
      });
    },
  });

  const handleConfirm = () => {
    setConfirmOpen(false);
    boundActions.focusTimer.startFocusTimerRequest({
      durationMinutes: formik.values.hours * 60 + parseMins(formik.values.minutes),
    });
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!/^\d{0,2}$/.test(raw)) return;
    formik.setFieldValue('minutes', raw);
  };

  return (
    <div className={classes.root}>
      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>Focus Timer Settings</h2>
        <p className={classes.helperText}>Minimum session length is 10 minutes. Sessions cannot exceed 12 hours.</p>

        <div className={classes.formRow}>
          <span className={classes.timerLabel}>Timer:</span>

          {/* Hours dropdown */}
          <div className={classes.dropdownGroup}>
            <span className={classes.unitLabel}>Hours</span>
            <select
              className={classes.select}
              value={formik.values.hours}
              onChange={(e) => {
                const h = Number(e.target.value);
                formik.setFieldValue('hours', h);
                if (h === 12) formik.setFieldValue('minutes', '');
              }}
              aria-label="Hours"
            >
              {Array.from({ length: 13 }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          {/* Minutes text input */}
          <div className={classes.inputGroup}>
            <span className={classes.unitLabel}>Minutes</span>
            <input
              type="text"
              inputMode="numeric"
              className={classes.numberInput}
              placeholder="00"
              value={formik.values.minutes}
              onChange={handleMinutesChange}
              disabled={formik.values.hours === 12}
              aria-label="Minutes"
            />
          </div>
        </div>

        {formik.errors.minutes && <p className={classes.errorText}>{formik.errors.minutes as string}</p>}
        {error && !formik.errors.minutes && <p className={classes.errorText}>{error}</p>}
        {postStatus === 'success' && <p className={classes.successText}>Focus timer started!</p>}

        <button
          className={classes.submitBtn}
          onClick={() => formik.submitForm()}
          disabled={isLoading.post || !formik.isValid}
        >
          {isLoading.post ? 'Starting...' : 'Start Timer'}
        </button>
      </div>

      {/* ── Override confirmation dialog ──────────────────────────────────── */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, pb: 1 }}>
          Replace Active Focus Session?
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'Georgia, serif', color: '#444', lineHeight: 1.6 }}>
            You have a focus session currently in progress. Starting a new timer
            will immediately end the active session and replace it with the new
            duration. This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            color="inherit"
            sx={{ fontFamily: 'Georgia, serif', textTransform: 'none', borderColor: '#ddd', color: '#555' }}
          >
            Keep Current Session
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            autoFocus
            sx={{
              fontFamily: 'Georgia, serif',
              textTransform: 'none',
              backgroundColor: '#D35F55',
              '&:hover': { backgroundColor: '#be5249' },
            }}
          >
            Replace Session
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
