import {act} from '@testing-library/react-native';

import testDatabase from '../../resources/testDatabase.json';
import {CouleurbummelModel} from '../../src/model/model';

const waitForPromisesToResolve = () => new Promise(setImmediate);

export const waitForPromisesToResolveWithAct = async () => {
  await act(async () => {
    await waitForPromisesToResolve();
  });
};

const testModel = new CouleurbummelModel(testDatabase);

export const getTestModel = () => testModel;
