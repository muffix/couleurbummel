import { firebase } from '@react-native-firebase/app-check';
import Config from 'react-native-config';

const appCheckProvider = firebase
.appCheck()
.newReactNativeFirebaseAppCheckProvider();

appCheckProvider.configure({
  android: {
    provider: __DEV__ ? 'debug' : 'playIntegrity',
    debugToken: Config.ANDROID_APPCHECK_DEBUG_TOKEN,
  },
  apple: {
    provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
    debugToken: Config.IOS_APPCHECK_DEBUG_TOKEN,
  },
});

firebase.appCheck().initializeAppCheck({
  provider: appCheckProvider,
  isTokenAutoRefreshEnabled: true,
});
