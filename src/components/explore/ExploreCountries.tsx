import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {ScreenProps, StackScreenParamsList} from '../../types/screens';
import {CorporationDetailsScreen} from '../CorporationDetailsScreen';
import {ToggleDrawerButton} from '../navigation/ToggleDrawerButton';
import {CityListScreen} from './CityList';
import {CountryListScreen} from './CountryList';

const Stack = createNativeStackNavigator<StackScreenParamsList>();

/**
 * The root screen in the Countries section
 */
export const ExploreCountriesScreen = ({}: ScreenProps) => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Countries"
        component={CountryListScreen}
        options={{
          title: t('SCREEN_COUNTRIES'),
          headerLeft: ToggleDrawerButton,
        }}
      />
      <Stack.Screen
        name="Cities"
        component={CityListScreen}
        options={{title: t('SCREEN_CITIES')}}
      />
      <Stack.Screen
        name="CorporationDetails"
        options={{title: t('SCREEN_DETAILS')}}
        component={CorporationDetailsScreen}
      />
    </Stack.Navigator>
  );
};
