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
import { API_BASE_URL, DEFAULT_LANGUAGE } from '../apiConfig';
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

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/indicators?tablicaId=${tableId}&frequency_id=1&lang=${DEFAULT_LANGUAGE}`
        );
        processData(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching indicators:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
  }, [tableId]);

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

  const processData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) {
      console.error('Invalid API data format:', apiData);
      return;
    }

    const years = new Set();
    apiData.forEach((poziom) => {
      poziom.wskazniki?.forEach((wskaznik) => {
        wskaznik.wartosci?.forEach((value) => {
          years.add(Math.floor(value.id_czas / 1000000));
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
          Array.from(years)
            .sort()
            .forEach((year) => {
              const valueObj = wskaznik.wartosci?.find(
                (v) => Math.floor(v.id_czas / 1000000) === year
              );
              row[year] = valueObj ? valueObj.wartosc : '-';
            });
          return row;
        }) || []
    );

    setRows(processedRows);
  };

  const columns = useMemo(() => {
    const yearFields = new Set();
    rows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (!isNaN(key)) {
          yearFields.add(key);
        }
      });
    });

    const yearColumns = Array.from(yearFields)
      .sort()
      .map((year) => ({
        field: year.toString(),
        headerName: year.toString(),
        width: 100,
        headerAlign: 'center',
        align: 'center',
      }));

    return [
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
      ...yearColumns,
    ];
  }, [rows, isUnitPinned]);

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
          columns={columns}
          disableColumnResize
          disableColumnMenu
          disableColumnSorting
          disableRowSelectionOnClick
          // hideFooter
          density="compact"
        />
      )}
    </Box>
  );
});

export default CustomizedDataGrid;
