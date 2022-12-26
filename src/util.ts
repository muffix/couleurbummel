import {getDistance} from 'geolib';
import {LatLng} from 'react-native-maps/lib/sharedTypes';

import {Address} from './types/model';

export const formatDistance = (a?: LatLng, b?: LatLng) => {
  if (!a || !b) {
    return undefined;
  }

  const distance = getDistance(a, b);

  if (distance < 1000) {
    return `${distance} m`;
  }

  if (distance < 10000) {
    return `${(distance / 1000).toFixed(1)} km`;
  }
  return `${(distance / 1000).toFixed(0)} km`;
};

export const compareDistances = (
  a: Address,
  b: Address,
  userLocation: LatLng,
) => {
  if (!a || !b) {
    return 0;
  }

  return getDistance(a, userLocation) - getDistance(b, userLocation);
};

export const arraysEqual = (a: any[], b: any[], anyOrder = false) => {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }

  if (anyOrder) {
    a.sort();
    b.sort();
  }

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};
