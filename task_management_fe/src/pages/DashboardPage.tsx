import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { boundActions } from '@/app/index';
import { selectors } from '@/app/selectors';
import { useDashboardStyles } from './Dashboard.styles';
import { TaskLists } from './TasksList';
import { TasksProgress } from './TaskProgress';
import { ChangePasswordModal } from '@/components/PasswordChangeModal';

type NavItem = 'tasks' | 'progress';

export const DashboardPage = () => {
    const { classes, cx } = useDashboardStyles();

    const [activeNav, setActiveNav] = useState<NavItem>('tasks');
    const [profileOpen, setProfileOpen] = useState(false);

    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const mustChangePassword = useSelector(selectors.auth.mustChangePassword);
    const loggedInUser = useSelector(selectors.auth.loggedInUser);

    const initials = 'UI';

    const handleLogout = () => {
        boundActions.auth.logout();
    };

    useEffect(() => {
        if (mustChangePassword) {
            setChangePasswordOpen(true);
        }
    }, [mustChangePassword]);

    return (
        <div className={classes.root}>

            <aside className={classes.sidebar}>
                <div className={classes.logoRow}>
                    <div className={classes.logoAvatar}>F</div>
                    <span className={classes.logoText}>FocusFlow</span>
                </div>

                <div className={classes.sidebarDivider} />

                <p className={classes.navLabel}>MY WORKSPACE</p>

                <nav className={classes.nav}>
                    <button
                        className={cx(classes.navItem, activeNav === 'tasks' && classes.navItemActive)}
                        onClick={() => setActiveNav('tasks')}
                    >
                        <span className={classes.navIcon}>☰</span>
                        My Tasks
                        <span className={classes.navBadge} style={{ opacity: activeNav === 'tasks' ? 1 : 0.5 }}>
                            0
                        </span>
                    </button>

                    <button
                        className={cx(classes.navItem, activeNav === 'progress' && classes.navItemActive)}
                        onClick={() => setActiveNav('progress')}
                    >
                        <span className={classes.navIcon}>▶</span>
                        Progress
                    </button>
                </nav>
            </aside>

            {/* ── Main area ─────────────────────────────────────────────────────── */}
            <div className={classes.main}>

                {/* Header */}
                <header className={classes.header}>
                    <div className={classes.headerSpacer} />

                    <button className={classes.newTaskBtn}>+ New Task</button>

                    {/* Profile dropdown */}
                    <div className={classes.profileWrapper}>
                        <button
                            className={classes.profileBtn}
                            onClick={() => setProfileOpen((o) => !o)}
                        >
                            <div className={classes.profileAvatar}>{initials}</div>
                            <span className={classes.profileName}>{'F' ?? 'Account'}</span>
                            <span style={{ fontSize: '10px', color: '#999', marginLeft: '2px' }}>▾</span>
                        </button>

                        {profileOpen && (
                            <div className={classes.profileDropdown}>
                                <div className={classes.dropdownHeader}>
                                    <div className={classes.dropdownAvatar}>{initials}</div>
                                    <div>
                                        <p className={classes.dropdownName}>{'—'}</p>
                                        <p className={classes.dropdownEmail}>{loggedInUser?.email ?? '—'}</p>
                                    </div>
                                </div>
                                <div className={classes.dropdownDivider} />
                                <button className={classes.dropdownItem}>⚙ Settings</button>
                                <button className={classes.dropdownItem} onClick={handleLogout}>
                                    ⎋ Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Content */}
                <main className={classes.content}>
                    {activeNav === 'tasks' && <TaskLists />}
                    {activeNav === 'progress' && <TasksProgress />}
                </main>
            </div>

            {/* Close dropdown on outside click */}
            {profileOpen && (
                <div className={classes.dropdownOverlay} onClick={() => setProfileOpen(false)} />
            )}

            <ChangePasswordModal
                open={changePasswordOpen}
                onClose={() => { if (!mustChangePassword) setChangePasswordOpen(false); }}
                forced={mustChangePassword}
            />
        </div>
    );
};

export default DashboardPage;
