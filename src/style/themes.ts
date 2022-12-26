import {DarkTheme, DefaultTheme} from '@react-navigation/native';
import {Theme} from '@react-navigation/native/lib/typescript/src/types';
import {createTheme, darkColors, lightColors} from '@rneui/themed';
import {ColorValue, Platform} from 'react-native';

const ColourConstants = {
  primary: '#008040',
  primaryTransparent: 'rgba(0,128,64,0.75)',
  primaryDark: '#006633',
  accent: '#3CB371',
  accentTransparent: '#3CB37180',
  white: '#FFFFFF',
  whiteDarkModeText: '#E1E8EE',
  grey: '#EBEBEB',
  darkGrey: '#393E42FF',
  black: '#000000',
};

const sharedColours = {
  primary: ColourConstants.primary,
  primaryTransparent: ColourConstants.primaryTransparent,
  accent: ColourConstants.accent,
  accentTransparent: ColourConstants.accentTransparent,
  mapMarkerFill: ColourConstants.grey,
  mapMarkerCentreStroke: ColourConstants.black,
  iconOnPrimaryColourBackgroundColour: ColourConstants.whiteDarkModeText,
  fixed: {
    white: ColourConstants.white,
    lightGrey: ColourConstants.grey,
    darkGrey: ColourConstants.darkGrey,
    black: ColourConstants.black,
  },
};

const platformLightDefaults = Platform.select({
  default: lightColors.platform.android,
  ios: lightColors.platform.ios,
});

const platformDarkDefaults = Platform.select({
  default: darkColors.platform.android,
  ios: darkColors.platform.ios,
});

export const theme = createTheme({
  lightColors: {
    ...platformLightDefaults,
    ...sharedColours,
    text: ColourConstants.black,
  },
  darkColors: {
    ...platformDarkDefaults,
    ...sharedColours,
    text: ColourConstants.whiteDarkModeText,
  },
  components: {
    Icon: {type: 'material-community', color: ColourConstants.primary},
    ListItem: {
      containerStyle: {
        // Required to allow the selection highlight (defaults to theme background otherwise)
        backgroundColor: 'transparent',
      },
    },
    // Compiler warning fixed in https://github.com/react-native-elements/react-native-elements/pull/3691
    // @ts-ignore
    ListItemSwipeable: {
      containerStyle: {
        // Required to allow the selection highlight (defaults to theme background otherwise)
        backgroundColor: 'transparent',
      },
    },
    SearchBar: {
      containerStyle: {
        backgroundColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
      },
    },
  },
});

export const navigationTheme: {lightTheme: Theme; darkTheme: Theme} = {
  lightTheme: {
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: sharedColours.primary,
    },
  },
  darkTheme: {
    dark: true,
    colors: {
      ...DarkTheme.colors,
      primary: sharedColours.primary,
    },
  },
};

declare module '@rneui/themed' {
  export interface Colors {
    primaryTransparent: ColorValue;
    accent: ColorValue;
    accentTransparent: ColorValue;
    mapMarkerFill: ColorValue;
    mapMarkerCentreStroke: ColorValue;
    text: ColorValue;
    iconOnPrimaryColourBackgroundColour: ColorValue;
    fixed: {
      white: ColorValue;
      lightGrey: ColorValue;
      darkGrey: ColorValue;
      black: ColorValue;
    };
  }
}
