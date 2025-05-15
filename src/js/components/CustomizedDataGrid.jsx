import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton } from '@mui/material';
import { Link, LinkOff } from '@mui/icons-material';
import { AnnotationTooltip } from './CustomTooltips';
import axios from 'axios';
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

const CustomizedDataGrid = forwardRef(({tableId = 1}, ref) => { // Default to table ID 1 for now
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lockedColumns, setLockedColumns] = useState(['pointer', 'unit']);
  const dataGridRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

useEffect(() => {
    const fetchIndicators = async () => {
      if (!tableId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `https://bdm.stat.gov.pl/app/wskazniki?lang=PL&tablicaId=${tableId}`
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

  const processData = (apiData) => {
    const years = [...new Set(apiData.wskazniki.flatMap(indicator => 
      indicator.wartosci.map(value => Math.floor(value.id_czas / 1000000))
    ))].sort();

    const baseColumns = [
      { 
        field: 'pointer', 
        headerName: 'Wskaźnik', 
        width: 300,
        pinned: 'left',
        renderCell: (params) => <CustomCell {...params} />
      },
      {
        field: 'unit',
        headerName: 'Jednostka',
        width: 120,
        pinned: 'left',
      }
    ];

    const yearColumns = years.map(year => ({
      field: year.toString(),
      headerName: year.toString(),
      width: 100,
      headerAlign: 'center',
      align: 'center',
    }));

    setColumns([...baseColumns, ...yearColumns]);

    const processedRows = apiData.wskazniki.map((indicator, index) => {
      const row = {
        id: index,
        pointer: apiData.wskaznik,
        unit: indicator.id_miara || 'mln EUR',
        hasAnnotation: !!indicator.id_komentarz,
        annotation: indicator.id_komentarz ? 'i' : '',
        annotationText: indicator.id_komentarz ? `Komentarz: ${indicator.id_komentarz}` : '',
      };

      years.forEach(year => {
        const valueObj = indicator.wartosci.find(v => 
          Math.floor(v.id_czas / 1000000) === year
        );
        row[year] = valueObj ? valueObj.wartosc : '-';
      });

      return row;
    });

    setRows(processedRows);
  };

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  useImperativeHandle(ref, () => ({
    api: dataGridRef.current,
  }));

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const toggleColumnLock = (field) => {
    setLockedColumns((prev) =>
      prev.includes(field) ? prev.filter((col) => col !== field) : [...prev, field]
    );
  };

  const modifiedColumns = columns.map((col) => {
    if (col.field === 'pointer') {
      return {
        ...col,
        renderCell: (params) => <CustomCell {...params} />,
        width: 300,
      };
    }

    if (col.field === 'unit') {
      return {
        ...col,
        width: 120,
        renderHeader: () => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span>Jednostka</span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleColumnLock(col.field);
              }}
              sx={{ ml: 0.5 }}
            >
              {lockedColumns.includes(col.field) ? (
                <AnnotationTooltip title="Odblokuj kolumnę" placement="bottom">
                  <Link fontSize="small" />
                </AnnotationTooltip>
              ) : (
                <AnnotationTooltip title="Zablokuj kolumnę" placement="bottom">
                  <LinkOff fontSize="small" />
                </AnnotationTooltip>
              )}
            </IconButton>
          </Box>
        ),
      };
    }

    return {
      ...col,
      width: 100,
    };
  });

  return (
    <Box
      sx={{
        width: '100%',
        height: 600,
        position: 'relative',
        overflow: 'hidden',
      }}
      ref={containerRef}
    >

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ color: 'error.main', p: 2 }}>Error loading data</Box>
      ) : (
        <>
                {/* Pinned columns*/}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 2,
          display: 'flex',
          backgroundColor: '#F5F6FA',
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        {/*pin "Wskaźnik" column */}
        <Box
          sx={{
            width: 300,
            borderRight: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              height: 'var(--DataGrid-headerHeight)',
              minHeight: 'var(--DataGrid-headerHeight)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 8px',
              backgroundColor: '#E6E9F4',
              borderBottom: '1px solid #e0e0e0',
              boxSizing: 'border-box',
              position: 'sticky',
              top: 0,
              zIndex: 3,
            }}
          >
            Wskaźnik
          </Box>
          {/* Cells */}
          <Box
            sx={{
              flex: 1,
              overflow: 'hidden',
              transform: `translateY(${-scrollTop}px)`,
            }}
          >
            {rows.map((row, index) => (
              <Box
                key={row.id}
                sx={{
                  height: 'var(--DataGrid-rowHeight)',
                  minHeight: 'var(--DataGrid-rowHeight)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  borderBottom: '1px solid #e0e0e0',
                  boxSizing: 'border-box',
                }}
              >
                <CustomCell row={row} />
              </Box>
            ))}
          </Box>
        </Box>

        {/*"Jednostka" column pinned condition*/}
        <Box
          sx={{
            width: 120,
            borderRight: '1px solid #e0e0e0',
            display: lockedColumns.includes('unit') ? 'block' : 'none',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              height: 'var(--DataGrid-headerHeight)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 8px',
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#E6E9F4',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <span>Jednostka</span>
              <IconButton size="small" onClick={() => toggleColumnLock('unit')} sx={{ ml: 0.5 }}>
                <Link fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          {/* Cells */}
          <Box
            sx={{
              height: `calc(100% - var(--DataGrid-headerHeight))`,
              overflow: 'hidden',
            }}
          >
            {rows.map((row) => (
              <Box
                key={row.id}
                sx={{
                  height: 'var(--DataGrid-rowHeight)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: '#F5F6FA',
                }}
              >
                {row.unit}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Main content*/}
      <Box
        sx={{
          position: 'absolute',
          left: 300,
          right: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          borderLeft: '1px solid #e0e0e0',
        }}
        onScroll={handleScroll}
      >
        <DataGrid
          ref={dataGridRef}
          rows={rows}
          columns={modifiedColumns.filter(
            (col) =>
              !['pointer', 'unit'].includes(col.field) ||
              (col.field === 'unit' && !lockedColumns.includes('unit'))
          )}
          disableColumnResize
          disableColumnMenu
          disableColumnSorting
          disableRowSelectionOnClick
          hideFooter
          density="compact"
          sx={{
            width: 'fit-content',
            minWidth: '100%',
            '& .MuiDataGrid-columnHeaders': {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: '#f5f5f5',
            },
            '& .MuiDataGrid-virtualScroller': {
              marginTop: 'var(--DataGrid-headerHeight) !important',
            },
            '& .MuiDataGrid-cell': {
              borderRight: '1px solid #e0e0e0',
              '&:last-child': {
                borderRight: 'none',
              },
            },
            '& .MuiDataGrid-row': {
              minHeight: 'var(--DataGrid-rowHeight) !important',
              maxHeight: 'var(--DataGrid-rowHeight) !important',
              '& .MuiDataGrid-cell': {
                minHeight: 'var(--DataGrid-rowHeight) !important',
                maxHeight: 'var(--DataGrid-rowHeight) !important',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px !important',
              },
            },
          }}
        />
      </Box>
        </>
      )}
      </Box>
  );
});

export default CustomizedDataGrid;
