import {Button, makeStyles, useTheme} from '@rneui/themed';
import React, {memo, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import constants from '../constants';
import log from '../log';
import {ToggleFavouriteAction} from '../types/state';
import {StateContext} from './contexts/GlobalStateContext';

export interface FavouriteButtonProps {
  itemId: string;
  toggleAction: (id: string) => ToggleFavouriteAction;
  postDispatch?: () => void;
}

/**
 * A button to toggle an item as a favourite
 *
 * @param itemId the ID of the item
 * @param toggleAction the action to dispatch to toggle the item as a favourite
 * @param postDispatch function to call after dispatching
 */
export const FavouriteButton = memo(
  ({itemId, toggleAction, postDispatch}: FavouriteButtonProps) => {
    const {globalState, dispatch} = useContext(StateContext);
    const styles = useStyles();
    const {theme} = useTheme();
    const {t} = useTranslation();

    const [isFavourite, setIsFavourite] = useState(
      globalState.favourites.corporation.has(itemId),
    );

    useEffect(() => {
      log.debug('State changed: FavouriteButton');
      setIsFavourite(globalState.favourites.corporation.has(itemId));
    }, [globalState, itemId]);

    return (
      <Button
        buttonStyle={styles.favouriteButton}
        title={t('BUTTON_FAVOURITE') || ''}
        icon={{
          name: isFavourite
            ? constants.icons.explore.favourite
            : constants.icons.explore.nonFavourite,
          color: theme.colors.iconOnPrimaryColourBackgroundColour,
        }}
        onPress={() => {
          dispatch(toggleAction(itemId));
          if (postDispatch) {
            postDispatch();
          }
        }}
      />
    );
  },
);

const useStyles = makeStyles(() => ({
  favouriteButton: {
    height: '100%',
  },
}));
