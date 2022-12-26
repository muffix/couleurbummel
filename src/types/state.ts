import {DrawerScreenName, ScreenWithCorporationList} from './screens';

export enum Language {
  auto,
  de,
  en,
}

export enum Theme {
  Auto,
  Light,
  Dark,
}

export interface UserSettings {
  language: Language;
  theme: Theme;
}

export interface UIState {
  screenName: DrawerScreenName;
}

type Options<OptionType extends string, ValueType> = {
  [Property in OptionType]: ValueType;
};

export type SortOption = 'distance' | 'name';
export type SortOptions = Options<ScreenWithCorporationList, SortOption>;

export type FavouriteKind = 'city' | 'corporation';
export type Favourites = {
  [kind in FavouriteKind]: Set<string>;
};
export type StoredFavourites = {
  [kind in FavouriteKind]: string[];
};

export interface GlobalState {
  uiState: UIState;
  settings: UserSettings;
  favourites: Favourites;
  corporationSorting: SortOptions;
}

export enum ActionKind {
  StateLoaded,
  SetSortOption,
  ToggleFavourite,
  DrawerItemSelected,
  LanguageSelected,
  ThemeSelected,
}

export type StateLoadedAction = {
  kind: ActionKind.StateLoaded;
  payload: {
    state: GlobalState;
  };
};

export type SetSortOptionAction = {
  kind: ActionKind.SetSortOption;
  payload: {
    screen: ScreenWithCorporationList;
    sortOption: SortOption;
  };
};

export type ToggleFavouriteAction = {
  kind: ActionKind.ToggleFavourite;
  payload: {
    type: 'city' | 'corporation';
    favouriteId: string;
  };
};

export type SetActiveDrawerItem = {
  kind: ActionKind.DrawerItemSelected;
  payload: {
    screenName: DrawerScreenName;
  };
};

export type SetLanguage = {
  kind: ActionKind.LanguageSelected;
  payload: {
    language: Language;
  };
};

type SetTheme = {
  kind: ActionKind.ThemeSelected;
  payload: {
    theme: Theme;
  };
};

export type Action =
  | StateLoadedAction
  | SetSortOptionAction
  | ToggleFavouriteAction
  | SetActiveDrawerItem
  | SetLanguage
  | SetTheme;
