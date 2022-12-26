import {render, screen} from '@testing-library/react-native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Map} from '../../../src/components/Map';
import constants from '../../../src/constants';
import {TestContexts} from '../../__helpers__/Contexts';
import {
  getTestModel,
  waitForPromisesToResolveWithAct,
} from '../../__helpers__/helpers';

const model = getTestModel();

describe('Map', () => {
  it('renders and matches the snapshot', async () => {
    render(
      <SafeAreaProvider>
        <TestContexts>
          <Map
            initialRegion={constants.map.defaultRegion}
            addressIds={model.allAddresses().map(a => a.id)}
          />
        </TestContexts>
      </SafeAreaProvider>,
    );

    await waitForPromisesToResolveWithAct().then(() =>
      expect(screen.toJSON()).toMatchSnapshot(),
    );
  });
});
