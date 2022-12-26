import '../../src/i18n';

import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from '@rneui/themed';
import React, {PropsWithChildren} from 'react';

import {StateContextProvider} from '../../src/components/contexts/GlobalStateContext';
import {ModelContextProvider} from '../../src/components/contexts/ModelContext';
import {UserLocationContextProvider} from '../../src/components/contexts/UserLocationContext';
import {theme} from '../../src/style/themes';

export const TestContexts = ({children}: PropsWithChildren) => (
  <ThemeProvider theme={theme}>
    <StateContextProvider>
      <UserLocationContextProvider>
        <ModelContextProvider>
          <NavigationContainer>{children}</NavigationContainer>
        </ModelContextProvider>
      </UserLocationContextProvider>
    </StateContextProvider>
  </ThemeProvider>
);
