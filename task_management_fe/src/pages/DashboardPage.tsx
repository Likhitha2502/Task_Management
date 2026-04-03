// src/pages/DashboardPage.tsx
import { AppLayout } from './AppLayout';
import { TaskLists } from './TasksList';
import { TasksProgress } from './TaskProgress';

type DashboardView = 'tasks' | 'progress';

type DashboardPageProps = {
  view: DashboardView;
};

export const DashboardPage = ({ view }: DashboardPageProps) => (
  <AppLayout>
    {view === 'tasks'    && <TaskLists />}
    {view === 'progress' && <TasksProgress />}
  </AppLayout>
);

export default DashboardPage;
