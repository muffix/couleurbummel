jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-native-firebase/database', () => ({
  firebase: {
    app: jest.fn(() => ({
      database: jest.fn(() => ({
        ref: jest.fn(() => ({
          on: jest.fn(),
        })),
        setPersistenceEnabled: jest.fn(),
      })),
    })),
  },
}));

jest.mock('@react-native-firebase/app-check', () => ({
  firebase: {
    appCheck: jest.fn(() => ({
      newReactNativeFirebaseAppCheckProvider: jest.fn(() => ({
        configure: jest.fn(),
      })),
      initializeAppCheck: jest.fn(),
    })),
  },
}));

// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';

// Note: React Native >= 0.77 mocks NativeAnimatedModule directly in its jest
// setup, so the legacy `react-native/Libraries/Animated/NativeAnimatedHelper`
// mock is no longer needed (and that path no longer exists).
