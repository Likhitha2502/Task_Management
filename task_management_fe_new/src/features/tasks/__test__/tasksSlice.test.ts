import {of } from 'rxjs';
import { toArray } from 'rxjs/operators';

import http from '../../../services/http';
import reducer, {
  taskEpics,
  taskSelectors,
  taskSliceActions
} from '../tasksSlice';

import type {
  CreateTaskPayload,
  Task,
  TaskFilters,
  UpdateTaskPayload,
} from '../../../models/task';
import type {
  TaskState} from '../tasksSlice';
import type { Observable} from 'rxjs';

import { beforeEach,describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../services/http', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedHttp = http as jest.Mocked<typeof http>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockTask: Task = {
  id: 1,
  title: 'Fix login bug',
  status: 'TODO',
  priority: 'HIGH',
  dueDate: '2026-06-01',
};

const mockTask2: Task = {
  id: 2,
  title: 'Add dashboard',
  status: 'IN_PROGRESS',
  priority: 'MEDIUM',
  dueDate: '2026-05-15',
};

const mockTask3: Task = {
  id: 3,
  title: 'Write tests',
  status: 'DONE',
  priority: 'LOW',
  dueDate: '2026-04-10',
};

const mockCreatePayload: CreateTaskPayload = {
  title: 'Fix login bug',
  status: 'TODO',
  priority: 'HIGH',
  dueDate: '2026-06-01',
};

const mockUpdatePayload: UpdateTaskPayload = {
  id: 1,
  data: { title: 'Fix login bug (updated)', status: 'IN_PROGRESS' },
};

const initialState: TaskState = {
  tasks: [],
  loading: {
    list: false,
    create: false,
    update: false,
    delete: false,
  },
  status: null,
  error: null,
  filters: {
    status: [],
    priority: [],
    dueDateFrom: null,
    dueDateTo: null,
  },
  sort: {
    field: 'dueDate',
    direction: 'asc',
  },
};

const makeRootState = (tasks: Partial<TaskState> = {}) => ({
  tasks: { ...initialState, ...tasks },
});

// ─── Reducer tests ────────────────────────────────────────────────────────────

describe('tasksSlice — reducer', () => {

  it('returns the initial state when called with undefined', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  // ── Fetch ──────────────────────────────────────────────────────────────────

  describe('fetchTasksRequest', () => {
    it('sets loading.list to true and clears error', () => {
      const state = reducer(
        { ...initialState, error: 'old error' },
        taskSliceActions.fetchTasksRequest()
      );
      expect(state.loading.list).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchTasksSuccess', () => {
    it('sets tasks array and clears loading.list', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, list: true } },
        taskSliceActions.fetchTasksSuccess([mockTask, mockTask2])
      );
      expect(state.loading.list).toBe(false);
      expect(state.tasks).toEqual([mockTask, mockTask2]);
    });
  });

  describe('fetchTasksFailure', () => {
    it('sets error and clears loading.list', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, list: true } },
        taskSliceActions.fetchTasksFailure('Failed to load tasks.')
      );
      expect(state.loading.list).toBe(false);
      expect(state.error).toBe('Failed to load tasks.');
    });
  });

  // ── Create ─────────────────────────────────────────────────────────────────

  describe('createTaskRequest', () => {
    it('sets loading.create to true, clears error and status', () => {
      const state = reducer(
        { ...initialState, error: 'old', status: 'deleted' },
        taskSliceActions.createTaskRequest(mockCreatePayload)
      );
      expect(state.loading.create).toBe(true);
      expect(state.error).toBeNull();
      expect(state.status).toBeNull();
    });
  });

  describe('createTaskSuccess', () => {
    it('appends task to list, sets status to created, clears loading.create', () => {
      const state = reducer(
        { ...initialState, tasks: [mockTask2], loading: { ...initialState.loading, create: true } },
        taskSliceActions.createTaskSuccess(mockTask)
      );
      expect(state.loading.create).toBe(false);
      expect(state.status).toBe('created');
      expect(state.tasks).toEqual([mockTask2, mockTask]);
    });
  });

  describe('createTaskFailure', () => {
    it('sets error, clears loading.create and status', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, create: true } },
        taskSliceActions.createTaskFailure('Failed to create task.')
      );
      expect(state.loading.create).toBe(false);
      expect(state.error).toBe('Failed to create task.');
      expect(state.status).toBeNull();
    });
  });

  // ── Update ─────────────────────────────────────────────────────────────────

  describe('updateTaskRequest', () => {
    it('sets loading.update to true, clears error and status', () => {
      const state = reducer(
        { ...initialState, error: 'old', status: 'created' },
        taskSliceActions.updateTaskRequest(mockUpdatePayload)
      );
      expect(state.loading.update).toBe(true);
      expect(state.error).toBeNull();
      expect(state.status).toBeNull();
    });
  });

  describe('updateTaskSuccess', () => {
    it('sets status to updated and clears loading.update', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, update: true } },
        taskSliceActions.updateTaskSuccess()
      );
      expect(state.loading.update).toBe(false);
      expect(state.status).toBe('updated');
    });
  });

  describe('updateTaskFailure', () => {
    it('sets error, clears loading.update and status', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, update: true } },
        taskSliceActions.updateTaskFailure('Failed to update task.')
      );
      expect(state.loading.update).toBe(false);
      expect(state.error).toBe('Failed to update task.');
      expect(state.status).toBeNull();
    });
  });

  // ── Delete ─────────────────────────────────────────────────────────────────

  describe('deleteTaskRequest', () => {
    it('sets loading.delete to true, clears error and status', () => {
      const state = reducer(
        { ...initialState, error: 'old', status: 'created' },
        taskSliceActions.deleteTaskRequest({ id: 1 })
      );
      expect(state.loading.delete).toBe(true);
      expect(state.error).toBeNull();
      expect(state.status).toBeNull();
    });
  });

  describe('deleteTaskSuccess', () => {
    it('sets status to deleted and clears loading.delete', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, delete: true } },
        taskSliceActions.deleteTaskSuccess()
      );
      expect(state.loading.delete).toBe(false);
      expect(state.status).toBe('deleted');
    });
  });

  describe('deleteTaskFailure', () => {
    it('sets error, clears loading.delete and status', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, delete: true } },
        taskSliceActions.deleteTaskFailure('Failed to delete task.')
      );
      expect(state.loading.delete).toBe(false);
      expect(state.error).toBe('Failed to delete task.');
      expect(state.status).toBeNull();
    });
  });

  // ── Sort ───────────────────────────────────────────────────────────────────

  describe('setSort', () => {
    it('updates sort field and direction', () => {
      const state = reducer(
        initialState,
        taskSliceActions.setSort({ field: 'priority', direction: 'desc' })
      );
      expect(state.sort).toEqual({ field: 'priority', direction: 'desc' });
    });
  });

  // ── Filters ────────────────────────────────────────────────────────────────

  describe('setFilters', () => {
    it('merges new filter values into existing filters', () => {
      const state = reducer(
        initialState,
        taskSliceActions.setFilters({ status: ['TODO', 'IN_PROGRESS'] })
      );
      expect(state.filters.status).toEqual(['TODO', 'IN_PROGRESS']);
      expect(state.filters.priority).toEqual([]);
    });
  });

  describe('clearFilters', () => {
    it('resets all filters to initial values', () => {
      const dirtyFilters: TaskFilters = {
        status: ['DONE'],
        priority: ['HIGH'],
        dueDateFrom: '2026-01-01',
        dueDateTo: '2026-12-31',
      };
      const state = reducer(
        { ...initialState, filters: dirtyFilters },
        taskSliceActions.clearFilters()
      );
      expect(state.filters).toEqual(initialState.filters);
    });
  });

  // ── clearTasksErrors ───────────────────────────────────────────────────────

  describe('clearTasksErrors', () => {
    it('sets error to null', () => {
      const state = reducer(
        { ...initialState, error: 'something went wrong' },
        taskSliceActions.clearTasksErrors()
      );
      expect(state.error).toBeNull();
    });

    it('is safe to call when error is already null', () => {
      const state = reducer(initialState, taskSliceActions.clearTasksErrors());
      expect(state.error).toBeNull();
    });
  });
});

// ─── Selector tests ───────────────────────────────────────────────────────────

describe('taskSelectors', () => {

  describe('isLoading', () => {
    it('returns all loading flags as false initially', () => {
      expect(taskSelectors.isLoading(makeRootState() as any)).toEqual({
        list: false, create: false, update: false, delete: false,
      });
    });
    it('returns correct state when list is loading', () => {
      expect(
        taskSelectors.isLoading(
          makeRootState({ loading: { list: true, create: false, update: false, delete: false } }) as any
        )
      ).toEqual({ list: true, create: false, update: false, delete: false });
    });
  });

  describe('getError', () => {
    it('returns null when no error', () => {
      expect(taskSelectors.getError(makeRootState() as any)).toBeNull();
    });
    it('returns error string when error is set', () => {
      expect(taskSelectors.getError(makeRootState({ error: 'oops' }) as any)).toBe('oops');
    });
  });

  describe('getTaskStatus', () => {
    it('returns null in initial state', () => {
      expect(taskSelectors.getTaskStatus(makeRootState() as any)).toBeNull();
    });
    it('returns created after task creation', () => {
      expect(taskSelectors.getTaskStatus(makeRootState({ status: 'created' }) as any)).toBe('created');
    });
    it('returns updated after task update', () => {
      expect(taskSelectors.getTaskStatus(makeRootState({ status: 'updated' }) as any)).toBe('updated');
    });
    it('returns deleted after task deletion', () => {
      expect(taskSelectors.getTaskStatus(makeRootState({ status: 'deleted' }) as any)).toBe('deleted');
    });
  });

  describe('taskCount', () => {
    it('returns 0 when no tasks', () => {
      expect(taskSelectors.taskCount(makeRootState() as any)).toBe(0);
    });
    it('returns correct count when tasks are loaded', () => {
      expect(
        taskSelectors.taskCount(makeRootState({ tasks: [mockTask, mockTask2, mockTask3] }) as any)
      ).toBe(3);
    });
  });

  describe('filters', () => {
    it('returns initial filters when unchanged', () => {
      expect(taskSelectors.filters(makeRootState() as any)).toEqual(initialState.filters);
    });
    it('returns updated filters when set', () => {
      const customFilters: TaskFilters = {
        status: ['TODO'],
        priority: ['HIGH'],
        dueDateFrom: '2026-01-01',
        dueDateTo: null,
      };
      expect(taskSelectors.filters(makeRootState({ filters: customFilters }) as any)).toEqual(customFilters);
    });
  });

  describe('sort', () => {
    it('returns default sort in initial state', () => {
      expect(taskSelectors.sort(makeRootState() as any)).toEqual({ field: 'dueDate', direction: 'asc' });
    });
    it('returns updated sort when set', () => {
      expect(
        taskSelectors.sort(makeRootState({ sort: { field: 'priority', direction: 'desc' } }) as any)
      ).toEqual({ field: 'priority', direction: 'desc' });
    });
  });

  describe('hasActiveFilters', () => {
    it('returns false when no filters are active', () => {
      expect(taskSelectors.hasActiveFilters(makeRootState() as any)).toBe(false);
    });
    it('returns true when status filter is active', () => {
      expect(
        taskSelectors.hasActiveFilters(
          makeRootState({ filters: { ...initialState.filters, status: ['TODO'] } }) as any
        )
      ).toBe(true);
    });
    it('returns true when priority filter is active', () => {
      expect(
        taskSelectors.hasActiveFilters(
          makeRootState({ filters: { ...initialState.filters, priority: ['HIGH'] } }) as any
        )
      ).toBe(true);
    });
    it('returns true when dueDateFrom filter is active', () => {
      expect(
        taskSelectors.hasActiveFilters(
          makeRootState({ filters: { ...initialState.filters, dueDateFrom: '2026-01-01' } }) as any
        )
      ).toBe(true);
    });
  });

  describe('visibleTasks', () => {
    const threeTasks = [mockTask, mockTask2, mockTask3];

    it('returns all tasks when no filters are set (sorted by dueDate asc)', () => {
      const result = taskSelectors.visibleTasks(
        makeRootState({ tasks: threeTasks }) as any
      );
      expect(result.map((t) => t.id)).toEqual([3, 2, 1]);
    });

    it('filters tasks by status', () => {
      const result = taskSelectors.visibleTasks(
        makeRootState({
          tasks: threeTasks,
          filters: { ...initialState.filters, status: ['TODO'] },
        }) as any
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('filters tasks by priority', () => {
      const result = taskSelectors.visibleTasks(
        makeRootState({
          tasks: threeTasks,
          filters: { ...initialState.filters, priority: ['HIGH', 'MEDIUM'] },
        }) as any
      );
      expect(result.map((t) => t.id)).toEqual(expect.arrayContaining([1, 2]));
      expect(result).toHaveLength(2);
    });

    it('filters tasks by dueDateFrom', () => {
      const result = taskSelectors.visibleTasks(
        makeRootState({
          tasks: threeTasks,
          filters: { ...initialState.filters, dueDateFrom: '2026-05-01' },
        }) as any
      );
      expect(result.map((t) => t.id)).toEqual(expect.arrayContaining([1, 2]));
      expect(result).toHaveLength(2);
    });

    it('filters tasks by dueDateTo', () => {
      const result = taskSelectors.visibleTasks(
        makeRootState({
          tasks: threeTasks,
          filters: { ...initialState.filters, dueDateTo: '2026-04-30' },
        }) as any
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    it('sorts tasks by title asc', () => {
      const result = taskSelectors.visibleTasks(
        makeRootState({
          tasks: threeTasks,
          sort: { field: 'title', direction: 'asc' },
        }) as any
      );
      expect(result[0].title).toBe('Add dashboard');
      expect(result[1].title).toBe('Fix login bug');
      expect(result[2].title).toBe('Write tests');
    });

    it('sorts tasks by priority desc (CRITICAL > HIGH > MEDIUM > LOW)', () => {
      const result = taskSelectors.visibleTasks(
        makeRootState({
          tasks: threeTasks,
          sort: { field: 'priority', direction: 'desc' },
        }) as any
      );
      expect(result[0].priority).toBe('HIGH');
      expect(result[1].priority).toBe('MEDIUM');
      expect(result[2].priority).toBe('LOW');
    });
  });
});

// ─── Epic tests ───────────────────────────────────────────────────────────────

const runEpic = (epic: any, action: any, state = initialState) => {
  const action$ = of(action);
  const state$  = of({ tasks: state }) as Observable<any>;
  return epic(action$, state$, {}).pipe(toArray()).toPromise() as Promise<any[]>;
};

describe('fetchTasksEpic', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('dispatches fetchTasksSuccess with tasks on success', async () => {
    mockedHttp.get.mockResolvedValueOnce({ data: [mockTask, mockTask2] });

    const actions = await runEpic(taskEpics, taskSliceActions.fetchTasksRequest());

    expect(mockedHttp.get).toHaveBeenCalledWith('/tasks');
    expect(actions).toEqual([taskSliceActions.fetchTasksSuccess([mockTask, mockTask2])]);
  });

  it('dispatches fetchTasksFailure with BE message on API error', async () => {
    mockedHttp.get.mockRejectedValueOnce({
      response: { data: { message: 'Unauthorized' } },
    });

    const actions = await runEpic(taskEpics, taskSliceActions.fetchTasksRequest());

    expect(actions).toEqual([taskSliceActions.fetchTasksFailure('Unauthorized')]);
  });

  it('dispatches fetchTasksFailure with fallback message on network error', async () => {
    mockedHttp.get.mockRejectedValueOnce(new Error('Network Error'));

    const actions = await runEpic(taskEpics, taskSliceActions.fetchTasksRequest());

    expect(actions).toEqual([taskSliceActions.fetchTasksFailure('Failed to load tasks.')]);
  });
});

describe('createTaskEpic', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('dispatches createTaskSuccess with created task on success', async () => {
    mockedHttp.post.mockResolvedValueOnce({ data: mockTask });

    const actions = await runEpic(taskEpics, taskSliceActions.createTaskRequest(mockCreatePayload));

    expect(mockedHttp.post).toHaveBeenCalledWith('/tasks', mockCreatePayload);
    expect(actions).toEqual([taskSliceActions.createTaskSuccess(mockTask)]);
  });

  it('dispatches createTaskFailure with BE message on API error', async () => {
    mockedHttp.post.mockRejectedValueOnce({
      response: { data: { message: 'Validation failed' } },
    });

    const actions = await runEpic(taskEpics, taskSliceActions.createTaskRequest(mockCreatePayload));

    expect(actions).toEqual([taskSliceActions.createTaskFailure('Validation failed')]);
  });

  it('dispatches createTaskFailure with fallback message on network error', async () => {
    mockedHttp.post.mockRejectedValueOnce(new Error('Network Error'));

    const actions = await runEpic(taskEpics, taskSliceActions.createTaskRequest(mockCreatePayload));

    expect(actions).toEqual([taskSliceActions.createTaskFailure('Failed to create task.')]);
  });
});

describe('updateTaskEpic', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('dispatches updateTaskSuccess on success', async () => {
    mockedHttp.put.mockResolvedValueOnce({ data: mockTask });

    const actions = await runEpic(taskEpics, taskSliceActions.updateTaskRequest(mockUpdatePayload));

    expect(mockedHttp.put).toHaveBeenCalledWith(`/tasks/${mockUpdatePayload.id}`, mockUpdatePayload.data);
    expect(actions).toEqual([taskSliceActions.updateTaskSuccess()]);
  });

  it('dispatches updateTaskFailure with BE message on API error', async () => {
    mockedHttp.put.mockRejectedValueOnce({
      response: { data: { message: 'Task not found' } },
    });

    const actions = await runEpic(taskEpics, taskSliceActions.updateTaskRequest(mockUpdatePayload));

    expect(actions).toEqual([taskSliceActions.updateTaskFailure('Task not found')]);
  });

  it('dispatches updateTaskFailure with fallback message on network error', async () => {
    mockedHttp.put.mockRejectedValueOnce(new Error('Network Error'));

    const actions = await runEpic(taskEpics, taskSliceActions.updateTaskRequest(mockUpdatePayload));

    expect(actions).toEqual([taskSliceActions.updateTaskFailure('Failed to update task.')]);
  });
});

describe('deleteTaskEpic', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('dispatches deleteTaskSuccess on success', async () => {
    mockedHttp.delete.mockResolvedValueOnce({});

    const actions = await runEpic(taskEpics, taskSliceActions.deleteTaskRequest({ id: 1 }));

    expect(mockedHttp.delete).toHaveBeenCalledWith('/tasks/1');
    expect(actions).toEqual([taskSliceActions.deleteTaskSuccess()]);
  });

  it('dispatches deleteTaskFailure with BE message on API error', async () => {
    mockedHttp.delete.mockRejectedValueOnce({
      response: { data: { message: 'Task not found' } },
    });

    const actions = await runEpic(taskEpics, taskSliceActions.deleteTaskRequest({ id: 1 }));

    expect(actions).toEqual([taskSliceActions.deleteTaskFailure('Task not found')]);
  });

  it('dispatches deleteTaskFailure with fallback message on network error', async () => {
    mockedHttp.delete.mockRejectedValueOnce(new Error('Network Error'));

    const actions = await runEpic(taskEpics, taskSliceActions.deleteTaskRequest({ id: 1 }));

    expect(actions).toEqual([taskSliceActions.deleteTaskFailure('Failed to delete task.')]);
  });
});
