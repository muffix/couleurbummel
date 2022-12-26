import {ThemeProvider} from '@rneui/themed';
import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';
import {Text} from 'react-native';

import {SearchableList} from '../../src/components/SearchableList';
import {theme} from '../../src/style/themes';
import {waitForPromisesToResolveWithAct} from '../__helpers__/helpers';

describe('Country list', () => {
  const cityNames = ['Aachen', 'Berlin', 'München', 'Tübingen'];
  const testSearchableList = (
    <ThemeProvider theme={theme}>
      <SearchableList
        allItems={cityNames}
        filterItems={(searchTerm, items) =>
          items.filter(item => item.includes(searchTerm))
        }
        keyExtractor={item => item}
        renderItem={item => <Text>{item}</Text>}
      />
    </ThemeProvider>
  );

  it('renders correctly with no optional fields set', async () => {
    render(testSearchableList);

    await waitForPromisesToResolveWithAct().then(() =>
      expect(screen.toJSON()).toMatchSnapshot(),
    );
  });

  it('displays nothing if search term is empty', async () => {
    render(testSearchableList);

    await waitForPromisesToResolveWithAct().then(() =>
      expect(screen.toJSON()).toMatchSnapshot(),
    );
  });

  it('filters the list when searched', async () => {
    render(testSearchableList);

    const searchField = screen.getByPlaceholderText('SEARCH_BAR_PLACEHOLDER');
    fireEvent.changeText(searchField, 'chen');

    await waitForPromisesToResolveWithAct().then(() => {
      expect(screen.toJSON()).toMatchSnapshot();
    });
  });
});
