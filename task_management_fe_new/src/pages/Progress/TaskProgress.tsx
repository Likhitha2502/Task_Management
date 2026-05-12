import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Box, CircularProgress, Typography } from '@mui/material';

import { boundActions, selectors } from '../../app/index';
import { CORAL, PIE_COLORS, PIE_FALLBACK_PALETTE, STATUS_COLORS } from '../../models/color';
import { useProgressStyles } from './progress.styles';

import type { TaskCountData, TaskPercentData } from '../../features/progress/progressSlice';
import type { TaskStatus } from '@/models/task';

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────

const SIZE    = 220;
const CX      = SIZE / 2;
const CY      = SIZE / 2;
const OUTER_R = 86;
const INNER_R = 52;
const GAP_DEG = 1.5;

function toXY(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(startDeg: number, endDeg: number): string {
  const o1    = toXY(CX, CY, OUTER_R, startDeg);
  const o2    = toXY(CX, CY, OUTER_R, endDeg);
  const i1    = toXY(CX, CY, INNER_R, endDeg);
  const i2    = toXY(CX, CY, INNER_R, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    `A ${INNER_R} ${INNER_R} 0 ${large} 0 ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

// ─── Typed key arrays ─────────────────────────────────────────────────────────

const COUNT_KEYS: (keyof Omit<TaskCountData, 'totalTasks'>)[] = [
  'toDoTasks', 'inProgressTasks', 'inReviewTasks', 'completedTasks',
];

const PERCENT_KEYS: (keyof TaskPercentData)[] = [
  'toDoPercent', 'inProgressPercent', 'inReviewPercent', 'completedPercent',
];

const STATUS_LABEL: Record<string, string> = {
  toDoTasks:        'To Do',       toDoPercent:       'To Do',
  inProgressTasks:  'In Progress', inProgressPercent: 'In Progress',
  inReviewTasks:    'Review',   inReviewPercent:   'Review',
  completedTasks:   'Completed',   completedPercent:  'Completed',
};

const KEY_TO_STATUS: Record<string, TaskStatus> = {
  toDoTasks:        'TODO',        toDoPercent:       'TODO',
  inProgressTasks:  'IN_PROGRESS', inProgressPercent: 'IN_PROGRESS',
  inReviewTasks:    'REVIEW',      inReviewPercent:   'REVIEW',
  completedTasks:   'DONE',        completedPercent:  'DONE',
};

// ─── DonutChart ───────────────────────────────────────────────────────────────

interface DonutChartProps { data: Record<string, number> }

const DonutChart = ({ data }: DonutChartProps) => {
  const keys  = Object.keys(data);
  const total = keys.reduce((s, k) => s + data[k], 0);
  if (total === 0) return null;

  const slices: { key: string; startDeg: number; endDeg: number; color: string }[] = [];
  let cursor = 0;

  keys.forEach((key, idx) => {
    const value = data[key];
    if (value === 0) return;
    const sweep    = (value / total) * 360;
    const startDeg = cursor + GAP_DEG / 2;
    const endDeg   = cursor + sweep - GAP_DEG / 2;
    const color    = PIE_COLORS[key] ?? PIE_FALLBACK_PALETTE[idx % PIE_FALLBACK_PALETTE.length];
    slices.push({ key, startDeg, endDeg, color });
    cursor += sweep;
  });

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      {slices.map(({ key, startDeg, endDeg, color }) => (
        <path key={key} d={slicePath(startDeg, endDeg)} fill={color} opacity={0.88} />
      ))}
      <text
        x={CX} y={CY}
        textAnchor="middle" dominantBaseline="central"
        style={{ fontFamily: 'Georgia, serif', fontSize: '13px', fontWeight: 600, fill: '#888', letterSpacing: '0.08em' }}
      >
        TASK
      </text>
    </svg>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const TasksProgress = () => {
  const { classes } = useProgressStyles();

  const count   = useSelector(selectors.progress.getCount);
  const percent = useSelector(selectors.progress.getPercent);
  const loading = useSelector(selectors.progress.isLoading);
  const total   = useSelector(selectors.progress.total);

  useEffect(() => {
    boundActions.progress.fetchCountRequest();
    boundActions.progress.fetchPercentRequest();
  }, []);

  // Build ordered percent data for DonutChart (preserves PERCENT_KEYS order)
  const pieData: Record<string, number> = percent
    ? PERCENT_KEYS.reduce<Record<string, number>>((acc, k) => { acc[k] = percent[k]; return acc; }, {})
    : {};

  return (
    <Box className={classes.root}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <Box className={classes.pageHeader}>
        <Typography component="h1" className={classes.pageTitle}>
          Task Progress
        </Typography>
      </Box>

      {/* ── Two-column grid ───────────────────────────────────────────────── */}
      <Box className={classes.grid}>

        {/* ── Left: Donut Chart ─────────────────────────────────────────── */}
        <Box className={classes.card}>
          <Box className={classes.cardHeader}>
            <Typography className={classes.cardTitle}>Distribution</Typography>
          </Box>
          <Box className={classes.cardBody}>
            {loading.percent ? (
              <Box className={classes.centered}>
                <CircularProgress size={28} style={{ color: CORAL }} />
              </Box>
            ) : !percent ? (
              <Box className={classes.centered}>
                <Typography className={classes.emptyText}>No data yet</Typography>
              </Box>
            ) : (
              <Box className={classes.chartWrap}>
                <DonutChart data={pieData} />
                <Box className={classes.legend}>
                  {PERCENT_KEYS.map((key, idx) => {
                    const statusKey = KEY_TO_STATUS[key];
                    const bg        = STATUS_COLORS[statusKey]?.bg    ?? '#f5f5f5';
                    const chipColor = STATUS_COLORS[statusKey]?.color ?? '#333';
                    const dotColor  = PIE_COLORS[key] ?? PIE_FALLBACK_PALETTE[idx % PIE_FALLBACK_PALETTE.length];
                    const pct       = percent[key];
                    const pctLabel  = pct % 1 !== 0 ? pct.toFixed(1) : pct;
                    return (
                      <Box key={key} className={classes.legendRow}>
                        <Box className={classes.legendLabel}>
                          <span className={classes.legendDot} style={{ backgroundColor: dotColor }} />
                          <span style={{
                            backgroundColor: bg, color: chipColor,
                            padding: '2px 10px', borderRadius: '20px',
                            fontFamily: 'Georgia, serif', fontSize: '12px', fontWeight: 600,
                          }}>
                            {STATUS_LABEL[key]}
                          </span>
                        </Box>
                        <Typography className={classes.legendPct}>{pctLabel}%</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Right: Count by Status ────────────────────────────────────── */}
        <Box className={classes.card}>
          <Box className={classes.cardHeader}>
            <Typography className={classes.cardTitle}>Tasks by Status</Typography>
          </Box>
          <Box className={classes.cardBody}>
            {loading.count ? (
              <Box className={classes.centered}>
                <CircularProgress size={28} style={{ color: CORAL }} />
              </Box>
            ) : !count ? (
              <Box className={classes.centered}>
                <Typography className={classes.emptyText}>No data yet</Typography>
              </Box>
            ) : (
              <>
                {COUNT_KEYS.map((key) => {
                  const statusKey = KEY_TO_STATUS[key];
                  const bg    = STATUS_COLORS[statusKey]?.bg    ?? '#f5f5f5';
                  const color = STATUS_COLORS[statusKey]?.color ?? '#333';
                  return (
                    <Box key={key} className={classes.countRow}>
                      <Box className={classes.countLabel}>
                        <span className={classes.countBadge} style={{ backgroundColor: color, opacity: 0.85 }} />
                        <span style={{
                          backgroundColor: bg, color,
                          padding: '2px 10px', borderRadius: '20px',
                          fontFamily: 'Georgia, serif', fontSize: '12px', fontWeight: 600,
                        }}>
                          {STATUS_LABEL[key]}
                        </span>
                      </Box>
                      <Typography className={classes.countValue}>{count[key]}</Typography>
                    </Box>
                  );
                })}
                <Box className={classes.totalRow}>
                  <Typography className={classes.totalLabel}>Total</Typography>
                  <Typography className={classes.totalValue}>{total}</Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>

      </Box>
    </Box>
  );
};
