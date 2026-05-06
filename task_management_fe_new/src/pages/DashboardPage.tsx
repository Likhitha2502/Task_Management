// src/pages/DashboardPage.tsx
import { AppLayout } from './AppLayout';
import { TasksProgress } from './Progress/TaskProgress';
import { TasksList } from './Tasks/TasksList';

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
