import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getDistance} from 'geolib';
import React, {useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {LatLng} from 'react-native-maps/lib/sharedTypes';

import log from '../../log';
import {CouleurbummelModel} from '../../model/model';
import {Address, Corporation} from '../../types/model';
import {
  ExploreScreen,
  ScreenProps,
  StackScreenParamsList,
} from '../../types/screens';
import {ModelContext} from '../contexts/ModelContext';
import {UserLocationContext} from '../contexts/UserLocationContext';
import {CorporationDetailsScreen} from '../CorporationDetailsScreen';
import {ToggleDrawerButton} from '../navigation/ToggleDrawerButton';
import {CorporationList} from './CorporationList';
import {SortButton} from './SortButton';

const Stack = createNativeStackNavigator<StackScreenParamsList>();

const screenName: ExploreScreen = 'Closest';

const fetchNearbyAddresses = (
  model: CouleurbummelModel,
  userLocation?: LatLng,
) => {
  log.debug('Fetching corporations near', userLocation);
  let mapDisplayables = [...model.mapDisplayables().entries()];

  if (userLocation) {
    mapDisplayables.sort(
      ([a], [b]) =>
        getDistance(
          {latitude: a.latitude, longitude: a.longitude},
          userLocation,
        ) -
        getDistance(
          {latitude: b.latitude, longitude: b.longitude},
          userLocation,
        ),
    );
  } else {
    log.warn('Cannot determine nearby corporations: user location unknown');
    return [];
  }

  mapDisplayables = mapDisplayables.slice(0, 50);

  return mapDisplayables.flatMap(([address, mds]) =>
    mds.corporations.map(c => [address, c] as [Address, Corporation]),
  );
};

/**
 * A screen listing nearby corporations
 *
 * The screen wraps a CorporationList instead of directly using a CorporationList because we need to update its
 * contents dynamically as the user location changes.
 */
const NearbyScreen = () => {
  const model = useContext(ModelContext);
  const userLocation = useContext(UserLocationContext);

  const nearbyAddresses = useMemo(
    () => fetchNearbyAddresses(model, userLocation),
    [model, userLocation],
  );

  return (
    <CorporationList
      testID={'Screen:ExploreNearby'}
      addressesAndCorporations={nearbyAddresses}
      parentScreenName={screenName}
      searchable
      searchOptions={{showsResultsOnEmptySearch: true}}
    />
  );
};

/**
 * The root screen in the Nearby section
 */
export const ExploreNearbyScreen = ({}: ScreenProps) => {
  const {t} = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CorporationList"
        component={NearbyScreen}
        options={{
          title: t('SCREEN_NEARBY'),
          headerLeft: () => <ToggleDrawerButton />,
          headerRight: () => <SortButton screenName={screenName} />,
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
