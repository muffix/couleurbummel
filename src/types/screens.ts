import {DrawerScreenProps} from '@react-navigation/drawer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {Region} from 'react-native-maps/lib/sharedTypes';

import {Address, City, Corporation} from './model';

export type DrawerScreenParamsList = {
  Map: {
    region?: Region;
    addressIds?: string[];
  };
  ExploreNearby: undefined;
  ExploreCities: undefined;
  ExploreCountries: undefined;
  ExploreOrganisations: undefined;
  SearchName: undefined;
  SearchColours: undefined;
  Settings: undefined;
};

export type DrawerScreenName = keyof DrawerScreenParamsList;

export type ScreenProps = DrawerScreenProps<
  DrawerScreenParamsList,
  DrawerScreenName
>;

export type MapScreenProps = DrawerScreenProps<DrawerScreenParamsList, 'Map'>;
export type ColoursSearchScreenProps = DrawerScreenProps<
  DrawerScreenParamsList,
  'SearchColours'
>;
export type SettingsScreenProps = DrawerScreenProps<
  DrawerScreenParamsList,
  'Settings'
>;

export type CorporationListType = 'searchable' | 'non-searchable' | 'fragment';

export interface CorporationListProps {
  addressesAndCorporations: [Address, Corporation][];
  parentScreenName: ScreenWithCorporationList;
  searchable: boolean;
  searchOptions?: {
    showsResultsOnEmptySearch?: boolean;
  };
  headerTitle?: string;
  hideOrganisation?: boolean;
  headerComponent?: React.ReactElement<{}>;
  testID?: string;
}

export interface CityListProps {
  cities?: City[];
  testID?: string;
}

export type StackScreenParamsList = {
  CorporationList: CorporationListProps;
  Search: undefined;
  Cities: CityListProps;
  CorporationDetails: {corporation: Corporation};
  Countries: undefined;
  Organisations: undefined;
};

export type ExploreScreen =
  | 'Cities'
  | 'Countries'
  | 'Organisations'
  | 'Closest';

export type ScreenWithCorporationList =
  | ExploreScreen
  | 'SearchName'
  | 'SearchColours';

export type SearchScreenProps = NativeStackScreenProps<
  StackScreenParamsList,
  'Search'
>;

export type CorporationListScreenProps = NativeStackScreenProps<
  StackScreenParamsList,
  'CorporationList'
>;

export type CorporationDetailsScreenProps = NativeStackScreenProps<
  StackScreenParamsList,
  'CorporationDetails'
>;

export type CitiesScreenProps = NativeStackScreenProps<
  StackScreenParamsList,
  'Cities'
>;

export type CountriesProps = NativeStackScreenProps<
  StackScreenParamsList,
  'Countries'
>;

export type OrganisationProps = NativeStackScreenProps<
  StackScreenParamsList,
  'Organisations'
>;
