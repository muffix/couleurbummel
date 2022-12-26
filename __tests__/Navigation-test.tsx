import {ThemeProvider} from '@rneui/themed';
import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';

import {Navigation} from '../src/components/navigation/Navigation';
import {theme} from '../src/style/themes';

jest.mock('../src/storage', () => ({
  persistGlobalState: jest.fn().mockRejectedValue(undefined),
  getGlobalState: jest.fn().mockRejectedValue(undefined),
}));

describe('Custom navigation', () => {
  it('navigates away from map and back', async () => {
    const navigation = (
      <ThemeProvider theme={theme}>
        <Navigation />
      </ThemeProvider>
    );

    render(navigation);

    const settingsButton = await screen.findByTestId('Navigation:Settings');
    const mapButton = await screen.findByTestId('Navigation:Map');

    fireEvent(settingsButton, 'press');
    const settingsScreen = await screen.findByTestId('Screen:Settings');
    expect(settingsScreen).toBeTruthy();

    fireEvent(mapButton, 'press');
    const mapView = await screen.findByTestId('Map:MapView');
    expect(mapView).toBeTruthy();
  });

  const nonDefaultScreenNames = [
    'ExploreNearby',
    'ExploreCities',
    'ExploreCountries',
    'ExploreOrganisations',
    'SearchName',
    'SearchColours',
    'Settings',
  ];

  nonDefaultScreenNames.forEach(screenName => {
    it(`navigates to ${screenName}`, async () => {
      const navigation = (
        <ThemeProvider theme={theme}>
          <Navigation />
        </ThemeProvider>
      );

      render(navigation);

      // First navigate to the map
      const mapButton = await screen.findByTestId('Navigation:Map');
      fireEvent(mapButton, 'press');
      const mapView = await screen.findByTestId('Map:MapView');
      expect(mapView).toBeTruthy();

      // Navigate to the new screen
      const newScreenButton = await screen.findByTestId(
        `Navigation:${screenName}`,
      );
      fireEvent(newScreenButton, 'press');
      const newScreen = await screen.findByTestId(`Screen:${screenName}`);
      expect(newScreen).toBeTruthy();

      fireEvent(mapButton, 'press');
    });
  });
});
