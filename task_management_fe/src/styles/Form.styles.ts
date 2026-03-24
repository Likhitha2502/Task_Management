import { CSSProperties } from 'react';

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
};

export const labelStyle: CSSProperties = {
  fontWeight: 'bold',
  marginBottom: '4px',
  fontFamily: 'Georgia, serif',
  fontSize: '14px',
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
};

export const dividerStyle: CSSProperties = {
  height: '2px',
  backgroundColor: '#D35F55',
  width: '40%',
  margin: '0 auto',
  border: 'none',
};

export const helperTextStyle: CSSProperties = {
  display: 'block',
  marginTop: '12px',
  color: '#666',
  fontSize: '12px',
  lineHeight: '1.4',
  textAlign: 'center',
};
