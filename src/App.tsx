import './firebase';
import './i18n';

import {ThemeProvider} from '@rneui/themed';
import React from 'react';

import {StateContextProvider} from './components/contexts/GlobalStateContext';
import {ModelContextProvider} from './components/contexts/ModelContext';
import {UserLocationContextProvider} from './components/contexts/UserLocationContext';
import {Navigation} from './components/navigation/Navigation';
import {theme} from './style/themes';

const App = () => (
  <ThemeProvider theme={theme}>
    <StateContextProvider>
      <UserLocationContextProvider>
        <ModelContextProvider>
          <Navigation />
        </ModelContextProvider>
      </UserLocationContextProvider>
    </StateContextProvider>
  </ThemeProvider>
);

export default App;
