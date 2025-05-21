import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';

import { inputsCustomizations } from './customizations/themesStuff';
import { colorSchemes, typography, shadows, shape } from './themePrimitives';

function AppTheme(props) {
  const { children, disableCustomTheme, themeComponents, locale = 'enGB' } = props;

  const theme = React.useMemo(() => {
    if (disableCustomTheme) return {};

    const baseTheme = createTheme({
      cssVariables: {
        colorSchemeSelector: 'data-mui-color-scheme',
        cssVarPrefix: 'template',
      },
      colorSchemes,
      typography,
      shadows,
      shape,
      components: {
        ...inputsCustomizations,
      },
    });

    const mergedTheme = createTheme(baseTheme, locales[locale]);

    return mergedTheme;
  }, [disableCustomTheme, themeComponents, locale]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

AppTheme.propTypes = {
  children: PropTypes.node,
  disableCustomTheme: PropTypes.bool,
  themeComponents: PropTypes.object,
  locale: PropTypes.string,
};

export default AppTheme;
