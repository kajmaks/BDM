import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuButton from './MenuButton';
import { IconsTooltip } from './CustomTooltips';
import CustomizedDataGrid from './CustomizedDataGrid';
import { forwardRef } from 'react';
import axios from 'axios';
import { API_BASE_URL, DEFAULT_LANGUAGE, FREQUENCY } from '../apiConfig';

import '../../scss/DataGridControlPanel.scss';

const DataGridControlPanel = forwardRef(({ frequency = FREQUENCY.YEARLY }, ref) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState
  (frequency === FREQUENCY.QUARTERLY ? 28 : frequency === FREQUENCY.MONTHLY ? 47 : 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dataGridRef = useRef(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/tables?frequency_id=${frequency}&language=${DEFAULT_LANGUAGE}`
        );
        setTables(response.data);
        if (response.data.length > 0) {
          setSelectedTable(response.data[0].id);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching tables:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [frequency]);

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };

  const menuProps = {
    PaperProps: {
      style: {
        transformOrigin: 'top center',
      },
    },
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
            <>
              <InputLabel htmlFor="table-select-label">Wybierz obszar</InputLabel>
              <Select
                id="table-select-label"
                label="Wybierz tablicę"
                value={selectedTable}
                onChange={handleTableChange}
                IconComponent={ArrowDropDownIcon}
                MenuProps={menuProps}
              >
                {tables.map((table) => (
                  <MenuItem key={table.id} value={table.id}>
                    {table.name}
                  </MenuItem>
                ))}
              </Select>
            </>
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

      <CustomizedDataGrid ref={dataGridRef} tableId={selectedTable}/>
    </Box>
  );
});

export default DataGridControlPanel;
