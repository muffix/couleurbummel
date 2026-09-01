jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: {
    app: jest.fn(() => ({
      database: jest.fn(() => ({
        ref: jest.fn(() => ({
          on: jest.fn(),
        })),
        setPersistenceEnabled: jest.fn(),
      })),
    })),
  },
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

// react-native-maps >= 1.26 resolves a TurboModule (RNMapsAirModule) at module
// load via TurboModuleRegistry.getEnforcing, which throws in the jest
// environment because no native binary is registered. Stub the spec module so
// MapView (and react-native-map-clustering, which wraps it) can render in tests.
jest.mock('react-native-maps/src/specs/NativeAirMapsModule', () => ({
  __esModule: true,
  default: {},
}));

// react-native-worklets (required by reanimated 4.x) jest mock.
// The moduleNameMapper in jest.config.ts redirects all imports to the mock.
// This require sets up the global vars (_WORKLET=false, __RUNTIME_KIND, etc).
require('react-native-worklets/lib/module/mock');
