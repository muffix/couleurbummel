import {ThemeProvider} from '@rneui/themed';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
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

    act(() => fireEvent(settingsButton, 'press'));
    await waitFor(async () =>
      expect(await screen.findByTestId('Screen:Settings')).toBeTruthy(),
    );

    act(() => fireEvent(mapButton, 'press'));
    await waitFor(async () =>
      expect(await screen.findByTestId('Map:MapView')).toBeTruthy(),
    );
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
      act(() => fireEvent(mapButton, 'press'));
      await waitFor(async () =>
        expect(await screen.findByTestId('Map:MapView')).toBeTruthy(),
      );

      // Navigate to the new screen
      const newScreenButton = await screen.findByTestId(
        `Navigation:${screenName}`,
      );
      act(() => fireEvent(newScreenButton, 'press'));
      await waitFor(async () =>
        expect(await screen.findByTestId(`Screen:${screenName}`)).toBeTruthy(),
      );

      act(() => fireEvent(mapButton, 'press'));
      await waitFor(async () =>
        expect(await screen.findByTestId('Map:MapView')).toBeTruthy(),
      );
    });
  });
});
