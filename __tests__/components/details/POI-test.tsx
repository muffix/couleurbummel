import {render, screen} from '@testing-library/react-native';
import React from 'react';

import {POIDetails} from '../../../src/components/details/PointOfInterest';
import {TestContexts} from '../../__helpers__/Contexts';
import {
  getTestModel,
  waitForPromisesToResolveWithAct,
} from '../../__helpers__/helpers';

const model = getTestModel();

describe('POI details view', () => {
  const renderDetails = async (poiIds: string[]) => {
    const pois = model.pointsOfInterestById(poiIds);
    expect(pois).toHaveLength(1);

    render(
      <TestContexts>
        <POIDetails pois={pois} />
      </TestContexts>,
    );

    await waitForPromisesToResolveWithAct().then(() =>
      expect(screen.toJSON()).toMatchSnapshot(),
    );
  };

  it('matches snapshot for fully populated POI', async () => {
    await renderDetails(['poi_aachen_townhall']);
  });
});
