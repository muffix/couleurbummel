import {Button, Icon, ListItem, makeStyles, useTheme} from '@rneui/themed';
import React, {ForwardedRef, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, ViewProps} from 'react-native';
import Popover from 'react-native-popover-view';

import constants from '../../constants';
import {TranslationKey} from '../../types/i18n';
import {ScreenWithCorporationList} from '../../types/screens';
import {SortOption} from '../../types/state';
import {setSortOptionAction} from '../contexts/actions';
import {StateContext} from '../contexts/GlobalStateContext';

interface SortButtonProps {
  screenName: ScreenWithCorporationList;
}

/**
 * A button triggering a popover allowing the user to set by which criteria a list should be sorted
 *
 * @param screenName the name of the explore screen under which this item is nested
 */
export const SortButton = ({screenName}: SortButtonProps) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const styles = useStyles();

  const [showPopover, setShowPopover] = useState(false);
  const {globalState, dispatch} = useContext(StateContext);

  const [selectedOption, setSelectedOption] = useState(
    globalState.corporationSorting[screenName],
  );

  useEffect(() => {
    setSelectedOption(globalState.corporationSorting[screenName]);
  }, [screenName, globalState]);

  const sortItem = (
    option: SortOption,
    iconName: string,
    translationKey: TranslationKey,
  ) => (
    <ListItem
      onPress={() => {
        dispatch(setSortOptionAction(screenName, option));
        setShowPopover(false);
      }}
      style={({pressed}) =>
        pressed ? [styles.listItem, styles.listItemPressed] : styles.listItem
      }
      bottomDivider>
      <Icon name={iconName} />
      <ListItem.Content>
        <ListItem.Title>{t(translationKey)}</ListItem.Title>
      </ListItem.Content>
      <Icon
        name={constants.icons.sort.selectedSortOption}
        color={selectedOption === option ? theme.colors.primary : 'transparent'}
      />
    </ListItem>
  );

  return (
    <Popover
      animationConfig={{duration: 200}}
      isVisible={showPopover}
      onRequestClose={() => setShowPopover(false)}
      popoverStyle={styles.popover}
      from={sourceRef => (
        <ViewWithForwardedRef ref={sourceRef}>
          <Button
            buttonStyle={styles.sortButton}
            icon={{
              name: constants.icons.sort.sortButton,
              color: theme.colors.primary,
            }}
            onPress={() => setShowPopover(true)}
          />
        </ViewWithForwardedRef>
      )}
      debug>
      <View>
        {sortItem('name', constants.icons.sort.sortbyName, 'SORT_NAME')}
        {sortItem(
          'distance',
          constants.icons.sort.sortByDistance,
          'SORT_DISTANCE',
        )}
      </View>
    </Popover>
  );
};

const ViewWithForwardedRef = React.forwardRef(
  (props: ViewProps, ref: ForwardedRef<View>) => (
    <View ref={ref} renderToHardwareTextureAndroid={true} collapsable={false}>
      {props.children}
    </View>
  ),
);

const useStyles = makeStyles(theme => ({
  popover: {
    backgroundColor: theme.colors.grey5,
    borderRadius: 3,
  },
  listItem: {
    backgroundColor: theme.colors.white,
  },
  listItemPressed: {
    backgroundColor: theme.colors.accent,
  },
  sortButton: {
    backgroundColor: 'transparent',
  },
}));
