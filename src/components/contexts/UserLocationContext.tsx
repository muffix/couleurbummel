import Geolocation from '@react-native-community/geolocation';
import React, {PropsWithChildren, useState} from 'react';
import {LatLng} from 'react-native-maps/lib/sharedTypes';

import constants from '../../constants';
import log from '../../log';

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
});

/**
 * Context providing the user location
 *
 * This context can be used by components to listen to user location updates.
 */
export const UserLocationContext = React.createContext<LatLng | undefined>(
  undefined,
);

export const UserLocationContextProvider = ({children}: PropsWithChildren) => {
  const [location, setLocation] = useState<LatLng | undefined>(() => {
    log.debug('Subscribing to user location');

    Geolocation.getCurrentPosition(loc => setLocation(loc.coords));
    Geolocation.watchPosition(
      loc => {
        log.debug('Provider received location', loc);
        setLocation(loc.coords);
      },
      error => {
        log.debug('Failed to retrieve location', error);
      },
      {
        distanceFilter: constants.userLocation.distanceFilterMetres,
      },
    );
    return undefined;
  });

  return (
    <UserLocationContext.Provider value={location}>
      {children}
    </UserLocationContext.Provider>
  );
};
