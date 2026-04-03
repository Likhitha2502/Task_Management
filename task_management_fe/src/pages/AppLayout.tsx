import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boundActions } from '@/app/index';
import { useDashboardStyles } from './Dashboard.styles';
import { ROUTES } from '../constants/routes';

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { classes, cx } = useDashboardStyles();
  const navigate = useNavigate();
  const activeNav = location.pathname === ROUTES.tasks    ? 'tasks'
                  : location.pathname === ROUTES.progress ? 'progress'
                  : null;
  const [profileOpen, setProfileOpen] = useState(false);

  const currentUser = {
    firstName: 'Crysta',
    lastName: 'Stenne',
    email: 'crystastenne@gmail.com',
  };

  const initials = 'CS';

  const handleLogout = () => {
    boundActions.auth.logout();
    navigate(ROUTES.auth.login);
  };

  return (
    <div className={classes.root}>

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className={classes.sidebar}>

        {/* Logo — always navigates to tasks */}
        <div
          className={classes.logoRow}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(ROUTES.tasks)}
        >
          <div className={classes.logoAvatar}>F</div>
          <span className={classes.logoText}>FocusFlow</span>
        </div>

        <div className={classes.sidebarDivider} />
        <p className={classes.navLabel}>MY WORKSPACE</p>

        <nav className={classes.nav}>
          {/* My Tasks — highlighted when pathname === /tasks */}
          <button
            className={cx(classes.navItem, activeNav === 'tasks' && classes.navItemActive)}
            onClick={() => navigate(ROUTES.tasks)}
          >
            <span className={classes.navIcon}>☰</span>
            My Tasks
            <span className={classes.navBadge} style={{ opacity: activeNav === 'tasks' ? 1 : 0.5 }}>
              0
            </span>
          </button>

          {/* Progress — highlighted when pathname === /progress */}
          <button
            className={cx(classes.navItem, activeNav === 'progress' && classes.navItemActive)}
            onClick={() => navigate(ROUTES.progress)}
          >
            <span className={classes.navIcon}>▶</span>
            Progress
          </button>
        </nav>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div className={classes.main}>

        <header className={classes.header}>
          <div className={classes.headerSpacer} />

          {/* Profile dropdown */}
          <div className={classes.profileWrapper}>
            <button
              className={classes.profileBtn}
              onClick={() => setProfileOpen((o) => !o)}
            >
              <div className={classes.profileAvatar}>{initials}</div>
              <span className={classes.profileName}>{currentUser?.firstName ?? 'Account'}</span>
              <span style={{ fontSize: '10px', color: '#999', marginLeft: '2px' }}>▾</span>
            </button>

            {profileOpen && (
              <div className={classes.profileDropdown}>
                <div className={classes.dropdownHeader}>
                  <div className={classes.dropdownAvatar}>{initials}</div>
                  <div>
                    <p className={classes.dropdownName}>{currentUser?.firstName ?? '—'}</p>
                    <p className={classes.dropdownEmail}>{currentUser?.email ?? '—'}</p>
                  </div>
                </div>
                <div className={classes.dropdownDivider} />
                <button
                  className={classes.dropdownItem}
                  onClick={() => { setProfileOpen(false); navigate(ROUTES.userProfile); }}
                >
                  👤 View Profile
                </button>
                <button
                  className={classes.dropdownItem}
                  onClick={handleLogout}
                  style={{ color: '#d32f2f' }}
                >
                  ⎋ Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className={classes.content}>
          {children}
        </main>
      </div>

      {profileOpen && (
        <div className={classes.dropdownOverlay} onClick={() => setProfileOpen(false)} />
      )}
    </div>
  );
};
