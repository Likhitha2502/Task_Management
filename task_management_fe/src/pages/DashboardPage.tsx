// src/pages/DashboardPage.tsx
import { AppLayout } from './AppLayout';
import { TasksList } from './Tasks/TasksList';
import { TasksProgress } from './Progress/TaskProgress';

type DashboardView = 'tasks' | 'progress';

type DashboardPageProps = {
  view: DashboardView;
};

export const DashboardPage = ({ view }: DashboardPageProps) => (
  <AppLayout>
    {view === 'tasks'    && <TasksList />}
    {view === 'progress' && <TasksProgress />}
  </AppLayout>
);

export default DashboardPage;
