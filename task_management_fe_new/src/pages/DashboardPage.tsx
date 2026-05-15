// src/pages/DashboardPage.tsx
import { AppLayout } from './AppLayout';
import { FocusTimerPage } from './FocusTimer/FocusTimerPage';
import { TasksProgress } from './Progress/TaskProgress';
import { TasksList } from './Tasks/TasksList';

type DashboardView = 'tasks' | 'progress' | 'focusTimer';

type DashboardPageProps = {
  view: DashboardView;
};

export const DashboardPage = ({ view }: DashboardPageProps) => (
  <AppLayout>
    {view === 'tasks'      && <TasksList />}
    {view === 'progress'   && <TasksProgress />}
    {view === 'focusTimer' && <FocusTimerPage />}
  </AppLayout>
);

export default DashboardPage;
