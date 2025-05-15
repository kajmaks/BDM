import React, { useState, useRef, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Stack, CircularProgress } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuButton from './MenuButton';
import { IconsTooltip } from './CustomTooltips';
import { rows } from './gridData';
import CustomizedDataGrid from './CustomizedDataGrid';
import { forwardRef } from 'react';
import axios from 'axios';

import '../../scss/DataGridControlPanel.scss';

const DataGridControlPanel = forwardRef((props, ref) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dataGridRef = useRef(null);

  //hardcoded for now 

  // useEffect(() => {
  //   const fetchTables = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(
  //         'https://bdm.stat.gov.pl/app/nazwy-tablic?freq=1&lang=PL'
  //       );
  //       setTables(response.data);
  //       if (response.data.length > 0) {
  //         setSelectedTable(response.data[0].id_tablica);
  //       }
  //     } catch (err) {
  //       setError(err.message);
  //       console.error('Error fetching tables:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTables();
  // }, []);

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  return (
    <Box className="data-grid-control-panel" sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', display: 'flex', mb: 2 }}>
        <FormControl sx={{ width: '50%' }}>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Box sx={{ color: 'error.main', p: 2 }}>Error loading tables</Box>
          ) : (
            <Select
              id="table-select-label"
              label="Wybierz tablicę"
              value={selectedTable}
              onChange={handleTableChange}
              IconComponent={ArrowDropDownIcon}
              disabled //for now
            >
              <MenuItem value={1}>Bilans płatniczy</MenuItem>
              {tables.map((table) => (
                  <MenuItem key={table.id_tablica} value={table.id_tablica}>
                      {table.tablica}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: '50%',
            height: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <IconsTooltip title="Informacje" placement="top" sx={{ height: 'fit-content' }}>
            <MenuButton showBadge={false}>
              <InfoOutlinedIcon />
            </MenuButton>
          </IconsTooltip>

          <IconsTooltip title="Widok" placement="top">
            <MenuButton showBadge={false}>
              <FullscreenIcon />
            </MenuButton>
          </IconsTooltip>

          <IconsTooltip title="Zapisz" placement="top">
            <MenuButton showBadge={false}>
              <SaveIcon />
            </MenuButton>
          </IconsTooltip>

          <IconsTooltip title="Ustawienia" placement="top">
            <MenuButton showBadge={false}>
              <SettingsIcon />
            </MenuButton>
          </IconsTooltip>
        </Stack>
      </Box>

      <CustomizedDataGrid ref={dataGridRef} tableId={selectedTable} />
    </Box>
  );
});

export default DataGridControlPanel;
