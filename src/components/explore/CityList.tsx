import {DrawerActions, useNavigation} from '@react-navigation/native';
import {Button, Icon, makeStyles} from '@rneui/themed';
import {ListItem} from '@rneui/themed';
import React, {memo, useContext, useMemo, useState} from 'react';

import constants from '../../constants';
import {CouleurbummelModel} from '../../model/model';
import {Address, City, Corporation} from '../../types/model';
import {CitiesScreenProps, CityListProps} from '../../types/screens';
import {
  setActiveDrawerAction,
  toggleFavouriteCityAction,
} from '../contexts/actions';
import {StateContext} from '../contexts/GlobalStateContext';
import {ModelContext} from '../contexts/ModelContext';
import fuzzySearch from '../fuzzySearch';
import {SearchableList} from '../SearchableList';
import {CorporationList} from './CorporationList';

const filterCities = (searchTerm: string, cities: City[]) =>
  cities.filter(c =>
    fuzzySearch(searchTerm.trim().toLowerCase(), c.name.toLowerCase()),
  );

export const CityListScreen = ({route}: CitiesScreenProps) => (
  <CityList cities={route.params?.cities} testID={route.params?.testID} />
);

/**
 * A list of cities
 */
export const CityList = ({cities, testID}: CityListProps) => {
  const {globalState, dispatch} = useContext(StateContext);
  const model = useContext(ModelContext);

  const allCities = useMemo(() => cities || model.allCities(), [model, cities]);

  return (
    <SearchableList
      testID={testID}
      allItems={allCities}
      filterItems={filterCities}
      showsAllResultsOnEmptySearch
      keyExtractor={(city: City) => city.id}
      renderItem={city => (
        <CityRow
          city={city}
          isFavourite={globalState.favourites.city.has(city.id)}
          onFavouritePress={async () => {
            dispatch(toggleFavouriteCityAction(city.id));
          }}
        />
      )}
      searchDelayMs={0}
    />
  );
};

/**
 * Gets an array of address and corporation tuples for a city
 *
 * @param city the city
 * @param model the model object
 */
const flatAddressesForCity = (city: City, model: CouleurbummelModel) => {
  return model
    .addressesWithCorporations(city.addressIds || [])
    .flatMap(([address, corporations]) =>
      corporations.map(c => [address, c] as [Address, Corporation]),
    ) as [Address, Corporation][];
};

const CityRow = memo(
  ({
    city,
    isFavourite,
    onFavouritePress,
  }: {
    city: City;
    isFavourite: boolean;
    onFavouritePress: () => Promise<void>;
  }) => {
    const {dispatch} = useContext(StateContext);
    const styles = useStyles();
    const model = useContext(ModelContext);
    const navigation = useNavigation();

    const [isExpanded, setIsExpanded] = useState(false);

    const addressesAndCorporations = useMemo(
      () => flatAddressesForCity(city, model),
      [city, model],
    );

    return (
      <ListItem.Accordion
        key={city.id}
        isExpanded={isExpanded}
        onPress={() => {
          setIsExpanded(!isExpanded);
        }}
        containerStyle={styles.cityContainer}
        content={
          <>
            <ListItem.Title style={styles.cityName}>{city.name}</ListItem.Title>

            <Button
              buttonStyle={styles.button}
              icon={<Icon name={constants.icons.explore.showOnMap} />}
              onPress={() => {
                const newScreenName = 'Map';
                dispatch(setActiveDrawerAction(newScreenName));
                navigation.dispatch(
                  DrawerActions.jumpTo('Map', {addressIds: city.addressIds}),
                );
                navigation.dispatch(DrawerActions.closeDrawer);
              }}
            />

            <Button
              buttonStyle={styles.button}
              icon={
                <Icon
                  name={
                    isFavourite
                      ? constants.icons.explore.favourite
                      : constants.icons.explore.nonFavourite
                  }
                />
              }
              onPress={onFavouritePress}
            />
          </>
        }>
        <CorporationList
          addressesAndCorporations={addressesAndCorporations}
          parentScreenName={'Cities'}
          searchable={false}
        />
      </ListItem.Accordion>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.isFavourite === nextProps.isFavourite;
  },
);

const useStyles = makeStyles(() => ({
  cityName: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  cityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    backgroundColor: 'transparent',
  },
}));
