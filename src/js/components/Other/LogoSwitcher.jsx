import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';

export default function LogoSwitcher ({logoLight, logoDark, alt, parameter, wh}) {
    const { mode } = useColorScheme();
  
    const logo = mode === 'dark' ? logoDark : logoLight;
    if (wh === 'h'){
      return (<img src={logo} alt={alt} style={{ height: `${parameter}%` }} />);
    } else {
      return (<img src={logo} alt={alt} style={{ width: `${parameter}%` }} />);
    }
};
