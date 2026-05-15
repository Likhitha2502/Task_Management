import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { boundActions, selectors } from '@/app/index';

import { useFocusTimerStyles } from './FocusTimerPage.styles';

export const FocusTimerPage = () => {
  const { classes } = useFocusTimerStyles();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [minutesError, setMinutesError] = useState('');

  const postStatus = useSelector(selectors.focusTimer.postStatus);
  const isLoading  = useSelector(selectors.focusTimer.isLoading);
  const error      = useSelector(selectors.focusTimer.error);

  useEffect(() => {
    if (postStatus === 'success') {
      boundActions.focusTimer.fetchFocusTimerRequest();
      const timer = setTimeout(() => boundActions.focusTimer.clearFocusTimerPostStatus(), 3000);
      return () => clearTimeout(timer);
    }
  }, [postStatus]);

  const validate = (): boolean => {
    if (hours === 0 && minutes <= 0) {
      setMinutesError('Please enter at least 1 minute when hours is set to 0.');
      return false;
    }
    if (minutes > 60) {
      setMinutesError('Minutes must be between 0 and 60.');
      return false;
    }
    setMinutesError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    boundActions.focusTimer.startFocusTimerRequest({ durationMinutes: hours * 60 + minutes });
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMinutes(isNaN(val) ? 0 : Math.min(60, Math.max(0, val)));
    if (minutesError) setMinutesError('');
  };

  return (
    <div className={classes.root}>
      <div className={classes.section}>
        <h2 className={classes.sectionTitle}>Focus Timer Settings</h2>
        <p className={classes.helperText}>A focus timer session cannot exceed 12 hours.</p>

        <div className={classes.formRow}>
          <span className={classes.timerLabel}>Timer:</span>

          {/* Hours dropdown */}
          <div className={classes.dropdownGroup}>
            <span className={classes.unitLabel}>Hours</span>
            <select
              className={classes.select}
              value={hours}
              onChange={(e) => {
                const h = Number(e.target.value);
                setHours(h);
                if (h === 12) setMinutes(0);
                setMinutesError('');
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
              type="number"
              className={classes.numberInput}
              value={minutes}
              min={0}
              max={60}
              onChange={handleMinutesChange}
              disabled={hours === 12}
              aria-label="Minutes"
            />
          </div>
        </div>

        {minutesError && <p className={classes.errorText}>{minutesError}</p>}
        {error && !minutesError && <p className={classes.errorText}>{error}</p>}
        {postStatus === 'success' && <p className={classes.successText}>Focus timer started!</p>}

        <button
          className={classes.submitBtn}
          onClick={handleSubmit}
          disabled={isLoading.post}
        >
          {isLoading.post ? 'Starting...' : 'Start Timer'}
        </button>
      </div>
    </div>
  );
};
