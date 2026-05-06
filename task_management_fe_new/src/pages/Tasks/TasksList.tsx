import { useCallback,useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
ArrowDownward,
ArrowUpward, Delete,
  FilterList,   UnfoldMore, } from '@mui/icons-material';
import {
Badge,
  Box,   Button,
Chip, CircularProgress,
  IconButton, Tooltip, Typography, } from '@mui/material';

import { CORAL, CORAL_LIGHT, PRIORITY_COLORS, STATUS_COLORS } from '@/models/color';

import { boundActions, selectors } from '../../app/index';
import { AddTaskModal } from './AddTaskModal';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';
import { FilterDrawer } from './FilterDrawer';
import { useTaskStyles } from './tasks.styles';
import { formatDate, isOverdue } from './tasks.utils';

import type {
SortDirection,
SortField,   Task, } from '../../models/task';

type SelectedTask =
  | { mode: 'edit'; task: Task }
  | { mode: 'delete'; task: Task }
  | null;

const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => {
  if (!active) return <UnfoldMore style={{ fontSize: 13, color: '#ccc' }} />;
  return direction === 'asc'
    ? <ArrowUpward style={{ fontSize: 13, color: CORAL }} />
    : <ArrowDownward style={{ fontSize: 13, color: CORAL }} />;
};

export const TasksList = () => {
  const { classes, cx } = useTaskStyles();

  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<SelectedTask>(null);

  const tasks = useSelector(selectors.tasks.visibleTasks);
  const { list: loading, update: updateLoader, delete: deleteLoader } = useSelector(selectors.tasks.isLoading);
  const status = useSelector(selectors.tasks.getTaskStatus);
  const sort = useSelector(selectors.tasks.sort);
  const filters = useSelector(selectors.tasks.filters);
  const taskCount = useSelector(selectors.tasks.taskCount);
  const hasActiveFilters = useSelector(selectors.tasks.hasActiveFilters);

  useEffect(() => { boundActions.tasks.fetchTasksRequest(); }, []);

  // Close edit row when save completes
  useEffect(() => {
    if (status === 'updated') setSelectedTask(null);
  }, [status]);

  // Close delete dialog when delete completes
  useEffect(() => {
    if (status === 'deleted') setSelectedTask(null);
  }, [status]);

  const handleSort = useCallback((field: SortField) => {
    const direction: SortDirection =
      sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    boundActions.tasks.setSort({ field, direction });
  }, [sort]);

  const handleSaveEdit = useCallback((data: Partial<Omit<Task, 'id'>>) => {
    if (selectedTask?.mode !== 'edit') return;
    // Pass full task DTO — id from selectedTask, updated fields from EditRow draft
    boundActions.tasks.updateTaskRequest({ id: selectedTask.task.id, data });
  }, [selectedTask]);

  const handleConfirmDelete = useCallback(() => {
    if (selectedTask?.mode !== 'delete') return;
    // Pass only the id to the delete API
    boundActions.tasks.deleteTaskRequest({ id: selectedTask.task.id });
  }, [selectedTask]);

  const activeFilterCount =
    filters.status.length + filters.priority.length +
    (filters.dueDateFrom ? 1 : 0) + (filters.dueDateTo ? 1 : 0);

  const columns: { label: string; field: SortField }[] = [
    { label: 'Task', field: 'title' },
    { label: 'Status', field: 'status' },
    { label: 'Priority', field: 'priority' },
    { label: 'Due Date', field: 'dueDate' },
  ];

  return (
    <Box className={classes.root}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <Box className={classes.pageHeader}>
        <Typography component="h1" className={classes.pageTitle}>
          My tasks <span className={classes.taskCount}>{taskCount}</span>
        </Typography>
        <Box className={classes.headerActions}>
          <Tooltip title="Filter">
            <IconButton onClick={() => setFilterOpen(true)}
              style={{
                border: '1px solid #ebebeb', borderRadius: '8px', padding: '8px',
                backgroundColor: hasActiveFilters ? CORAL_LIGHT : '#fff',
                color: hasActiveFilters ? CORAL : '#666'
              }}>
              <Badge badgeContent={activeFilterCount || undefined} color="error"
                sx={{ '& .MuiBadge-badge': { fontSize: '10px', minWidth: '16px', height: '16px' } }}>
                <FilterList fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          <button className={classes.newTaskBtn} onClick={() => setNewTaskOpen(true)}>
            + New Task
          </button>
        </Box>
      </Box>

      {/* ── Active filter chips ────────────────────────────────────────────── */}
      {hasActiveFilters && (
        <Box className={classes.filterChips}>
          {filters.status.map((s) => (
            <Chip key={s} label={s} size="small"
              onDelete={() => boundActions.tasks.setFilters({ status: filters.status.filter((x) => x !== s) })}
              style={{
                fontFamily: 'Georgia, serif', fontSize: '12px',
                backgroundColor: STATUS_COLORS[s]?.bg, color: STATUS_COLORS[s]?.color
              }} />
          ))}
          {filters.priority.map((p) => (
            <Chip key={p} label={p} size="small"
              onDelete={() => boundActions.tasks.setFilters({ priority: filters.priority.filter((x) => x !== p) })}
              style={{
                fontFamily: 'Georgia, serif', fontSize: '12px',
                backgroundColor: PRIORITY_COLORS[p]?.bg, color: PRIORITY_COLORS[p]?.color
              }} />
          ))}
          {filters.dueDateFrom && (
            <Chip label={`From: ${formatDate(filters.dueDateFrom)}`} size="small"
              onDelete={() => boundActions.tasks.setFilters({ dueDateFrom: null })}
              style={{ fontFamily: 'Georgia, serif', fontSize: '12px' }} />
          )}
          {filters.dueDateTo && (
            <Chip label={`To: ${formatDate(filters.dueDateTo)}`} size="small"
              onDelete={() => boundActions.tasks.setFilters({ dueDateTo: null })}
              style={{ fontFamily: 'Georgia, serif', fontSize: '12px' }} />
          )}
        </Box>
      )}

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <Box className={classes.tableCard}>

        {/* Column headers */}
        <Box className={cx(classes.tableHead, classes.tableGrid)}>
          {columns.map(({ label, field }) => (
            <button key={field}
              className={cx(classes.thBtn, sort.field === field && classes.thBtnActive)}
              onClick={() => handleSort(field)}>
              {label}
              <SortIcon active={sort.field === field} direction={sort.direction} />
            </button>
          ))}
          <span /> {/* Actions col */}
        </Box>

        {/* Loading */}
        {loading && (
          <Box style={{ display: 'flex', justifyContent: 'center', padding: '56px' }}>
            <CircularProgress size={28} style={{ color: CORAL }} />
          </Box>
        )}

        {/* Empty state */}
        {!loading && tasks.length === 0 && (
          <Box className={classes.emptyState}>
            <div className={classes.emptyEmoji}>📋</div>
            <p className={classes.emptyTitle}>
              {hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet'}
            </p>
            <p className={classes.emptySubtitle}>
              {hasActiveFilters ? 'Try adjusting or clearing your filters' : 'Click "+ New Task" to get started'}
            </p>
          </Box>
        )}

        {/* Rows */}
        {!loading && tasks.map((task) => (
          // ── View row ──────────────────────────────────────────────────
          <Box key={task.id} className={cx(classes.tableRow, classes.tableGrid)}>
            <Typography className={classes.taskName}>{task.title}</Typography>

            <Chip label={task.status} size="small" className={classes.chip}
              style={{ backgroundColor: STATUS_COLORS[task.status]?.bg, color: STATUS_COLORS[task.status]?.color }} />

            <Chip label={task.priority} size="small" className={classes.chip}
              style={{ backgroundColor: PRIORITY_COLORS[task.priority]?.bg, color: PRIORITY_COLORS[task.priority]?.color }} />

            <Typography className={isOverdue(task.dueDate) ? classes.dueDateOverdue : classes.dueDateNormal}>
              {formatDate(task.dueDate)}
            </Typography>

            {/* Edit + Delete */}
            <Box className={classes.rowActions}>
              <Tooltip title="Edit">
                <Button size="small" className={classes.actionBtn}
                  onClick={() => setSelectedTask({ mode: 'edit', task })}>
                  Edit
                </Button>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" className={classes.actionBtn}
                  disabled={deleteLoader}
                  onClick={() => setSelectedTask({ mode: 'delete', task })}>
                  {deleteLoader
                    ? <CircularProgress size={14} style={{ color: '#d32f2f' }} />
                    : <Delete style={{ fontSize: 16, color: '#ccc' }} />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <AddTaskModal open={newTaskOpen} onClose={() => setNewTaskOpen(false)} />
      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />

      <EditTaskDialog
        task={selectedTask?.mode === 'edit' ? selectedTask.task : null}
        saving={updateLoader}
        onSave={handleSaveEdit}
        onClose={() => setSelectedTask(null)}
      />

      <DeleteTaskDialog
        task={selectedTask?.mode === 'delete' ? selectedTask.task : null}
        deleting={deleteLoader}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSelectedTask(null)}
      />
    </Box>
  );
};
