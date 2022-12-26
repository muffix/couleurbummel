import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ListItem, makeStyles} from '@rneui/themed';
import React, {useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';

import {CouleurbummelModel} from '../../model/model';
import {Address, Corporation, Organisation} from '../../types/model';
import {
  ExploreScreen,
  OrganisationProps,
  ScreenProps,
  StackScreenParamsList,
} from '../../types/screens';
import {ModelContext} from '../contexts/ModelContext';
import {CorporationDetailsScreen} from '../CorporationDetailsScreen';
import fuzzySearch from '../fuzzySearch';
import {AddressMarkerView} from '../map/AddressMarker';
import {ToggleDrawerButton} from '../navigation/ToggleDrawerButton';
import {SearchableList} from '../SearchableList';
import {CorporationListScreen} from './CorporationList';
import {SortButton} from './SortButton';

const Stack = createNativeStackNavigator<StackScreenParamsList>();

const screenName: ExploreScreen = 'Organisations';

/**
 * The root screen in the Organisations section
 */
export const ExploreOrganisationsScreen = ({}: ScreenProps) => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Organisations"
        component={OrganisationList}
        options={{
          title: t('SCREEN_ORGANISATIONS'),
          headerLeft: () => <ToggleDrawerButton />,
        }}
      />
      <Stack.Screen
        name="CorporationList"
        component={CorporationListScreen}
        options={{
          title: t('SCREEN_CORPORATION_LIST'),
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

const fetchOrgsAndCorporations = (model: CouleurbummelModel) => {
  return model.allOrganisations().map(org => {
    const addressAndCorporations = org.mapDisplayableIds
      ?.map(mdId => model.corporation(mdId))
      .filter(c => !!c)
      .map(c => {
        const corporation = c as Corporation;
        const address = model.address(corporation.addressId);

        if (!address) {
          return undefined;
        }
        return [address, corporation];
      })
      .filter(tuple => !!tuple);
    return [org, addressAndCorporations];
  }) as [Organisation, [Address, Corporation][]][];
};

const filterOrgs = (
  searchTerm: string,
  orgsAndAddresses: [Organisation, [Address, Corporation][]][],
) => {
  searchTerm = searchTerm.toLowerCase().trim();
  return orgsAndAddresses.filter(
    ([org, _addresses]) =>
      fuzzySearch(searchTerm, org.name.toLowerCase()) ||
      fuzzySearch(searchTerm, org.abbreviation.toLowerCase()),
  );
};

const OrganisationList = ({navigation}: OrganisationProps) => {
  const model = useContext(ModelContext);
  const styles = useStyles();

  const allOrgs = useMemo(
    () =>
      fetchOrgsAndCorporations(model).filter(
        ([_org, addresses]) => !!addresses,
      ),
    [model],
  );

  return (
    <SearchableList
      testID={'Screen:ExploreOrganisations'}
      allItems={allOrgs}
      filterItems={filterOrgs}
      showsAllResultsOnEmptySearch
      keyExtractor={([org, _addresses]) => org.id}
      renderItem={([org, addressAndCorporations]) => {
        return (
          <ListItem
            style={({pressed}) =>
              pressed
                ? [styles.listItem, styles.listItemPressed]
                : styles.listItem
            }
            onPress={() => {
              if (addressAndCorporations) {
                navigation.push('CorporationList', {
                  addressesAndCorporations: addressAndCorporations,
                  headerTitle: org.abbreviation,
                  hideOrganisation: true,
                  parentScreenName: screenName,
                  searchable: true,
                });
              }
            }}>
            <AddressMarkerView
              colours={[
                model.colour(org.indicatorColourId) ||
                  model.colour('ind_grey')!,
              ]}
            />
            <ListItem.Content>
              <ListItem.Title style={styles.title}>
                {org.name} ({org.abbreviation})
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        );
      }}
      searchDelayMs={0}
    />
  );
};

const useStyles = makeStyles(theme => ({
  listItem: {
    borderRadius: 5,
  },
  listItemPressed: {
    backgroundColor: theme.colors.accent,
  },
  title: {},
}));
