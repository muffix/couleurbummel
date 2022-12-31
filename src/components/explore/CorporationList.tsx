import {StackActions, useNavigation} from '@react-navigation/native';
import {ListItem, makeStyles} from '@rneui/themed';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList} from 'react-native';
import {LatLng} from 'react-native-maps/lib/sharedTypes';

import constants from '../../constants';
import log from '../../log';
import {Address, Corporation, Organisation} from '../../types/model';
import {
  CorporationListProps,
  CorporationListScreenProps,
} from '../../types/screens';
import {compareDistances, formatDistance} from '../../util';
import {ColoursSet} from '../ColoursSet';
import {toggleFavouriteCorporationAction} from '../contexts/actions';
import {StateContext} from '../contexts/GlobalStateContext';
import {ModelContext} from '../contexts/ModelContext';
import {UserLocationContext} from '../contexts/UserLocationContext';
import {FavouriteButton} from '../FavouriteButton';
import fuzzySearch from '../fuzzySearch';
import {SearchableList} from '../SearchableList';

const sortCorporations = (
  corporations: [Address, Corporation][],
  option: 'distance' | 'name',
  userLocation?: LatLng,
) => {
  const copy = [...corporations];

  copy.sort(([address1, corp1], [address2, corp2]) => {
    if (option === 'distance' && userLocation) {
      return compareDistances(address1, address2, userLocation);
    }

    return corp1.shortName.localeCompare(corp2.shortName);
  });

  return copy;
};

const filterCorporations = (
  searchTerm: string,
  corporations: [Address, Corporation][],
) =>
  corporations.filter(([_address, c]) =>
    fuzzySearch(searchTerm, c.shortName.toLowerCase()),
  );

const renderCorporation =
  (hideOrganisation?: boolean) => (item: [Address, Corporation]) => {
    const [address, corporation] = item;

    return (
      <CorporationItem
        corporation={corporation}
        address={address}
        hideOrganisation={hideOrganisation}
      />
    );
  };

/**
 * A list of corporations
 */
export const CorporationList = (props: CorporationListProps) => {
  const styles = useStyles();
  const {globalState} = useContext(StateContext);
  const userLocation = useContext(UserLocationContext);

  const navigation = useNavigation();

  const [addressesAndCorporations, setAddressesAndCorporations] = useState(
    props.addressesAndCorporations,
  );

  useEffect(() => {
    if (props.headerTitle) {
      navigation.setOptions({title: props.headerTitle});
    }
  });

  useEffect(() => {
    log.debug('State changed: CorporationList');
    const option = globalState.corporationSorting[props.parentScreenName];

    log.debug(`Sorting ${props.parentScreenName} by ${option}`);

    setAddressesAndCorporations(
      sortCorporations(props.addressesAndCorporations, option, userLocation),
    );
  }, [globalState, userLocation, props]);

  if (!props.searchable) {
    return (
      <FlatList
        style={styles.container}
        ListHeaderComponent={props.headerComponent}
        testID={props.testID}
        data={addressesAndCorporations}
        renderItem={({item}) => renderCorporation(props.hideOrganisation)(item)}
        keyExtractor={([_address, c]) => c.id}
      />
    );
  }

  return (
    <SearchableList
      testID={props.testID}
      allItems={addressesAndCorporations}
      filterItems={filterCorporations}
      renderItem={renderCorporation(props.hideOrganisation)}
      keyExtractor={([_address, c]) => c.id}
      searchDelayMs={constants.explore.search.delayMs}
      headerComponent={props.headerComponent}
      showsAllResultsOnEmptySearch={
        props.searchOptions?.showsResultsOnEmptySearch
      }
    />
  );
};

/**
 * A row in a list of corporations
 *
 * @param corporation the corporation
 * @param address the address at which the corporation is located
 * @param hideOrganisation whether we want to hide the corporation's organisation name in parentheses
 * @constructor
 */
const CorporationItem = ({
  corporation,
  address,
  hideOrganisation,
}: {
  corporation: Corporation;
  address: Address;
  hideOrganisation?: boolean;
}) => {
  const navigation = useNavigation();
  const styles = useStyles();
  const {t} = useTranslation();

  const model = useContext(ModelContext);
  const userLocation = useContext(UserLocationContext);

  let orgsString = '';
  if (!hideOrganisation) {
    const orgs = corporation.organisationIds
      ?.map(orgId => model.organisation(orgId))
      .filter(o => !!o)
      .map(o => (o as Organisation).abbreviation);

    orgsString = orgs ? ` (${orgs.join(', ')})` : '';
  }

  return (
    <ListItem.Swipeable
      key={corporation.id}
      onPress={() => {
        log.debug(corporation.shortName);
        navigation.dispatch(
          StackActions.push('CorporationDetails', {
            corporation: corporation,
          }),
        );
      }}
      style={({pressed}) =>
        pressed ? styles.listItemPressed : styles.listItemDefault
      }
      rightContent={reset => (
        <FavouriteButton
          itemId={corporation.id}
          toggleAction={toggleFavouriteCorporationAction}
          postDispatch={reset}
        />
      )}
      bottomDivider>
      <ListItem.Content>
        <ListItem.Title style={styles.corporationName}>
          {`${corporation.shortName}${orgsString}`}
        </ListItem.Title>
        {userLocation && (
          <ListItem.Subtitle style={styles.distanceText}>
            {t('DISTANCE', {
              distanceString: formatDistance(userLocation, {
                latitude: address.latitude,
                longitude: address.longitude,
              }),
            })}
          </ListItem.Subtitle>
        )}
        <ColoursSet c={corporation} />
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem.Swipeable>
  );
};

export const CorporationListScreen = ({route}: CorporationListScreenProps) => {
  return (
    <CorporationList
      addressesAndCorporations={route.params.addressesAndCorporations}
      parentScreenName={route.params.parentScreenName}
      searchable={route.params.searchable}
      searchOptions={route.params.searchOptions}
    />
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  corporationName: {},
  distanceText: {
    color: theme.colors.grey0,
    fontSize: 11,
    fontStyle: 'italic',
  },
  listItemPressed: {
    backgroundColor: theme.colors.accent,
  },
  listItemDefault: {
    backgroundColor: theme.colors.white,
  },
}));
