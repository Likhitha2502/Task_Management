import { boundActions, selectors } from "@/app/index";
import { useState } from "react";
import { useSelector } from "react-redux";
import { styles } from "./Dashboard.styles";
import { TaskLists } from "./TasksList";
import { TasksProgress } from "./TaskProgress";

type NavItem = 'tasks' | 'progress';

export const DashboardPage = () => {
    const [activeNav, setActiveNav] = useState<NavItem>('tasks');
    const [profileOpen, setProfileOpen] = useState(false);

    //const currentUser = useSelector(selectors.auth.getCurrentUser);
    const currentUser = {
        firstName: 'user',
        lastName: 'one',
        emailAddress: 'userone@a.com',
    };
    // Derive initials from username for avatar
    const initials = currentUser
        ? `${currentUser?.firstName.toUpperCase().slice(0, 2)}${currentUser?.lastName.toUpperCase().slice(0, 2)}`
        : 'U';

    const handleLogout = () => {
        boundActions.auth.logout();
        // Replace with: navigate('/login')
    };

    return (
        <div style={styles.root}>

            {/* ── Sidebar ─────────────────────────────────────────────────────── */}
            <aside style={styles.sidebar}>
                {/* Logo */}
                <div style={styles.logoRow}>
                    <div style={styles.logoAvatar}>F</div>
                    <span style={styles.logoText}>FocusFlow</span>
                </div>

                <div style={styles.sidebarDivider} />

                {/* Nav section label */}
                <p style={styles.navLabel}>MY WORKSPACE</p>

                {/* Nav items */}
                <nav style={styles.nav}>
                    <button
                        style={{
                            ...styles.navItem,
                            ...(activeNav === 'tasks' ? styles.navItemActive : {}),
                        }}
                        onClick={() => setActiveNav('tasks')}
                    >
                        <span style={styles.navIcon}>☰</span>
                        My Tasks
                        <span style={{
                            ...styles.navBadge,
                            opacity: activeNav === 'tasks' ? 1 : 0.5,
                        }}>
                            0
                        </span>
                    </button>

                    <button
                        style={{
                            ...styles.navItem,
                            ...(activeNav === 'progress' ? styles.navItemActive : {}),
                        }}
                        onClick={() => setActiveNav('progress')}
                    >
                        <span style={styles.navIcon}>▶</span>
                        Progress
                    </button>
                </nav>
            </aside>

            {/* ── Main area ───────────────────────────────────────────────────── */}
            <div style={styles.main}>

                {/* Header */}
                <header style={styles.header}>
                    <div style={styles.headerSpacer} />

                    {/* New Task button */}
                    <button style={styles.newTaskBtn}>
                        + New Task
                    </button>

                    {/* Profile dropdown */}
                    <div style={styles.profileWrapper}>
                        <button
                            style={styles.profileBtn}
                            onClick={() => setProfileOpen((o) => !o)}
                        >
                            <div style={styles.profileAvatar}>{initials}</div>
                            <span style={styles.profileName}>{currentUser?.firstName ?? 'Account'}</span>
                            <span style={{ fontSize: '10px', color: '#999', marginLeft: '2px' }}>▾</span>
                        </button>

                        {profileOpen && (
                            <div style={styles.profileDropdown}>
                                <div style={styles.dropdownHeader}>
                                    <div style={styles.dropdownAvatar}>{initials}</div>
                                    <div>
                                        <p style={styles.dropdownName}>{currentUser?.firstName ?? '—'}</p>
                                        <p style={styles.dropdownEmail}>{currentUser?.emailAddress ?? '—'}</p>
                                    </div>
                                </div>
                                <div style={styles.dropdownDivider} />
                                <button style={styles.dropdownItem}>⚙ Settings</button>
                                <button style={styles.dropdownItem} onClick={handleLogout}>
                                    ⎋ Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content */}
                <main style={styles.content}>
                    {activeNav === 'tasks' && <TaskLists />}
                    {activeNav === 'progress' && <TasksProgress />}
                </main>
            </div>

            {/* Close dropdown on outside click */}
            {profileOpen && (
                <div
                    style={styles.dropdownOverlay}
                    onClick={() => setProfileOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardPage;
