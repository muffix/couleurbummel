import {StackActions, useNavigation} from '@react-navigation/native';
import {ListItem, makeStyles} from '@rneui/themed';
import iso3166 from 'i18n-iso-countries';
import i18next from 'i18next';
import {memo, useContext, useMemo} from 'react';
import {FlatList} from 'react-native';
import CountryFlag from 'react-native-country-flag';

import {City, Country} from '../../types/model';
import {CountriesProps} from '../../types/screens';
import {ModelContext} from '../contexts/ModelContext';

export const CountryListScreen = ({}: CountriesProps) => <CountryList />;

/**
 * A list of countries
 */
export const CountryList = () => {
  const styles = useStyles();
  const model = useContext(ModelContext);

  const countries = useMemo(
    () =>
      model
        .allCountries()
        .sort((a, b) =>
          iso3166
            .getName(a.isoCode, i18next.language)
            .localeCompare(iso3166.getName(b.isoCode, i18next.language)),
        ),
    [model],
  );

  return (
    <>
      <FlatList
        style={styles.container}
        testID={'Screen:ExploreCountries'}
        keyExtractor={(country: Country) => country.id}
        data={countries}
        renderItem={({item}) => <CountryRow country={item} />}
      />
    </>
  );
};

const CountryRow = memo(({country}: {country: Country}) => {
  const styles = useStyles();
  const model = useContext(ModelContext);
  const navigation = useNavigation();

  if (!country.cityIds?.length) {
    return null;
  }

  return (
    <ListItem
      onPress={() => {
        const cities = country.cityIds
          ?.map(cityId => model.city(cityId))
          .filter(c => !!c)
          .map(c => c as City)
          .sort((a, b) => a.name.localeCompare(b.name));
        if (cities) {
          navigation.dispatch(
            StackActions.push('Cities', {
              cities,
            }),
          );
        }
      }}
      style={({pressed}) =>
        pressed ? [styles.listItem, styles.listItemPressed] : styles.listItem
      }>
      <CountryFlag style={styles.flag} isoCode={country.isoCode} size={25} />
      <ListItem.Content>
        <ListItem.Title style={styles.title}>
          {iso3166.getName(country.isoCode.toUpperCase(), i18next.language)}
        </ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
});

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  flag: {
    borderColor: theme.colors.greyOutline,
    borderWidth: 0.2,
    borderRadius: 2,
  },
  listItem: {
    borderRadius: 5,
  },
  listItemPressed: {
    backgroundColor: theme.colors.accent,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}));
