import {NativeConfig} from 'react-native-config';

declare module 'react-native-config' {
  interface NativeConfig {
    CONTACT_EMAIL: string;
    DATABASE_TYPE: 'prod' | 'test';
    DATABASE_URL?: string;
    DATABASE_PATH?: string;
    GOOGLE_MAPS_API_KEY: string;

    ANDROID_APPCHECK_DEBUG_TOKEN?: string;
    IOS_APPCHECK_DEBUG_TOKEN?: string;
    ENABLE_LOGGING?: string;
  }
}

export const Config: NativeConfig;
export default Config;
