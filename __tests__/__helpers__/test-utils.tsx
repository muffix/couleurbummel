import '../../src/i18n';

import {NavigationContainer} from '@react-navigation/native';
import {ThemeProvider} from '@rneui/themed';
import {render, RenderOptions} from '@testing-library/react-native';
import React, {PropsWithChildren} from 'react';
import {ReactElement} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {StateContextProvider} from '../../src/components/contexts/GlobalStateContext';
import {ModelContextProvider} from '../../src/components/contexts/ModelContext';
import {UserLocationContextProvider} from '../../src/components/contexts/UserLocationContext';
import {theme} from '../../src/style/themes';

const TestContexts = ({children}: PropsWithChildren) => (
  <SafeAreaProvider>
    <ThemeProvider theme={theme}>
      <StateContextProvider>
        <UserLocationContextProvider>
          <ModelContextProvider>
            <NavigationContainer>{children}</NavigationContainer>
          </ModelContextProvider>
        </UserLocationContextProvider>
      </StateContextProvider>
    </ThemeProvider>
  </SafeAreaProvider>
);

const renderInNavigationContainer = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: TestContexts, ...options});

export * from '@testing-library/react-native';
export {renderInNavigationContainer as render};
