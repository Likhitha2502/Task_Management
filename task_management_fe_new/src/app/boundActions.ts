import { bindActionCreators } from '@reduxjs/toolkit';

import {
    authSliceActions
} from '../features/auth/authSlice';
import {
    focusTimerSliceActions
} from '../features/focusTimer/focusTimerSlice';
import {
    profileSliceActions
} from '../features/profile/profileSlice';
import {
    progressSliceActions
} from '../features/progress/progressSlice';
import {
    taskSliceActions
} from '../features/tasks/tasksSlice';
import {
    toastSliceActions
} from '../features/toast/toastSlice';
import { store } from './store';

export const boundActions = {
    auth: bindActionCreators(
        authSliceActions,
        store.dispatch
    ),
    focusTimer: bindActionCreators(
        focusTimerSliceActions,
        store.dispatch
    ),
    profile: bindActionCreators(
        profileSliceActions,
        store.dispatch
    ),
    progress: bindActionCreators(
        progressSliceActions,
        store.dispatch
    ),
    tasks: bindActionCreators(
        taskSliceActions,
        store.dispatch
    ),
    toast: bindActionCreators(
        toastSliceActions,
        store.dispatch
    ),
};
