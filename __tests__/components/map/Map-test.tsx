import React from 'react';

import {Map} from '../../../src/components/Map';
import constants from '../../../src/constants';
import {
  getTestModel,
  waitForPromisesToResolveWithAct,
} from '../../__helpers__/helpers';
import {render, screen} from '../../__helpers__/test-utils';

const model = getTestModel();

describe('Map', () => {
  it('renders and matches the snapshot', async () => {
    render(
      <Map
        initialRegion={constants.map.defaultRegion}
        addressIds={model.allAddresses().map(a => a.id)}
      />,
    );

    await waitForPromisesToResolveWithAct().then(() =>
      expect(screen.toJSON()).toMatchSnapshot(),
    );
  });
});
