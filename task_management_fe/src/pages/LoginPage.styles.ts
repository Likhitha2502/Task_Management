import { CSSProperties } from 'react';

// Page Wrapper (Full Screen Centering)
export const pageWrapperStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f9fafb',
  padding: '16px',
};

// The White Card (Paper)
export const cardStyle: CSSProperties = {
  padding: '48px',
  width: '100%',
  maxWidth: '450px',
  borderRadius: '16px',
  border: '1px solid #eaeaea',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  boxShadow: 'none', // Matches the flat look in your screenshot
};

// Logo & Header Styles
export const logoContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '32px',
};

export const headerContainerStyle: CSSProperties = {
  width: '100%',
  marginBottom: '32px',
  textAlign: 'center',
};

export const dividerStyle: CSSProperties = {
  height: '2px',
  backgroundColor: '#D35F55',
  width: '40%',
  margin: '8px auto 0 auto',
  border: 'none',
};

// Form Specific Styles
export const labelStyle: CSSProperties = {
  fontWeight: 'bold',
  marginBottom: '4px',
  display: 'block',
  color: '#333',
};

export const primaryButtonStyle: CSSProperties = {
  backgroundColor: '#D35F55',
  paddingTop: '12px',
  paddingBottom: '12px',
  borderRadius: '6px',
  fontWeight: 'bold',
  color: '#fff',
  textTransform: 'none',
  marginBottom: '16px',
};

export const forgotPasswordBtnStyle: CSSProperties = {
  color: '#757575',
  textTransform: 'none',
  fontSize: '0.8rem',
  padding: 0,
  minWidth: 'auto',
};
