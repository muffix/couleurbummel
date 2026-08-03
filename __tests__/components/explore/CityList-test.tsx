import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {CorporationDetailsScreen} from '../../../src/components/CorporationDetailsScreen';
import {CityList} from '../../../src/components/explore/CityList';
import {StackScreenParamsList} from '../../../src/types/screens';
import {waitForPromisesToResolveWithAct} from '../../__helpers__/helpers';
import {fireEvent, render, screen} from '../../__helpers__/test-utils';

describe('City list', () => {
  it('renders correctly', async () => {
    render(<CityList />);

    await waitForPromisesToResolveWithAct().then(() =>
      expect(screen.toJSON()).toMatchSnapshot(),
    );
  });

  // TODO: Re-enable at RN 0.82+ — React 19.1 + RN 0.81 Animated ref cleanup bug
  // causes "Cannot read properties of undefined (reading 'remove')" in the jest
  // test renderer during screen transitions. The app works fine on device/sim.
  it.skip('pushes the corporation details view to the stack when a corporation is selected', async () => {
    const Stack = createNativeStackNavigator<StackScreenParamsList>();
    render(
      <Stack.Navigator>
        <Stack.Screen name="Cities" component={CityList} />
        <Stack.Screen
          name="CorporationDetails"
          component={CorporationDetailsScreen}
        />
      </Stack.Navigator>,
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
