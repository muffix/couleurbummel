/**
 * @format
 */

import 'react-native';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';
import React from 'react';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

import App from '../src/App';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
afterEach(async () => {
  await sleep(2000);
});

it('renders correctly', async () => {
  renderer.create(<App />);
});
