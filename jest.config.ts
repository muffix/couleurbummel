import {JestConfigWithTsJest} from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'react-native',
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  verbose: true,
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        diagnostics: { warnOnly: true },
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|@rneui|react-native-localize|react-native-maps|react-native-map-clustering|react-native-worklets|supercluster|kdbush|@mapbox)',
  ],
  moduleNameMapper: {
    // Mock react-native-worklets (required by reanimated 4.x) so its native
    // module isn't loaded in jest. The mock at lib/module/mock exports a
    // WorkletAPI with all needed methods stubbed.
    '^react-native-worklets$':
      '<rootDir>/node_modules/react-native-worklets/lib/module/mock',
  },
  testPathIgnorePatterns: ['<rootDir>/__tests__/__helpers__'],
  setupFiles: [
    './node_modules/react-native/jest/setup.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest.setup.ts',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};

export default jestConfig;
