jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-native-firebase/database', () => {
  return {
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
  };
});

// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
