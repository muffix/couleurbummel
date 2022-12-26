import {Icon, ListItem, makeStyles} from '@rneui/themed';
import React, {memo} from 'react';
import {Linking, PressableStateCallbackType} from 'react-native';

import log from '../../log';

/**
 * A single row with icon and text
 *
 * The optional onPress parameter takes a string which it attempts to interpret as a link or a handler function.
 */
export const DetailRow = memo(
  ({
    iconName,
    text,
    onPress,
  }: {
    iconName: string;
    text: string;
    onPress?: string | (() => void);
  }) => {
    if (typeof onPress === 'string') {
      const url = onPress as string;

      onPress = () => {
        Linking.canOpenURL(url)
          .then(can => {
            if (!can) {
              log.info('Cannot open URL', url);
              return;
            }
            Linking.openURL(url)
              .then(res => log.debug('Opened url', url, res))
              .catch(e => log.error('Error opening', url, e));
          })
          .catch(e => {
            log.error('Error determining if device can open', url, e);
          });
      };
    }

    const styles = useStyles();

    return (
      <ListItem
        {...(onPress && {onPress: onPress as () => void})}
        style={
          onPress
            ? ({pressed}: PressableStateCallbackType) =>
                pressed
                  ? [styles.listItem, styles.listItemPressed]
                  : styles.listItem
            : styles.listItem
        }>
        <Icon name={iconName} />
        <ListItem.Content>
          <ListItem.Title selectable>{text}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  },
);

const useStyles = makeStyles(theme => ({
  listItem: {
    borderRadius: 5,
  },
  listItemPressed: {
    backgroundColor: theme.colors.accent,
  },
}));
