import React from 'react';

import {POIDetails} from '../../../src/components/details/PointOfInterest';
import {
  getTestModel,
  waitForPromisesToResolveWithAct,
} from '../../__helpers__/helpers';
import {render, screen} from '../../__helpers__/test-utils';

const model = getTestModel();

describe('POI details view', () => {
  const renderDetails = async (poiIds: string[]) => {
    const pois = model.pointsOfInterestById(poiIds);
    expect(pois).toHaveLength(1);

    render(<POIDetails pois={pois} />);

    await waitForPromisesToResolveWithAct().then(() =>
      expect(screen.toJSON()).toMatchSnapshot(),
    );
  };

  it('matches snapshot for fully populated POI', async () => {
    await renderDetails(['poi_aachen_townhall']);
  });
});
