import 'react-native';

import {render, screen} from '@testing-library/react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import {CorporationDetails} from '../../../src/components/details/Corporation';
import {TestContexts} from '../../__helpers__/Contexts';
import {
  getTestModel,
  waitForPromisesToResolveWithAct,
} from '../../__helpers__/helpers';

const model = getTestModel();

describe('Corporation details view', () => {
  const renderDetails = async (corporationIds: string[]) => {
    const corporations = model.corporationsById(corporationIds);
    expect(corporations).toHaveLength(corporationIds.length);

    render(
      <TestContexts>
        <CorporationDetails
          corporations={model.corporationsById(corporationIds)}
        />
      </TestContexts>,
    );

    await waitForPromisesToResolveWithAct().then(() =>
      expect(screen.toJSON()).toMatchSnapshot(),
    );
  };

  it('matches snapshot for fully populated corporation', async () => {
    await renderDetails(['corporation_de_aachen_kdstv_marchia']);
  });

  it('matches snapshot for a corporation without colours', async () => {
    await renderDetails(['corporation_de_tübingen_av_igel']);
  });

  it('matches snapshot for a corporation with minimal details', async () => {
    await renderDetails(['corporation_at_wien_köstv_babenberg']);
  });

  it('renders two corporations', async () => {
    await renderDetails([
      'corporation_de_aachen_adv_laetitia',
      'corporation_de_aachen_kstv_alaniabreslau',
    ]);
  });
});
