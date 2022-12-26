import {DrawerActions, useNavigation} from '@react-navigation/native';
import {FAB, Icon, useTheme} from '@rneui/themed';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import MapView from 'react-native-map-clustering';
/*
 The Interface import is necessary because react-native-map-clustering forwards its ref to the underlying MapView from
 react-native-maps. It doesn't export an interface, so TypeScript complains.
 */
import MapViewInterface, {Callout, MapMarker, Marker} from 'react-native-maps';
import {LatLng, Region} from 'react-native-maps/lib/sharedTypes';
import Popover from 'react-native-popover-view';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

import constants from '../constants';
import log from '../log';
import {CouleurbummelModel} from '../model/model';
import {Address} from '../types/model';
import {MapScreenProps} from '../types/screens';
import {formatDistance} from '../util';
import {ModelContext} from './contexts/ModelContext';
import {UserLocationContext} from './contexts/UserLocationContext';
import {CorporationDetails} from './details/Corporation';
import {POIDetails} from './details/PointOfInterest';
import {AddressCallout} from './map/AddressCallout';
import {AddressMarker} from './map/AddressMarker';

export interface MapProps {
  initialRegion: Region;
  addressIds: string[];
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  callout: {
    flexDirection: 'row',
  },
  popover: {
    borderRadius: 10,
  },
  buttonContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
});

/**
 * The root screen in the Map section
 */
export const MapScreen = ({route}: MapScreenProps) => {
  return (
    <Map
      initialRegion={route.params.region || constants.map.defaultRegion}
      addressIds={route.params.addressIds || []}
    />
  );
};

/**
 * Moves the map so that the markers for the requested address IDs are visible
 */
const showAddressesOnMap = (
  map: MapViewInterface,
  model: CouleurbummelModel,
  addressIds: string[],
) => {
  if (addressIds.length === 1) {
    const address = model.address(addressIds[0]);
    if (address) {
      map.animateToRegion({
        latitude: address.latitude,
        longitude: address.longitude,
        ...constants.map.zoomToMarkerDeltas,
      });
    }
  } else {
    const coordinatesToFit = addressIds
      .map(addressId => model.address(addressId))
      .filter(a => !!a)
      .map(a => a as Address)
      .map(a => {
        return {
          latitude: a.latitude,
          longitude: a.longitude,
        };
      });
    map.fitToCoordinates(coordinatesToFit);
  }
};

export const Map = ({initialRegion, addressIds}: MapProps) => {
  const model = useContext(ModelContext);
  const {theme} = useTheme();
  const map = useRef<MapViewInterface>(null);
  const navigation = useNavigation();

  const locationContext = useContext(UserLocationContext);
  const [coordinates, setCoordinates] = useState<LatLng | undefined>(
    locationContext,
  );
  useEffect(() => {
    if (locationContext) {
      setCoordinates({...locationContext});
    }
  }, [locationContext]);

  const addresses = useMemo(
    () => [...model.mapDisplayables().entries()],
    [model],
  );

  const [visiblePopoverId, setVisiblePopoverId] = useState<string | undefined>(
    undefined,
  );

  const screen = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Apart from safe areas, leave some extra space at the bottom. This lets us safely dismiss the popover.
  const bottomInsets =
    insets.bottom + constants.map.popoverBottomSpaceFactor * screen.height;
  const popoverInsets: EdgeInsets = {
    ...insets,
    bottom: bottomInsets,
  };
  const usablePopoverHeight =
    screen.height - insets.top - bottomInsets - (StatusBar.currentHeight || 0);

  // Remember the marker selected when transitioning to the map.
  const [selectedMarker, setSelectedMarker] = useState<string | undefined>();

  useEffect(() => {
    // If any, animate the map to show the requested addresses once
    if (addressIds.length && map.current) {
      log.debug('Requested to show address IDs', addressIds);
      showAddressesOnMap(map.current, model, addressIds);
      if (addressIds.length === 1) {
        setSelectedMarker(addressIds[0]);
      }
    }
  }, [model, addressIds]);

  const onMarkerRefFactory = useCallback(
    (addressId: string) => (node: MapMarker | null) => {
      if (node && selectedMarker && selectedMarker === addressId) {
        node.showCallout();
      }
    },
    [selectedMarker],
  );

  return (
    <View style={styles.container} testID={'Screen:Map'}>
      <MapView
        testID={'Map:MapView'}
        ref={map}
        style={styles.map}
        tintColor={theme.colors.primary}
        showsUserLocation={true}
        onUserLocationChange={event => {
          if (event.nativeEvent.coordinate === undefined) {
            log.debug('Received coordinates are undefined');
            return;
          }

          const firstCoords: boolean = coordinates === undefined;

          setCoordinates(event.nativeEvent.coordinate);

          if (firstCoords) {
            log.debug('Animating to first user coordinates received');
            map.current?.animateToRegion({
              ...event.nativeEvent.coordinate,
              ...constants.map.defaultRegionDeltas,
            });
          }
        }}
        mapType={'standard'}
        loadingEnabled
        clusteringEnabled
        showsMyLocationButton
        showsPointsOfInterest
        initialRegion={initialRegion}
        minPoints={constants.map.clustering.minNumber}
        maxZoom={constants.map.clustering.maxZoomLevel}
        // Android only
        userLocationPriority={'balanced'}>
        {addresses.map(([address, mds]) => {
          return (
            <Marker
              key={address.id}
              ref={onMarkerRefFactory(address.id)}
              onDeselect={() => setSelectedMarker(undefined)}
              identifier={address.id}
              tracksViewChanges={false}
              tracksInfoWindowChanges={false}
              centerOffset={constants.map.markerCentreOffset}
              coordinate={{
                latitude: address.latitude,
                longitude: address.longitude,
              }}>
              <AddressMarker mapDisplayables={mds} />
              <Callout
                onPress={() => setVisiblePopoverId(address.id)}
                style={[
                  styles.callout,
                  {
                    minWidth: constants.map.calloutWidthFactor * screen.width,
                  },
                ]}>
                <AddressCallout
                  mapDisplayables={mds}
                  title={
                    address.name || address.fullAddress?.split('\n')?.[0] || ''
                  }
                  distanceString={formatDistance(coordinates, {
                    latitude: address.latitude,
                    longitude: address.longitude,
                  })}
                />
                <Popover
                  displayAreaInsets={popoverInsets}
                  animationConfig={{duration: 400}}
                  popoverStyle={[
                    styles.popover,
                    {
                      width: 0.95 * screen.width,
                    },
                  ]}
                  isVisible={visiblePopoverId === address.id}
                  onRequestClose={() => setVisiblePopoverId(undefined)}>
                  <View>
                    {mds.corporations && (
                      <CorporationDetails
                        key={`popover_${address.id}`}
                        corporations={mds.corporations}
                        containerStyle={{maxHeight: usablePopoverHeight}}
                        disableAddressButton
                      />
                    )}
                    {mds.pois && (
                      <POIDetails
                        key={`popover_poi_${address.id}`}
                        pois={mds.pois}
                      />
                    )}
                  </View>
                </Popover>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
      <View style={styles.buttonContainer}>
        <FAB
          color={theme.colors.grey5}
          icon={
            <Icon
              name={constants.icons.drawer.menu}
              color={theme.colors.grey0}
            />
          }
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
        />
        {Platform.OS === 'ios' && (
          <FAB
            visible={coordinates !== undefined}
            color={theme.colors.grey5}
            icon={
              <Icon
                name={constants.icons.map.myLocationButton}
                color={theme.colors.grey0}
              />
            }
            onPress={() => {
              if (map.current && coordinates) {
                map.current.animateToRegion({
                  ...coordinates,
                  ...constants.map.zoomToMarkerDeltas,
                });
              }
            }}
          />
        )}
      </View>
    </View>
  );
};
