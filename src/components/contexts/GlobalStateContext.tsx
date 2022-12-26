import React, {PropsWithChildren, useReducer} from 'react';

import constants from '../../constants';
import log from '../../log';
import {getGlobalState, persistGlobalState} from '../../storage';
import {Action, ActionKind, GlobalState} from '../../types/state';

/**
 * A global context for user preferences and settings
 */
export const StateContext = React.createContext({
  globalState: constants.defaultState,
  dispatch: (_action => {}) as React.Dispatch<Action>,
});

export const StateContextProvider = ({children}: PropsWithChildren) => {
  const [state, dispatch] = useReducer(
    reducer,
    constants.defaultState,
    defaultState => {
      getGlobalState().then(recoveredState => {
        log.debug('Recovered state from storage', recoveredState);
        dispatch({
          kind: ActionKind.StateLoaded,
          payload: {state: recoveredState},
        });
      });
      return defaultState;
    },
  );

  return (
    <StateContext.Provider value={{globalState: state, dispatch}}>
      {children}
    </StateContext.Provider>
  );
};

const reducer = (state: GlobalState, action: Action) => {
  log.debug('Action:', action);
  const newState = {...state};

  switch (action.kind) {
    case ActionKind.StateLoaded: {
      return action.payload.state;
    }
    case ActionKind.SetSortOption: {
      newState.corporationSorting[action.payload.screen] =
        action.payload.sortOption;

      persistGlobalState(state).then(() => log.debug('State persisted'));

      return newState;
    }
    case ActionKind.ToggleFavourite: {
      const favouriteId = action.payload.favouriteId;

      if (action.payload.type === 'city') {
        if (newState.favourites.city.has(favouriteId)) {
          newState.favourites.city.delete(favouriteId);
        } else {
          newState.favourites.city.add(favouriteId);
        }
      } else if (action.payload.type === 'corporation') {
        if (newState.favourites.corporation.has(favouriteId)) {
          newState.favourites.corporation.delete(favouriteId);
        } else {
          newState.favourites.corporation.add(favouriteId);
        }
      }

      persistGlobalState(state).then(() => log.debug('State persisted'));

      return newState;
    }
    case ActionKind.DrawerItemSelected: {
      newState.uiState.screenName = action.payload.screenName;
      return newState;
    }
    case ActionKind.LanguageSelected: {
      newState.settings.language = action.payload.language;
      return newState;
    }
    case ActionKind.ThemeSelected: {
      newState.settings.theme = action.payload.theme;
      return newState;
    }
  }
  return state;
};
