// src/components/FilterDrawer/FilterDrawer.tsx
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import {
Box, Button, Checkbox, Chip,
Divider,   Drawer, FormControlLabel,   FormGroup, TextField,
Typography, } from '@mui/material';

import { boundActions, selectors } from '../../app/index';
import { CORAL,PRIORITY_COLORS, STATUS_COLORS } from '../../models/color';
import { PRIORITIES, STATUSES, type TasksPriority,type TaskStatus } from '../../models/task';

type Props = { open: boolean; onClose: () => void };

export const FilterDrawer = ({ open, onClose }: Props) => {
  const filters        = useSelector(selectors.tasks.filters);
  const hasActiveFilters = useSelector(selectors.tasks.hasActiveFilters);

  const toggleStatus = useCallback((status: TaskStatus) => {
    const next = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    boundActions.tasks.setFilters({ status: next });
  }, [filters.status]);

  const togglePriority = useCallback((priority: TasksPriority) => {
    const next = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    boundActions.tasks.setFilters({ priority: next });
  }, [filters.priority]);

  const sectionLabel: React.CSSProperties = {
    fontFamily: 'Georgia, serif', fontWeight: 700,
    fontSize: '12px', color: '#aaa', letterSpacing: '0.08em',
    marginBottom: '12px', textTransform: 'uppercase',
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      PaperProps={{ style: { width: 300, padding: '24px', display: 'flex', flexDirection: 'column', gap: '0' } }}
    >
      {/* Header */}
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '17px', color: '#1a1a1a' }}>
          Filter Tasks
        </Typography>
        {hasActiveFilters && (
          <Button size="small" onClick={() => boundActions.tasks.clearFilters()}
            style={{ color: CORAL, fontFamily: 'Georgia, serif', textTransform: 'none', fontSize: '12px' }}>
            Clear all
          </Button>
        )}
      </Box>

      {/* Status */}
      <Typography style={sectionLabel}>Status</Typography>
      <FormGroup style={{ marginBottom: '24px' }}>
        {STATUSES.map((status) => (
          <FormControlLabel key={status}
            control={
              <Checkbox
                checked={filters.status.includes(status)}
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
                checked={filters.priority.includes(priority)}
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
            value={filters.dueDateFrom ?? ''}
            onChange={(e) => boundActions.tasks.setFilters({ dueDateFrom: e.target.value || null })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px' } }}
          />
        </Box>
        <Box>
          <Typography style={{ fontFamily: 'Georgia, serif', fontSize: '11px', color: '#999', marginBottom: '4px' }}>
            To
          </Typography>
          <TextField fullWidth size="small" type="date"
            value={filters.dueDateTo ?? ''}
            onChange={(e) => boundActions.tasks.setFilters({ dueDateTo: e.target.value || null })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px' } }}
          />
        </Box>
      </Box>

      {/* Apply */}
      <Button fullWidth variant="contained" onClick={onClose}
        style={{ backgroundColor: CORAL, color: '#fff', borderRadius: '8px',
          textTransform: 'none', fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: '14px' }}
      >
        Apply Filters
      </Button>
    </Drawer>
  );
};
