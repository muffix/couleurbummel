import {LatLng} from 'react-native-maps/lib/sharedTypes';

export default {
  setRNConfiguration: jest.fn(),
  getCurrentPosition: jest.fn().mockResolvedValueOnce({
    latitude: 0,
    longitude: 0,
  } as LatLng),
  watchPosition: jest.fn(),
};
