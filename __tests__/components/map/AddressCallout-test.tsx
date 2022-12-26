/**
 * @format
 */

import 'react-native';

import {ThemeProvider} from '@rneui/themed';
import {render, screen, waitFor} from '@testing-library/react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import {AddressCallout} from '../../../src/components/map/AddressCallout';
import {theme} from '../../../src/style/themes';
import {getTestModel} from '../../__helpers__/helpers';

describe('AddressCallout', () => {
  const model = getTestModel();

  it('renders multiple corporations', async () => {
    const corporationsAtSameAddress = model.corporationsById([
      'corporation_de_aachen_adv_laetitia',
      'corporation_de_aachen_kstv_alaniabreslau',
    ]);

    expect(corporationsAtSameAddress).toHaveLength(2);

    render(
      <ThemeProvider theme={theme}>
        <AddressCallout
          title={'Street or house name'}
          distanceString={'42m'}
          mapDisplayables={{
            corporations: corporationsAtSameAddress,
            pois: [],
          }}
        />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.toJSON()).toMatchSnapshot());
  });

  it('renders a POI', async () => {
    const poi = model.pointOfInterest('poi_aachen_townhall');
    expect(poi).toBeTruthy();

    render(
      <ThemeProvider theme={theme}>
        <AddressCallout
          title={'Street or house name'}
          distanceString={'42m'}
          mapDisplayables={{
            corporations: [],
            pois: [poi!],
          }}
        />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.toJSON()).toMatchSnapshot());
  });
});
