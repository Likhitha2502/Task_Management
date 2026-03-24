import { styles } from "./Dashboard.styles";

export const TasksProgress = () => (
  <div style={styles.viewContainer}>
    <h2 style={styles.viewTitle}>Progress</h2>
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>📈</div>
      <p style={styles.emptyHeading}>Nothing to track yet</p>
      <p style={styles.emptySubtext}>Complete some tasks to see your progress</p>
    </div>
  </div>
);
