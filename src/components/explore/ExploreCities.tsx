import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {ScreenProps, StackScreenParamsList} from '../../types/screens';
import {CorporationDetailsScreen} from '../CorporationDetailsScreen';
import {ToggleDrawerButton} from '../navigation/ToggleDrawerButton';
import {CityListScreen} from './CityList';

const Stack = createNativeStackNavigator<StackScreenParamsList>();

/**
 * The root screen in the Cities section
 */
export const ExploreCitiesScreen = ({}: ScreenProps) => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cities"
        component={CityListScreen}
        options={{
          title: t('SCREEN_CITIES'),
          headerLeft: ToggleDrawerButton,
        }}
        initialParams={{
          testID: 'Screen:ExploreCities',
        }}
      />
      <Stack.Screen
        name="CorporationDetails"
        options={{title: t('SCREEN_DETAILS')}}
        component={CorporationDetailsScreen}
      />
    </Stack.Navigator>
  );
};
