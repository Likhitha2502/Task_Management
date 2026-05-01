import { bindActionCreators } from '@reduxjs/toolkit';
import { store } from './store';

import {
    authSliceActions
} from '../features/auth/authSlice';
import {
    profileSliceActions
} from '../features/profile/profileSlice';
import {
    taskSliceActions
} from '../features/tasks/tasksSlice';

export const boundActions = {
    auth: bindActionCreators(
        authSliceActions,
        store.dispatch
    ),
    profile: bindActionCreators(
        profileSliceActions,
        store.dispatch
    ),
    tasks: bindActionCreators(
        taskSliceActions,
        store.dispatch
    )
};
