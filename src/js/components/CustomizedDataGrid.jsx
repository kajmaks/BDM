import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, useTheme } from '@mui/material';
import { Link, LinkOff } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { AnnotationTooltip } from './CustomTooltips';
import axios from 'axios';
import { API_BASE_URL, DEFAULT_LANGUAGE, FREQUENCY } from '../apiConfig';
import '../../scss/CustomizedDataGrid.scss';

const CustomCell = (params) => {
  const { pointer, hasAnnotation, annotation, annotationText } = params.row;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      <span>{pointer}</span>
      {hasAnnotation && (
        <AnnotationTooltip
          placement="bottom-start"
          leaveDelay={200}
          title={
            <Box sx={{ maxHeight: '200px', overflowY: 'auto', padding: '5px' }}>
              {annotationText}
            </Box>
          }
        >
          <Box
            sx={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#B5D334',
              color: '#131523',
              marginLeft: '5px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {annotation}
          </Box>
        </AnnotationTooltip>
      )}
    </Box>
  );
};

const CustomizedDataGrid = forwardRef(({ tableId = 1 }, ref) => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUnitPinned, setIsUnitPinned] = useState(false);
  const dataGridRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const frequency = useMemo(() => {
    if (tableId >= 47) return FREQUENCY.MONTHLY;
    if (tableId >= 28) return FREQUENCY.QUARTERLY;
    return FREQUENCY.YEARLY;
  }, [tableId]);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/indicators?tablicaId=${tableId}&frequency_id=${frequency}&lang=${DEFAULT_LANGUAGE}`
        );
        processData(response.data, frequency);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching indicators:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
  }, [tableId, frequency]);

  const handleScroll = (e) => {
    setScrollLeft(e.target.scrollLeft);
  };

  useEffect(() => {
    const grid = dataGridRef.current;
    if (grid) {
      const virtualScroller = grid.querySelector('.MuiDataGrid-virtualScroller');
      if (virtualScroller) {
        virtualScroller.addEventListener('scroll', handleScroll);
        return () => virtualScroller.removeEventListener('scroll', handleScroll);
      }
    }
  }, [dataGridRef.current]);

  const parseIdCzas = (id_czas, frequency) => {
    const year = Math.floor(id_czas / 1000000);
    const remaining = id_czas % 1000000;

    if (frequency === FREQUENCY.YEARLY) {
      return { year, period: null };
    } else if (frequency === FREQUENCY.QUARTERLY) {
      const quarterCode = Math.floor(remaining / 10000);
      let quarter;
      switch (quarterCode) {
        case 11:
          quarter = 1;
          break;
        case 12:
          quarter = 2;
          break;
        case 23:
          quarter = 3;
          break;
        case 24:
          quarter = 4;
          break;
        default:
          return null;
      }
      return { year, period: quarter };
    } else if (frequency === FREQUENCY.MONTHLY) {
      //monthly format: YYYYQQMM00
      const month = Math.floor((remaining % 10000) / 100);
      if (month < 1 || month > 12) return null;
      return { year, period: month };
    }
    return null;
  };
  const processData = (apiData, frequency) => {
    if (!apiData || !Array.isArray(apiData)) {
      console.error('Invalid API data format:', apiData);
      return;
    }

    const timePeriods = new Set();
    const allValues = [];

    apiData.forEach((poziom) => {
      poziom.wskazniki?.forEach((wskaznik) => {
        wskaznik.wartosci?.forEach((value) => {
          const parsed = parseIdCzas(value.id_czas, frequency);
          if (!parsed) return;

          const periodKey =
            frequency === FREQUENCY.YEARLY
              ? parsed.year.toString()
              : `${parsed.year}-${parsed.period.toString().padStart(2, '0')}`;

          timePeriods.add(periodKey);
          allValues.push({
            ...value,
            periodKey,
            id_poziomy: poziom.id_poziomy,
            id_zbiorcza: wskaznik.id_zbiorcza,
          });
        });
      });
    });

    const processedRows = apiData.flatMap(
      (poziom) =>
        poziom.wskazniki?.map((wskaznik, index) => {
          const row = {
            id: `${poziom.id_poziomy}-${index}`,
            pointer: wskaznik.id_zbiorcza ? `${poziom.wskaznik}` : poziom.wskaznik,
            unit: wskaznik.id_miara || 'mln EUR',
          };

          Array.from(timePeriods)
            .sort((a, b) => {
              const [aYear, aPeriod] = a.includes('-') ? a.split('-') : [a, null];
              const [bYear, bPeriod] = b.includes('-') ? b.split('-') : [b, null];
              if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
              return parseInt(aPeriod || 0) - parseInt(bPeriod || 0);
            })
            .forEach((periodKey) => {
              const value = allValues.find(
                (v) =>
                  v.periodKey === periodKey &&
                  v.id_poziomy === poziom.id_poziomy &&
                  v.id_zbiorcza === wskaznik.id_zbiorcza
              );
              row[periodKey] = value ? value.wartosc : '-';
            });

          return row;
        }) || []
    );

    setRows(processedRows);
  };

  const columns = useMemo(() => {
    const periodFields = new Set();
    rows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (key !== 'id' && key !== 'pointer' && key !== 'unit') {
          periodFields.add(key);
        }
      });
    });

    const sortedPeriods = Array.from(periodFields).sort((a, b) => {
      const [aYear, aPeriod] = a.includes('-') ? a.split('-') : [a, null];
      const [bYear, bPeriod] = b.includes('-') ? b.split('-') : [b, null];
      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
      return parseInt(aPeriod || 0) - parseInt(bPeriod || 0);
    });

    const periodColumns = sortedPeriods.map((periodKey) => {
      const [year, periodNum] = periodKey.includes('-') ? periodKey.split('-') : [periodKey, null];

      let headerName;
      if (frequency === FREQUENCY.YEARLY) {
        headerName = year;
      } else if (frequency === FREQUENCY.QUARTERLY) {
        headerName = DEFAULT_LANGUAGE === 'pl' ? `kw. ${periodNum}` : `Q${periodNum}`;
      } else if (frequency === FREQUENCY.MONTHLY) {
        headerName = periodNum;
      }

      return {
        field: periodKey,
        headerName,
        width: 100,
        headerAlign: 'center',
        align: 'center',
      };
    });

    const columnGroups = [];
    if (frequency !== FREQUENCY.YEARLY) {
      const years = {};
      sortedPeriods.forEach((periodKey) => {
        const [year] = periodKey.includes('-') ? periodKey.split('-') : [periodKey];
        if (!years[year]) years[year] = [];
        years[year].push(periodKey);
      });

      columnGroups.push(
        ...Object.entries(years).map(([year, periods]) => ({
          groupId: year,
          headerName: year,
          headerClassName: 'yearly-header-group',
          children: periods.map((periodKey) => ({
            field: periodKey,
            headerName: periodColumns.find((col) => col.field === periodKey)?.headerName || '',
            width: 100,
          })),
        }))
      );
    }

    const baseColumns = [
      {
        field: 'pointer',
        headerName: 'Wskaźnik',
        width: 300,
        renderCell: (params) => <CustomCell {...params} />,
        headerClassName: 'pointer-header',
        cellClassName: 'pointer-cell',
      },
      {
        field: 'unit',
        headerName: 'Jednostka',
        width: 120,
        headerClassName: `unit-header ${isUnitPinned ? 'pinned' : ''}`,
        cellClassName: `unit-cell ${isUnitPinned ? 'pinned' : ''}`,
        renderHeader: () => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span>Jednostka</span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setIsUnitPinned(!isUnitPinned);
              }}
              sx={{ ml: 0.5 }}
            >
              {isUnitPinned ? <LinkOff fontSize="small" /> : <Link fontSize="small" />}
            </IconButton>
          </Box>
        ),
      },
      ...periodColumns,
    ];

    return {
      columns: baseColumns,
      columnGroups,
    };
  }, [rows, isUnitPinned, frequency]);

  useImperativeHandle(ref, () => ({
    api: dataGridRef.current,
  }));

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: 600,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default,
      }}
      className={`customized-data-grid-container ${isUnitPinned ? 'unit-pinned' : ''}`}
      data-scroll={scrollLeft}
    >
      {loading ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ color: 'error.main', p: 2 }}>Error loading data</Box>
      ) : (
        <DataGrid
          ref={dataGridRef}
          rows={rows}
          columns={columns.columns}
          columnGroupingModel={columns.columnGroups}
          experimentalFeatures={{ columnGrouping: true }}
          disableColumnResize
          disableColumnMenu
          disableColumnSorting
          disableRowSelectionOnClick
          density="compact"
        />
      )}
    </Box>
  );
});

export default CustomizedDataGrid;