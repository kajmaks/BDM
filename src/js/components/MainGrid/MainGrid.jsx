import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomizedDataGrid from './CustomizedDataGrid';
import Graph from './BarChart';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import BdmLogoLight from '../../../assets/images/BDM sygnet kolor.svg';
import BdmLogoDark from '../../../assets/images/BDM sygnet białe.svg';
import LogoSwitcher from '../Other/LogoSwitcher';
import { DateCalendar, PickersCalendarHeader } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';
import Contact from './Contact';
import LogoSmallLight from '../../../assets/images/gus2-kolor.svg';
import LogoSmallDark from '../../../assets/images/gus2.svg';
import ScrollToTop from './ScrollToTop';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container sx={{ mb: (theme) => theme.spacing(2) }}>
        <CustomizedDataGrid />
      </Grid>{' '}
      {/*Graphs*/}
      <Grid container sx={{ mb: (theme) => theme.spacing(2) }}>
        <Graph />
      </Grid>
      <Grid container spacing={3} columns={12} sx={{ display: 'flex', flexWrap: 'nowrap' }}>
        <Grid sx={{ width: '100%' }}>
          <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
            <CardContent>
              {' '}
              {/*Info*/}
              <Typography
                variant="h4"
                component="div"
                sx={{ marginLeft: '20px', marginTop: '4px' }}
              >
                O bazie
              </Typography>
              <LogoSwitcher
                logoDark={BdmLogoDark}
                logoLight={BdmLogoLight}
                alt="małe logo BDM"
                parameter={30}
                wh="w"
              />
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ lineHeight: '1.5', marginLeft: '20px' }}
              >
                <b>Bank Danych Makroekonomicznych (BDM)</b> jest statystyczną bazą gromadzącą
                wskaźniki charakteryzujące sytuację gospodarczą i społeczną Polski w skali makro.
                Baza, umożliwia dostęp do długich szeregów czasowych dla podstawowych danych
                makroekonomicznych w różnych obszarach tematycznych.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid className="date-picker" sx={{ width: '100%', height: '100%' }}>
          <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
            {' '}
            {/*Calendar*/}
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h4" component="div" sx={{ marginTop: '4px' }}>
                Aktualności
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                <DateCalendar sx={{ height: '100%' }} />
              </LocalizationProvider>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{ width: '100%' }}>
          <Card
            variant="outlined"
            sx={{ width: '100%', height: '100%', paddingLeft: '20px', paddingRight: '20px' }}
          >
            {' '}
            {/*Contact*/}
            <CardContent sx={{ width: '100%', height: '100%' }}>
              <Typography variant="h4" component="div" sx={{ marginTop: '4px' }}>
                Kontakt
              </Typography>
              <Contact />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '3%',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1%',
        }}
      >
        <Typography variant="body2" align="center" sx={[{ color: 'text.secondary' }]}>
          {'Copyright © '}
          <Link color="inherit" href="https://creativecommons.org/licenses/by/4.0/legalcode">
            Licencja międzynarodowa CC BY 4.0 – Uznanie autorstwa 4.0 Polityka prywatności oraz
            oświadczenie o dostępności
          </Link>{' '}
        </Typography>
        <LogoSwitcher
          logoDark={LogoSmallDark}
          logoLight={LogoSmallLight}
          alt="Małe logo gus"
          width={1.8}
        />
      </Box>
      <ScrollToTop />
    </Box>
  );
}
