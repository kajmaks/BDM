import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { ChartsTooltipContainer } from '@mui/x-charts/ChartsTooltip';
import { useTheme } from '@mui/material/styles';
import { deficitData } from '../../../assets/temp data/barcharData';

function CustomItemTooltip({ label, payload }) {
  const theme = useTheme();
  const item = payload?.[0] || {};
  const raw = item.value ?? 0;
  const formatted = `${raw.toLocaleString()} min zł`;
  const dotColor = item.color ?? theme.palette.primary.main;

  return (
    <ChartsTooltipContainer
      trigger="axis"
      sx={{
        bgcolor: 'background.paper',
        boxShadow: 1,
        p: 1,
        borderRadius: 1,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.875rem' }}>
        {deficitData[0].title}
      </div>

      <hr
        style={{
          margin: '2px 0 6px',
          border: 0,
          height: 1,
          backgroundColor: theme.palette.divider,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
        <span
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: dotColor,
            marginRight: 6,
          }}
        />
        <span>
          {label} — {formatted}
        </span>
      </div>
    </ChartsTooltipContainer>
  );
}

export default function GovernmentSectorBalance() {
  const theme = useTheme();
  const color = theme.palette.primary.main;

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Deficyt/ Nadwyżka sektora instytucji rządowych i samorządowych [mil zł]
        </Typography>

        <BarChart
          dataset={deficitData}
          xAxis={[{ scaleType: 'band', dataKey: 'year', categoryGapRatio: 0.3 }]}
          yAxis={[
            {
              min: -50000,
              max: 0,
              tickValues: [0, -10000, -20000, -30000, -40000, -50000],
            },
          ]}
          series={[
            {
              dataKey: 'value',
              color,
              valueFormatter: (v) => `${v.toLocaleString()} mil zł`,
            },
          ]}
          height={350}
          slots={{ tooltip: CustomItemTooltip }}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        />
      </CardContent>
    </Card>
  );
}
