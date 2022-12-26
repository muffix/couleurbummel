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
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|@rneui|react-native-localize)',
  ],
  testPathIgnorePatterns: ['<rootDir>/__tests__/__helpers__'],
  setupFiles: [
    './node_modules/react-native/jest/setup.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest.setup.ts',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};

export default jestConfig;
