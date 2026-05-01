import { CORAL } from '@/models/color';
import { makeStyles } from 'tss-react/mui';

export const useTaskStyles = makeStyles()({
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
  headerActions: { display: 'flex', alignItems: 'center', gap: '10px' },
  newTaskBtn: {
    backgroundColor: CORAL, color: '#fff', border: 'none',
    borderRadius: '8px', padding: '9px 20px', fontSize: '14px',
    fontWeight: 600, fontFamily: 'Georgia, serif', cursor: 'pointer',
  },
  filterChips: { display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginBottom: '16px' },

  // ── Table ────────────────────────────────────────────────────────────────────
  tableCard: {
    backgroundColor: '#fff', borderRadius: '14px',
    border: '1px solid #ebebeb', overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(0,0,0,0.05)', width: '100%',
  },
  // Task | Status | Priority | Due Date | Actions
  tableGrid: { gridTemplateColumns: '3fr 1.2fr 1.2fr 1.2fr 110px' },

  tableHead: {
    display: 'grid', padding: '10px 24px',
    borderBottom: '2px solid #f0f0f0', backgroundColor: '#fafafa',
  },
  thBtn: {
    display: 'flex', alignItems: 'center', gap: '5px',
    background: 'none', border: 'none', padding: 0,
    cursor: 'pointer', fontFamily: 'Georgia, serif',
    fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em',
    textTransform: 'uppercase' as const, color: '#999',
    userSelect: 'none' as const,
  },
  thBtnActive: { color: CORAL },

  // ── View row ─────────────────────────────────────────────────────────────────
  tableRow: {
    display: 'grid', padding: '12px 24px',
    alignItems: 'center', borderBottom: '1px solid #f5f5f5',
    transition: 'background 0.12s',
    '&:last-child': { borderBottom: 'none' },
    '&:hover': { backgroundColor: '#fafafa' },
  },
  taskName: {
    fontFamily: 'Georgia, serif', fontSize: '14px',
    color: '#1a1a1a', fontWeight: 500,
    whiteSpace: 'nowrap' as const, overflow: 'hidden',
    textOverflow: 'ellipsis', paddingRight: '12px',
  },
  chip: {
    fontFamily: 'Georgia, serif', fontSize: '12px',
    fontWeight: 600, border: 'none', width: 'fit-content', height: '24px',
  },
  dueDateNormal:  { fontFamily: 'Georgia, serif', fontSize: '13px', color: '#666' },
  dueDateOverdue: { fontFamily: 'Georgia, serif', fontSize: '13px', color: '#d32f2f', fontWeight: 600 },

  rowActions: { display: 'flex', alignItems: 'center', gap: '2px' },
  actionBtn: {
    padding: '5px', borderRadius: '6px',
    '&:hover': { backgroundColor: '#f5f5f5' },
  },

  // ── Empty ─────────────────────────────────────────────────────────────────────
  emptyState: {
    display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', justifyContent: 'center',
    padding: '72px 0', gap: '8px',
  },
  emptyEmoji:    { fontSize: '52px', marginBottom: '12px', lineHeight: 1 },
  emptyTitle:    { fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: '16px', color: '#333', margin: 0 },
  emptySubtitle: { fontFamily: 'Georgia, serif', fontSize: '13px', color: '#aaa', margin: 0 },
});
