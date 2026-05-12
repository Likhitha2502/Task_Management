import { makeStyles } from 'tss-react/mui';

import { CORAL } from '@/models/color';

export const useProgressStyles = makeStyles()({
  root: { width: '100%' },

  pageHeader: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: '24px',
  },
  pageTitle: {
    fontFamily: 'Georgia, serif', fontWeight: 700,
    fontSize: '22px', color: '#1a1a1a',
    display: 'flex', alignItems: 'baseline', gap: '8px',
  },
  taskCount: { fontSize: '14px', color: '#aaa', fontWeight: 400 },

  // ── Two-column grid ───────────────────────────────────────────────────────────
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    alignItems: 'start',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },

  // ── Shared card ───────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#fff', borderRadius: '14px',
    border: '1px solid #ebebeb', overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    padding: '16px 24px', borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#fafafa',
  },
  cardTitle: {
    fontFamily: 'Georgia, serif', fontWeight: 700,
    fontSize: '13px', letterSpacing: '0.07em',
    textTransform: 'uppercase' as const, color: '#999',
  },
  cardBody: { padding: '24px' },

  // ── Pie chart card ────────────────────────────────────────────────────────────
  chartWrap: {
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', gap: '20px',
  },
  legend: {
    display: 'flex', flexDirection: 'column' as const,
    gap: '0px', width: '100%',
  },
  legendRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 0', borderBottom: '1px solid #f5f5f5',
    '&:last-child': { borderBottom: 'none' },
  },
  legendLabel: {
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  legendItem: {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontFamily: 'Georgia, serif', fontSize: '12px', color: '#555',
  },
  legendDot: {
    width: '12px', height: '12px', borderRadius: '3px', flexShrink: 0,
  },
  legendPct: {
    fontFamily: 'Georgia, serif', fontWeight: 700,
    fontSize: '20px', color: '#1a1a1a',
  },

  // ── Count card ────────────────────────────────────────────────────────────────
  countRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 0', borderBottom: '1px solid #f5f5f5',
    '&:last-child': { borderBottom: 'none' },
  },
  countLabel: {
    display: 'flex', alignItems: 'center', gap: '10px',
    fontFamily: 'Georgia, serif', fontSize: '14px', color: '#333',
  },
  countBadge: {
    width: '12px', height: '12px', borderRadius: '3px', flexShrink: 0,
  },
  countValue: {
    fontFamily: 'Georgia, serif', fontWeight: 700,
    fontSize: '20px', color: '#1a1a1a',
  },
  totalRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: '14px', marginTop: '6px',
    borderTop: `2px solid ${CORAL}20`,
  },
  totalLabel: {
    fontFamily: 'Georgia, serif', fontWeight: 700,
    fontSize: '13px', letterSpacing: '0.06em',
    textTransform: 'uppercase' as const, color: '#999',
  },
  totalValue: {
    fontFamily: 'Georgia, serif', fontWeight: 700,
    fontSize: '24px', color: CORAL,
  },

  // ── Loading / empty ───────────────────────────────────────────────────────────
  centered: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', padding: '56px',
  },
  emptyText: {
    fontFamily: 'Georgia, serif', fontSize: '14px', color: '#aaa',
  },
});
