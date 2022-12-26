import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';

import {CorporationDetailsScreen} from '../../../src/components/CorporationDetailsScreen';
import {CityList} from '../../../src/components/explore/CityList';
import {StackScreenParamsList} from '../../../src/types/screens';
import {TestContexts} from '../../__helpers__/Contexts';
import {waitForPromisesToResolveWithAct} from '../../__helpers__/helpers';

describe('City list', () => {
  it('renders correctly', async () => {
    render(
      <TestContexts>
        <CityList />
      </TestContexts>,
    );

    await waitForPromisesToResolveWithAct().then(() =>
      expect(screen.toJSON()).toMatchSnapshot(),
    );
  });

  it('pushes the corporation details view to the stack when a corporation is selected', async () => {
    const Stack = createNativeStackNavigator<StackScreenParamsList>();
    render(
      <TestContexts>
        <Stack.Navigator>
          <Stack.Screen name="Cities" component={CityList} />
          <Stack.Screen
            name="CorporationDetails"
            component={CorporationDetailsScreen}
          />
        </Stack.Navigator>
      </TestContexts>,
    );

    const aachenRow = await screen.findByText('Aachen');

    await waitForPromisesToResolveWithAct().then(() =>
      fireEvent(aachenRow, 'press'),
    );
    const marchiaRow = await screen.findByText('KDStV Marchia (CV)');

    await waitForPromisesToResolveWithAct().then(() =>
      fireEvent(marchiaRow, 'press'),
    );
    await screen.findByTestId('Screen:CorporationDetails');
  });
});
