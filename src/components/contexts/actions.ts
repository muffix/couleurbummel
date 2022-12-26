import {DrawerScreenName, ScreenWithCorporationList} from '../../types/screens';
import {
  ActionKind,
  SetActiveDrawerItem,
  SetSortOptionAction,
  SortOption,
  ToggleFavouriteAction,
} from '../../types/state';

export const toggleFavouriteCityAction: (
  id: string,
) => ToggleFavouriteAction = (id: string) => {
  return {
    kind: ActionKind.ToggleFavourite,
    payload: {
      type: 'city',
      favouriteId: id,
    },
  };
};

export const toggleFavouriteCorporationAction: (
  id: string,
) => ToggleFavouriteAction = (id: string) => {
  return {
    kind: ActionKind.ToggleFavourite,
    payload: {
      type: 'corporation',
      favouriteId: id,
    },
  };
};

export const setSortOptionAction: (
  screen: ScreenWithCorporationList,
  sortOption: SortOption,
) => SetSortOptionAction = (
  screen: ScreenWithCorporationList,
  sortOption: SortOption,
) => {
  return {
    kind: ActionKind.SetSortOption,
    payload: {
      screen,
      sortOption,
    },
  };
};

export const setActiveDrawerAction: (
  screenName: DrawerScreenName,
) => SetActiveDrawerItem = (screenName: DrawerScreenName) => {
  return {
    kind: ActionKind.DrawerItemSelected,
    payload: {
      screenName: screenName,
    },
  };
};
