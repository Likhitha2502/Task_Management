// src/components/FilterDrawer/FilterDrawer.tsx
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Close } from '@mui/icons-material';
import {
Box, Button, Checkbox, Chip,
Divider,   Drawer, FormControlLabel,   FormGroup, IconButton, TextField,
Typography, } from '@mui/material';

import { boundActions, selectors } from '../../app/index';
import { CORAL,PRIORITY_COLORS, STATUS_COLORS } from '../../models/color';
import { PRIORITIES, STATUSES, type TaskFilters, type TasksPriority,type TaskStatus } from '../../models/task';

type Props = { open: boolean; onClose: () => void };

const EMPTY_FILTERS: TaskFilters = { status: [], priority: [], dueDateFrom: null, dueDateTo: null, titleSearch: null };

const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((v) => b.includes(v));

export const FilterDrawer = ({ open, onClose }: Props) => {
  const appliedFilters   = useSelector(selectors.tasks.filters);
  const hasActiveFilters = useSelector(selectors.tasks.hasActiveFilters);

  const [draft, setDraft] = useState<TaskFilters>(EMPTY_FILTERS);

  // Sync draft from Redux whenever the drawer opens
  useEffect(() => {
    if (open) setDraft(appliedFilters);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const titleSearchValid = !draft.titleSearch || draft.titleSearch.length >= 3;

  const draftIsDirty =
    !arraysEqual(draft.status, appliedFilters.status) ||
    !arraysEqual(draft.priority, appliedFilters.priority) ||
    draft.dueDateFrom  !== appliedFilters.dueDateFrom ||
    draft.dueDateTo    !== appliedFilters.dueDateTo   ||
    draft.titleSearch  !== appliedFilters.titleSearch;

  const toggleStatus = useCallback((status: TaskStatus) => {
    setDraft((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  }, []);

  const togglePriority = useCallback((priority: TasksPriority) => {
    setDraft((prev) => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter((p) => p !== priority)
        : [...prev.priority, priority],
    }));
  }, []);

  const handleApply = useCallback(() => {
    boundActions.tasks.setFilters(draft);
    onClose();
  }, [draft, onClose]);

  // Clears both the Redux-applied filters and the local draft
  const handleReset = useCallback(() => {
    boundActions.tasks.clearFilters();
    setDraft(EMPTY_FILTERS);
  }, []);

  const sectionLabel: React.CSSProperties = {
    fontFamily: 'Georgia, serif', fontWeight: 700,
    fontSize: '12px', color: '#aaa', letterSpacing: '0.08em',
    marginBottom: '12px', textTransform: 'uppercase',
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      slotProps={{ paper: { style: { width: 300, padding: '24px', display: 'flex', flexDirection: 'column', gap: '0' } } }}
    >
      {/* Header */}
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '17px', color: '#1a1a1a' }}>
          Filter Tasks
        </Typography>
        <Box style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {hasActiveFilters && (
            <Button size="small" onClick={handleReset}
              style={{ color: CORAL, fontFamily: 'Georgia, serif', textTransform: 'none', fontSize: '12px' }}>
              Reset Filters
            </Button>
          )}
          <IconButton size="small" onClick={onClose} style={{ color: '#999' }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Status */}
      <Typography style={sectionLabel}>Status</Typography>
      <FormGroup style={{ marginBottom: '24px' }}>
        {STATUSES.map((status) => (
          <FormControlLabel key={status}
            control={
              <Checkbox
                checked={draft.status.includes(status)}
                onChange={() => toggleStatus(status)}
                size="small"
                sx={{ color: '#ddd', '&.Mui-checked': { color: CORAL } }}
              />
            }
            label={
              <Chip label={status} size="small"
                style={{
                  backgroundColor: `${STATUS_COLORS[status].bg}18`,
                  color: STATUS_COLORS[status].color,
                  fontFamily: 'Georgia, serif', fontSize: '12px',
                  fontWeight: 600, border: 'none',
                }}
              />
            }
          />
        ))}
      </FormGroup>

      <Divider style={{ marginBottom: '24px' }} />

      {/* Priority */}
      <Typography style={sectionLabel}>Priority</Typography>
      <FormGroup style={{ marginBottom: '24px' }}>
        {PRIORITIES.map((priority) => (
          <FormControlLabel key={priority}
            control={
              <Checkbox
                checked={draft.priority.includes(priority)}
                onChange={() => togglePriority(priority)}
                size="small"
                sx={{ color: '#ddd', '&.Mui-checked': { color: CORAL } }}
              />
            }
            label={
              <Chip label={priority} size="small"
                style={{
                  backgroundColor: `${PRIORITY_COLORS[priority].bg}18`,
                  color: PRIORITY_COLORS[priority].color,
                  fontFamily: 'Georgia, serif', fontSize: '12px',
                  fontWeight: 600, border: 'none',
                }}
              />
            }
          />
        ))}
      </FormGroup>

      <Divider style={{ marginBottom: '24px' }} />

      {/* Due Date Range */}
      <Typography style={sectionLabel}>Due Date Range</Typography>
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        <Box>
          <Typography style={{ fontFamily: 'Georgia, serif', fontSize: '11px', color: '#999', marginBottom: '4px' }}>
            From
          </Typography>
          <TextField fullWidth size="small" type="date"
            value={draft.dueDateFrom ?? ''}
            onChange={(e) => setDraft((prev) => ({ ...prev, dueDateFrom: e.target.value || null }))}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px' } }}
          />
        </Box>
        <Box>
          <Typography style={{ fontFamily: 'Georgia, serif', fontSize: '11px', color: '#999', marginBottom: '4px' }}>
            To
          </Typography>
          <TextField fullWidth size="small" type="date"
            value={draft.dueDateTo ?? ''}
            onChange={(e) => setDraft((prev) => ({ ...prev, dueDateTo: e.target.value || null }))}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px' } }}
          />
        </Box>
      </Box>

      <Divider style={{ marginBottom: '24px' }} />

      {/* Title search */}
      <Typography style={sectionLabel}>Title</Typography>
      <TextField
        fullWidth size="small"
        placeholder="Search by title…"
        value={draft.titleSearch ?? ''}
        onChange={(e) => setDraft((prev) => ({ ...prev, titleSearch: e.target.value || null }))}
        error={!titleSearchValid}
        helperText={!titleSearchValid ? 'Enter at least 3 characters' : ''}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px', fontFamily: 'Georgia, serif' }, marginBottom: '32px' }}
      />

      {/* Apply */}
      <Button fullWidth variant="contained" onClick={handleApply} disabled={!draftIsDirty || !titleSearchValid}
        style={{
          backgroundColor: (draftIsDirty && titleSearchValid) ? CORAL : '#e0e0e0',
          color: (draftIsDirty && titleSearchValid) ? '#fff' : '#aaa',
          borderRadius: '8px', textTransform: 'none',
          fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: '14px',
        }}
      >
        Apply Filters
      </Button>
    </Drawer>
  );
};
