/**
 * @format
 */

import 'react-native';

import {ThemeProvider} from '@rneui/themed';
import {act, waitFor} from '@testing-library/react-native';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer, {ReactTestRenderer} from 'react-test-renderer';

import {AddressMarkerView} from '../../../src/components/map/AddressMarker';
import {theme} from '../../../src/style/themes';

describe('AddressMarker', () => {
  it('defaults to transparent', async () => {
    let marker: ReactTestRenderer;

    act(() => {
      marker = renderer.create(
        <ThemeProvider theme={theme}>
          <AddressMarkerView colours={[]} />
        </ThemeProvider>,
      );
    });

    await waitFor(() => expect(marker).toMatchSnapshot());
  });

  it('shows an icon', async () => {
    let marker: ReactTestRenderer;

    act(() => {
      marker = renderer.create(
        <ThemeProvider theme={theme}>
          <AddressMarkerView colours={[]} iconName={'icon_coat_mch'} />
        </ThemeProvider>,
      );
    });

    await waitFor(() => expect(marker).toMatchSnapshot());
  });

  it('renders a green centre', async () => {
    let marker: ReactTestRenderer;

    act(() => {
      marker = renderer.create(
        <ThemeProvider theme={theme}>
          <AddressMarkerView colours={['green']} />
        </ThemeProvider>,
      );
    });

    await waitFor(() => expect(marker).toMatchSnapshot());
  });

  it('renders a pie chart for colours in the right proportions', async () => {
    let marker: ReactTestRenderer;

    act(() => {
      marker = renderer.create(
        <ThemeProvider theme={theme}>
          <AddressMarkerView colours={['green', 'white', 'green', 'black']} />
        </ThemeProvider>,
      );
    });

    await waitFor(() => expect(marker).toMatchSnapshot());
  });
});
