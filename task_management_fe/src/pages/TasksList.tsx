import { styles } from "./Dashboard.styles";

export const TaskLists = () => (
  <div style={styles.viewContainer}>
    <h2 style={styles.viewTitle}>All my tasks</h2>
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>📋</div>
      <p style={styles.emptyHeading}>No tasks yet</p>
      <p style={styles.emptySubtext}>Click "New Task" to get started</p>
    </div>
  </div>
);
