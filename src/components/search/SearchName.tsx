import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {makeStyles} from '@rneui/themed';
import React, {useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

import {CouleurbummelModel} from '../../model/model';
import {Address, Corporation} from '../../types/model';
import {ScreenProps, StackScreenParamsList} from '../../types/screens';
import {ModelContext} from '../contexts/ModelContext';
import {CorporationDetailsScreen} from '../CorporationDetailsScreen';
import {CorporationList} from '../explore/CorporationList';
import {SortButton} from '../explore/SortButton';
import {ToggleDrawerButton} from '../navigation/ToggleDrawerButton';

const Stack = createNativeStackNavigator<StackScreenParamsList>();

const screenName = 'SearchName';
const NamedSortButton = () => <SortButton screenName={screenName} />;

/**
 * The root screen in the search by name section
 */
export const SearchNameScreen = ({}: ScreenProps) => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: t('SCREEN_SEARCH_NAME'),
          headerLeft: ToggleDrawerButton,
          headerRight: NamedSortButton,
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

const fetchCorporations = (model: CouleurbummelModel) =>
  [...model.mapDisplayables().entries()].flatMap(([address, mds]) =>
    mds.corporations.map(c => [address, c] as [Address, Corporation]),
  );

interface SearchProps {
  searchDelayMs?: number;
}

const SearchScreen = ({}: SearchProps) => {
  const styles = useStyles();
  const model = useContext(ModelContext);

  const corporations = useMemo(() => fetchCorporations(model), [model]);

  return (
    <View style={styles.container}>
      <CorporationList
        testID={'Screen:SearchName'}
        addressesAndCorporations={corporations}
        parentScreenName={screenName}
        searchable={true}
        searchOptions={{showsResultsOnEmptySearch: false}}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
  },
  listItemPressed: {
    backgroundColor: theme.colors.accent,
  },
  listItemDefault: {
    backgroundColor: theme.colors.white,
  },
}));
