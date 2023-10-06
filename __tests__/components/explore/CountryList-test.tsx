import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {CityListScreen} from '../../../src/components/explore/CityList';
import {
  CountryList,
  CountryListScreen,
} from '../../../src/components/explore/CountryList';
import {StackScreenParamsList} from '../../../src/types/screens';
import {waitForPromisesToResolveWithAct} from '../../__helpers__/helpers';
import {fireEvent, render, screen, waitFor} from '../../__helpers__/test-utils';

describe('Country list', () => {
  it('renders correctly', async () => {
    render(<CountryList />);
    await waitForPromisesToResolveWithAct().then(() =>
      expect(screen.toJSON()).toMatchSnapshot(),
    );
  });

  it('pushes the cities view to the stack when a country is selected', async () => {
    const Stack = createNativeStackNavigator<StackScreenParamsList>();
    render(
      <Stack.Navigator>
        <Stack.Screen name="Countries" component={CountryListScreen} />
        <Stack.Screen name="Cities" component={CityListScreen} />
      </Stack.Navigator>,
    );

    const germanyRow = await screen.findByText('Germany');
    await waitFor(() => expect(germanyRow).toBeTruthy());

    fireEvent(germanyRow, 'press');

    const aachenRow = await screen.findByText('Aachen');
    await waitFor(() => expect(aachenRow).toBeTruthy());
  });
});
