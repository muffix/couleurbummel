import {Button, Icon, ListItem, makeStyles, useTheme} from '@rneui/themed';
import React, {
  ForwardedRef,
  RefObject,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {GestureResponderEvent, View} from 'react-native';
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
  const styles = useStyles();

  const [showPopover, setShowPopover] = useState(false);
  const {globalState, dispatch} = useContext(StateContext);

  const [selectedOption, setSelectedOption] = useState(
    globalState.corporationSorting[screenName],
  );

  useEffect(() => {
    setSelectedOption(globalState.corporationSorting[screenName]);
  }, [screenName, globalState]);

  const popoverSource = (sourceRef: RefObject<View>) => (
    <ButtonWithForwardedRef
      onPress={() => setShowPopover(true)}
      ref={sourceRef}
    />
  );

  const onSortOptionPress = (option: SortOption) => () => {
    dispatch(setSortOptionAction(screenName, option));
    setShowPopover(false);
  };

  return (
    <Popover
      animationConfig={{duration: 200}}
      isVisible={showPopover}
      onRequestClose={() => setShowPopover(false)}
      popoverStyle={styles.popover}
      from={popoverSource}>
      <View>
        <SortItem
          isSelected={selectedOption === 'name'}
          iconName={constants.icons.sort.sortByName}
          translationKey={'SORT_NAME'}
          onPress={onSortOptionPress('name')}
        />
        <SortItem
          isSelected={selectedOption === 'distance'}
          iconName={constants.icons.sort.sortByDistance}
          translationKey={'SORT_DISTANCE'}
          onPress={onSortOptionPress('distance')}
        />
      </View>
    </Popover>
  );
};

interface SortItemProps {
  isSelected: boolean;
  iconName: string;
  translationKey: TranslationKey;
  onPress: (event: GestureResponderEvent) => void;
}

/**
 * An item in the list of available options to sort a list
 * @param isSelected whether the current option is selected
 * @param iconName the name of the icon
 * @param translationKey the key to translate the option name
 * @param onPress an event handler that is run when the item is pressed
 */
const SortItem = ({
  isSelected,
  iconName,
  translationKey,
  onPress,
}: SortItemProps) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <ListItem
      onPress={onPress}
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
        color={isSelected ? theme.colors.primary : 'transparent'}
      />
    </ListItem>
  );
};

/**
 * A button with a forwarded ref
 */
const ButtonWithForwardedRef = React.forwardRef(
  (
    props: {onPress: (event: GestureResponderEvent) => void},
    ref: ForwardedRef<View>,
  ) => {
    const styles = useStyles();
    const {theme} = useTheme();

    return (
      // We need to pass `renderToHardwareTextureAndroid` and `collapsable` for Android devices to correctly determine
      // the coordinates of the source of the popover.
      // See https://github.com/SteffeyDev/react-native-popover-view#show-from-a-ref-not-working
      <View ref={ref} renderToHardwareTextureAndroid={true} collapsable={false}>
        <Button
          buttonStyle={styles.sortButton}
          icon={{
            name: constants.icons.sort.sortButton,
            color: theme.colors.primary,
          }}
          onPress={props.onPress}
        />
      </View>
    );
  },
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
