import { createDraftSafeSelector, createSlice } from '@reduxjs/toolkit';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import { api } from '../../constants/api';
import http from '../../services/http';

import type { RootState } from '../../app/store';
import type { CreateTaskPayload, SortDirection, SortField, Task, TaskFilters, TasksPriority,UpdateTaskPayload } from '@/models/task';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Epic} from 'redux-observable';

export interface TaskState {
  tasks:     Task[];
  loading:   {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  },
  filters:   TaskFilters;
  sort: {
    field:     SortField;
    direction: SortDirection;
  };
  status: 'created' | 'updated' | 'deleted' | null;
  error:     string | null;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: TaskState = {
  tasks:   [],
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },
  status: null,
  error:   null,
  filters: {
    status:      [],
    priority:    [],
    dueDateFrom: null,
    dueDateTo:   null,
  },
  sort: {
    field:     'dueDate',
    direction: 'asc',
  },
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // ── Fetch ─────────────────────────────────────────────────────────────────
    fetchTasksRequest(state) {
      state.loading.list = true;
      state.error   = null;
    },
    fetchTasksSuccess(state, action: PayloadAction<Task[]>) {
      state.loading.list = false;
      state.tasks   = action.payload;
    },
    fetchTasksFailure(state, action: PayloadAction<string>) {
      state.loading.list = false;
      state.error   = action.payload;
    },

    // ── Create ────────────────────────────────────────────────────────────────
    createTaskRequest(state, _action: PayloadAction<CreateTaskPayload>) {
      state.loading.create = true;
      state.error   = null;
      state.status  = null;
    },
    createTaskSuccess(state, action: PayloadAction<Task>) {
      state.loading.create = false;
      state.status = 'created';
      state.tasks.push(action.payload);
    },
    createTaskFailure(state, action: PayloadAction<string>) {
      state.loading.create = false;
      state.error   = action.payload;
      state.status  = null;
    },

    // ── Update ────────────────────────────────────────────────────────────────
    updateTaskRequest(state, action: PayloadAction<UpdateTaskPayload>) {
      state.loading.update = true;
      state.error      = null;
      state.status  = null;
    },
    updateTaskSuccess(state) {
      state.loading.update = false;
      state.status = 'updated';
    },
    updateTaskFailure(state, action: PayloadAction<string>) {
      state.loading.update = false;
      state.error      = action.payload;
      state.status  = null;
    },
 
    // ── Delete ────────────────────────────────────────────────────────────────
    deleteTaskRequest(state, action: PayloadAction<{ id: Task['id']}>) {
      state.loading.delete = true;
      state.error      = null;
      state.status  = null;
    },
    deleteTaskSuccess(state) {
      state.loading.delete = false;
      state.status = 'deleted';
    },
    deleteTaskFailure(state, action: PayloadAction<string>) {
      state.loading.delete = false;
      state.error      = action.payload;
      state.status  = null;
    },

    // ── Sort ──────────────────────────────────────────────────────────────────
    setSort(state, action: PayloadAction<{ field: SortField; direction: SortDirection }>) {
      state.sort = action.payload;
    },

    clearTasksErrors(state) {
      state.error = initialState.error;
    },

    // ── Filters ───────────────────────────────────────────────────────────────
    setFilters(state, action: PayloadAction<Partial<TaskFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
  },
});

export const taskSliceActions = taskSlice.actions;
export default taskSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

const selectTaskState = (state: RootState): TaskState => state.tasks;

const PRIORITY_ORDER: Record<TasksPriority, number> = {
  CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1,
};

export const taskSelectors = {
  isLoading:   createDraftSafeSelector(selectTaskState, (s) => s.loading),
  getError:       createDraftSafeSelector(selectTaskState, (s) => s.error),
  filters:     createDraftSafeSelector(selectTaskState, (s) => s.filters),
  sort:        createDraftSafeSelector(selectTaskState, (s) => s.sort),
  getTaskStatus:        createDraftSafeSelector(selectTaskState, (s) => s.status),
  taskCount:   createDraftSafeSelector(selectTaskState, (s) => s.tasks.length),

  // Filtered + sorted tasks — memoized
  visibleTasks: createDraftSafeSelector(selectTaskState, (s) => {
    let result = [...s.tasks];

    // Filter
    if (s.filters.status.length)
      result = result.filter((t) => s.filters.status.includes(t.status));
    if (s.filters.priority.length)
      result = result.filter((t) => s.filters.priority.includes(t.priority));
    if (s.filters.dueDateFrom)
      result = result.filter((t) => t.dueDate >= s.filters.dueDateFrom!);
    if (s.filters.dueDateTo)
      result = result.filter((t) => t.dueDate <= s.filters.dueDateTo!);

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (s.sort.field === 'priority') {
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      } else if (s.sort.field === 'title') {
        cmp = a.title.localeCompare(b.title);
      } else if (s.sort.field === 'status') {
        cmp = a.status.localeCompare(b.status);
      } else {
        cmp = a.dueDate.localeCompare(b.dueDate);
      }
      return s.sort.direction === 'asc' ? cmp : -cmp;
    });

    return result;
  }),

  hasActiveFilters: createDraftSafeSelector(selectTaskState, (s) =>
    s.filters.status.length > 0 ||
    s.filters.priority.length > 0 ||
    s.filters.dueDateFrom !== null ||
    s.filters.dueDateTo !== null
  ),
};

// ─── Epics ────────────────────────────────────────────────────────────────────

const fetchTasksEpic: Epic = (action$) =>
  action$.pipe(
    ofType(taskSliceActions.fetchTasksRequest.type),
    switchMap(() =>
      from(http.get<Task[]>(api.tasks.getAll)).pipe(
        map((res) => taskSliceActions.fetchTasksSuccess(res.data)),
        catchError((error) => of(taskSliceActions.fetchTasksFailure(
          error?.response?.data?.message || 'Failed to load tasks.'
        )))
      )
    )
  );

const createTaskEpic: Epic = (action$) =>
  action$.pipe(
    ofType(taskSliceActions.createTaskRequest.type),
    switchMap(({ payload }: { type: string; payload: CreateTaskPayload }) =>
      from(http.post<Task>(api.tasks.create, payload)).pipe(
        map((res) => taskSliceActions.createTaskSuccess(res.data)),
        catchError((error) => of(taskSliceActions.createTaskFailure(
          error?.response?.data?.message || 'Failed to create task.'
        )))
      )
    )
  );

const updateTaskEpic: Epic = (action$) =>
  action$.pipe(
    ofType(taskSliceActions.updateTaskRequest.type),
    switchMap(({ payload }: { type: string; payload: UpdateTaskPayload }) =>
      from(http.put<Task>(api.tasks.update(payload.id), payload.data)).pipe(
        map(() => taskSliceActions.updateTaskSuccess()),
        catchError((err) => of(taskSliceActions.updateTaskFailure(
          err?.response?.data?.message || 'Failed to update task.'
        )))
      )
    )
  );
 
const deleteTaskEpic: Epic = (action$) =>
  action$.pipe(
    ofType(taskSliceActions.deleteTaskRequest.type),
    switchMap(({ payload }: { type: string; payload: { id: number } }) =>
      from(http.delete(api.tasks.delete(payload.id))).pipe(
        map(() => taskSliceActions.deleteTaskSuccess()),
        catchError((err) => of(taskSliceActions.deleteTaskFailure(
          err?.response?.data?.message || 'Failed to delete task.'
        )))
      )
    )
  );

export const taskEpics = combineEpics(fetchTasksEpic, createTaskEpic, updateTaskEpic, deleteTaskEpic);
