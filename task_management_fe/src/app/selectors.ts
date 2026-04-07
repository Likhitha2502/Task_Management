// src/store/selectors.ts
import {
  selectors as authSelectors
} from '../features/auth/authSlice';
import {
  selectors as profileSelectors,
} from '../features/profile/profileSlice';

// Add more slice selectors as your app grows:
// import { selectAllTasks, selectTaskById, selectCompletedTasks } from './slices/taskSlice';

// ─── Selectors ────────────────────────────────────────────────────────────────
// Mirror the boundActions shape: selectors.sliceName.selectorName
// Usage in component: useSelector(selectors.auth.selectIsAuthenticated)

export const selectors = {
  auth: authSelectors,
  profile: profileSelectors,
  // tasks: {
  //   selectAllTasks,
  //   selectTaskById,
  //   selectCompletedTasks,
  // },
};
