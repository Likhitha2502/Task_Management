import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { boundActions, selectors } from '@/app/index';

import { ROUTES } from '../constants/routes';
import { useDashboardStyles } from './Dashboard.styles';

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { classes, cx } = useDashboardStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const activeNav = location.pathname === ROUTES.tasks      ? 'tasks'
                  : location.pathname === ROUTES.progress   ? 'progress'
                  : location.pathname === ROUTES.focusTimer ? 'focusTimer'
                  : null;
  const [profileOpen, setProfileOpen] = useState(false);

  const currentUser  = useSelector(selectors.profile.userProfile);
  const timerStatus  = useSelector(selectors.focusTimer.timerStatus);
  const initials = currentUser?.firstName && currentUser?.lastName
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
    : 'U';

  useEffect(() => {
    boundActions.profile.fetchUserProfileRequest();
    boundActions.focusTimer.fetchFocusTimerRequest();
  }, []);

  const handleLogout = () => {
    boundActions.auth.logoutRequest();
  };

  return (
    <div className={classes.root}>
      {/* Keyframe for blinking focus timer button */}
      <style>{`
        @keyframes focusTimerPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
      `}</style>

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
          {/* My Tasks */}
          <button
            className={cx(classes.navItem, activeNav === 'tasks' && classes.navItemActive)}
            onClick={() => navigate(ROUTES.tasks)}
          >
            <span className={classes.navIcon}>☰</span>
            My Tasks
          </button>

          {/* Progress */}
          <button
            className={cx(classes.navItem, activeNav === 'progress' && classes.navItemActive)}
            onClick={() => navigate(ROUTES.progress)}
          >
            <span className={classes.navIcon}>▶</span>
            Progress
          </button>

          {/* Focus Timer */}
          <button
            className={cx(classes.navItem, activeNav === 'focusTimer' && classes.navItemActive)}
            onClick={() => navigate(ROUTES.focusTimer)}
          >
            <span className={classes.navIcon}>⏱</span>
            Focus Timer
          </button>
        </nav>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div className={classes.main}>

        <header className={classes.header}>
          <div className={classes.headerSpacer} />

          {/* Focus Timer status button */}
          <button
            className={cx(
              classes.focusTimerHeaderBtn,
              timerStatus?.active && classes.focusTimerHeaderBtnActive,
            )}
            onClick={() => navigate(ROUTES.focusTimer)}
            title={timerStatus?.active ? `Timer active · ${timerStatus.remainingMinutes} min` : 'Focus Timer'}
          >
            Focus Timer
          </button>

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
                  View Profile
                </button>
                <button
                  className={classes.dropdownItem}
                  onClick={handleLogout}
                  style={{ color: '#d32f2f' }}
                >
                  Sign out
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
