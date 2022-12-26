import {DrawerActions, useNavigation} from '@react-navigation/native';
import {Button, makeStyles, useTheme} from '@rneui/themed';
import React from 'react';

import constants from '../../constants';

/**
 * The button to toggle the drawer
 */
export const ToggleDrawerButton = () => {
  const {theme} = useTheme();
  const styles = useStyles();
  const navigation = useNavigation();

  return (
    <Button
      buttonStyle={styles.menuButton}
      icon={{name: constants.icons.drawer.menu, color: theme.colors.primary}}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
    />
  );
};
const useStyles = makeStyles(() => ({
  menuButton: {
    backgroundColor: 'transparent',
  },
}));
