import { makeStyles } from 'tss-react/mui';

export const useLoginPageStyles = makeStyles({ name: 'LoginPage' })({
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: '16px',
  },

  card: {
    padding: '48px',
    width: '100%',
    maxWidth: '450px',
    borderRadius: '16px',
    border: '1px solid #eaeaea',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    boxShadow: 'none',
  },

  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '32px',
  },

  logoAvatar: {
    backgroundColor: '#D35F55',
    borderRadius: '12px',
    marginRight: '12px',
  },

  logoTitleTypography: {
    fontWeight: 600,
    fontFamily: 'Georgia, serif',
  },

  headerAccentTypography: {
    color: '#D35F55',
    fontWeight: 'bold',
  },

  footerCaption: {
    marginTop: '32px',
    color: '#757575',
    textAlign: 'center',
  },

  headerContainer: {
    width: '100%',
    marginBottom: '32px',
    textAlign: 'center',
  },

  divider: {
    height: '2px',
    backgroundColor: '#D35F55',
    width: '40%',
    margin: '8px auto 0 auto',
    border: 'none',
  },

  label: {
    fontWeight: 'bold',
    marginBottom: '4px',
    display: 'block',
    color: '#333',
  },

  primaryButton: {
    backgroundColor: '#D35F55',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'none',
    marginBottom: '16px',
  },

  /** Compose with primaryButton for the secondary CTA (no bottom margin). */
  primaryButtonFlush: {
    marginBottom: 0,
  },

  forgotPasswordButton: {
    color: '#757575',
    textTransform: 'none',
    fontSize: '0.8rem',
    padding: 0,
    minWidth: 'auto',
  },
});
