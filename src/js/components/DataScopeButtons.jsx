import React, { useRef } from 'react';
import { Button, ButtonGroup, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../scss/DataScopeButtons.scss';
import DataGridControlPanel from './DataGridControlPanel';
import { FREQUENCY } from '../apiConfig';

const DataScopeButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const yearlyDataGridRef = useRef(null);
  const quarterlyDataGridRef = useRef(null);
  const monthlyDataGridRef = useRef(null);

  const currentView = location.pathname.split('/').pop() || '';

  const handleViewChange = (view) => {
    navigate(`/${view}`, { replace: true });
  };

  const getFrequency = () => {
    switch(currentView) {
      case 'quarterly': return FREQUENCY.QUARTERLY;
      case 'monthly': return FREQUENCY.MONTHLY;
      default: return FREQUENCY.YEARLY;
    }
  };

  return (
    <Box className="data-scope-container">
      <ButtonGroup
        variant="contained"
        aria-label="data scope buttons"
        className="data-scope-buttons"
      >
        <Button
          onClick={() => handleViewChange('yearly')}
          className={currentView === 'yearly' ? 'active' : ''}
          variant="outlined"
        >
          Roczne
        </Button>
        <Button
          onClick={() => handleViewChange('quarterly')}
          className={currentView === 'quarterly' ? 'active' : ''}
          variant="outlined"
        >
          Kwartalne
        </Button>
        <Button
          onClick={() => handleViewChange('monthly')}
          className={currentView === 'monthly' ? 'active' : ''}
          variant="outlined"
        >
          Miesięczne
        </Button>
      </ButtonGroup>
      <Box className="view-content">
        <DataGridControlPanel 
          ref={currentView === 'quarterly' ? quarterlyDataGridRef : 
               currentView === 'monthly' ? monthlyDataGridRef : yearlyDataGridRef}
          frequency={getFrequency()}
        />
      </Box>
    </Box>
  );
};

export default DataScopeButtons;
