import {makeStyles, SearchBar, useTheme} from '@rneui/themed';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Platform, View} from 'react-native';

import constants from '../constants';
import log from '../log';

export interface SearchableListProps<T> {
  allItems: T[];
  filterItems: (searchTerm: string, items: T[]) => T[];
  renderItem: (item: T) => React.ReactElement;
  keyExtractor: (item: T) => string;
  showsAllResultsOnEmptySearch?: boolean;
  searchDelayMs?: number;
  headerComponent?: React.ReactElement<{}>;
  testID?: string;
}

/**
 * A flat list with a search bar
 *
 * @param filterItems function filtering the items based on the search text
 * @param allItems all possible items
 * @param renderItem function rendering the row for a given item
 * @param keyExtractor function returning the key for an item
 * @param searchDelayMs how long to wait for another key press before starting the search
 * @param testID a string to identify the list in a test setting
 * @param showsAllResultsOnEmptySearch if true and the search bar is empty, all results are shown
 */
export const SearchableList = <T extends unknown>({
  filterItems,
  allItems,
  renderItem,
  keyExtractor,
  searchDelayMs,
  headerComponent,
  testID,
  showsAllResultsOnEmptySearch = true,
}: SearchableListProps<T>) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const styles = useStyles();

  const [searchTerm, setSearchTerm] = useState('');
  const [delayTimerId, setDelayTimerId] = useState<number>();
  const [filteredItems, setFilteredItems] = useState<T[]>([]);

  useMemo(() => {
    log.debug(`raw search term: '${searchTerm}'`);

    if (!searchTerm) {
      setDelayTimerId(undefined);
      setFilteredItems(showsAllResultsOnEmptySearch ? allItems : []);
      return;
    }

    const processedSearchTerm = searchTerm.trim().toLowerCase();

    log.debug('setting timer');
    setDelayTimerId(
      // @ts-ignore
      setTimeout(
        () => {
          setDelayTimerId(undefined);

          const filtered = filterItems(processedSearchTerm, allItems);
          log.debug(
            `Searching for '${processedSearchTerm}' returned ${filtered.length} results out of ${allItems.length}`,
          );

          setFilteredItems(filtered);
        },
        searchDelayMs !== undefined
          ? searchDelayMs
          : constants.explore.search.delayMs,
      ),
    );
  }, [
    allItems,
    filterItems,
    showsAllResultsOnEmptySearch,
    searchDelayMs,
    searchTerm,
  ]);

  return (
    <View style={styles.container} testID={testID}>
      <SearchBar
        placeholder={t('SEARCH_BAR_PLACEHOLDER')}
        numberOfLines={1}
        theme={theme}
        // This is a workaround for a bug where the characters already input are repeated on some Android keyboards
        // This disables predictive typing and autocorrect for Androids.
        //
        // See https://github.com/facebook/react-native/issues/30503
        keyboardType={
          Platform.OS === 'android' ? 'visible-password' : 'default'
        }
        round
        showLoading={delayTimerId !== undefined}
        onClear={() => {
          if (delayTimerId) {
            clearTimeout(delayTimerId);
          }
          setSearchTerm('');
        }}
        onChangeText={text => {
          if (delayTimerId) {
            clearTimeout(delayTimerId);
          }
          setSearchTerm(text);
        }}
        value={searchTerm}
      />
      <FlatList
        ListHeaderComponent={headerComponent}
        keyExtractor={keyExtractor}
        data={filteredItems}
        renderItem={({item}) => renderItem(item)}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
}));
