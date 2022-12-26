import {ThemeMode} from '@rneui/themed';
import {consoleTransport} from 'react-native-logs';
import {Point, Region} from 'react-native-maps/lib/sharedTypes';

import {DrawerScreenName} from './types/screens';
import {GlobalState, Language, SortOptions, Theme} from './types/state';

export type IconKey =
  | DrawerScreenName
  | 'Favourites'
  | 'Explore'
  | 'Search'
  | 'GitHub';
export type LatLngDeltas = {latitudeDelta: number; longitudeDelta: number};

interface Constants {
  logging: {
    levels: {[level: string]: number};
    transport: any;
    transportOptions: {
      mapLevels: {[level: string]: string};
      colors: {[level: string]: string};
    };
  };
  userLocation: {
    // Ignore location changes smaller than this value
    distanceFilterMetres: number;
  };
  icons: {
    // Icons for the drawer menu and its entries
    drawer: {[key in IconKey]: string} & {menu: string};
    // Icons displayed in the list of details of a map displayable
    mapDisplayable: {
      longName: string;
      address: string;
      phone: string;
      mail: string;
      website: string;
      comment: string;
    };
    // Icons displayed in the list of details of a corporation
    corporationDetails: {
      organisation: string;
      fencing: string;
      colours: string;
      foundation: string;
      jourFixe: string;
    };
    // Icons displayed in the list of details of a point of interest
    poiDetails: {
      associatedCorporation: string;
    };
    explore: {
      favourite: string;
      nonFavourite: string;
      showOnMap: string;
      requestChange: string;
    };
    sort: {
      sortButton: string;
      selectedSortOption: string;
      sortbyName: string;
      sortByDistance: string;
    };
    favourites: {
      city: string;
      corporation: string;
    };
    map: {
      myLocationButton: string;
    };
    coloursSearch: {
      dropdownIcon: string;
    };
  };
  map: {
    defaultRegionDeltas: LatLngDeltas;
    // The region on which to start the map if we don't have a user location (yet)
    defaultRegion: Region;
    // How wide the map callout should be, as a factor of the screen width
    calloutWidthFactor: number;
    // How much space we want to leave at the bottom for map popovers, as a factor of the screen height
    popoverBottomSpaceFactor: number;
    // How far we want to zoom in when jumping to a marker
    zoomToMarkerDeltas: LatLngDeltas;
    // Offset the centre of the markers to compensate for their size
    markerCentreOffset: Point;
    clustering: {
      // Minimum number of map markers required to form a cluster
      minNumber: number;
      // Maximum zoom level at which to cluster. If zoomed in further than this (higher numbers), do not cluster markers
      maxZoomLevel: number;
    };
  };
  explore: {
    search: {
      // How long to delay the search for after a key press, in milliseconds.
      // This improves the performance by avoiding unnecessary searches if keys are pressed in quick succession.
      delayMs: number;
    };
  };
  urls: {
    // The GitHub project
    github: string;
  };
  coloursSearch: {
    maxNumber: number;
    minNumber: number;
    defaultNumber: number;
  };
  defaultTheme: ThemeMode;
  defaultState: GlobalState;
}

// Deltas are used in combination with LatLngs to make a region that is displayed on the map.
// The LatLng is going to be the centre of the map, and the deltas determine the zoom level.
const defaultRegionDeltas = {
  latitudeDelta: 11.576627411414329,
  longitudeDelta: 9.483221,
};

const constants: Readonly<Constants> = Object.freeze({
  defaultState: {
    uiState: {
      screenName: 'Map' as DrawerScreenName,
    },
    settings: {
      language: Language.auto,
      theme: Theme.Auto,
    },
    favourites: {
      corporation: new Set<string>(),
      city: new Set<string>(),
    },
    corporationSorting: {
      Cities: 'name',
      Countries: 'name',
      Closest: 'distance',
      Organisations: 'name',
      SearchName: 'name',
      SearchColours: 'name',
    } as SortOptions,
  },
  logging: {
    levels: {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    },
    transport: consoleTransport,
    transportOptions: {
      colors: {
        info: 'blueBright',
        warn: 'yellowBright',
        error: 'redBright',
      },
      mapLevels: {
        debug: 'log',
        info: 'info',
        warn: 'warn',
        err: 'error',
      },
    },
  },
  userLocation: {
    distanceFilterMetres: 50, // in metres
  },
  icons: {
    drawer: {
      menu: 'menu',
      Map: 'map-marker',
      Favourites: 'star',
      Explore: 'folder-home-outline',
      ExploreNearby: 'map-marker-circle',
      ExploreCities: 'home-city-outline',
      ExploreCountries: 'earth',
      ExploreOrganisations: 'account-group-outline',
      Search: 'magnify',
      SearchName: 'home-search-outline',
      SearchColours: 'flag-outline',
      Settings: 'tune',
      GitHub: 'github',
    },
    mapDisplayable: {
      longName: 'home',
      address: 'map-marker',
      phone: 'phone',
      mail: 'email-outline',
      website: 'web',
      comment: 'comment-outline',
    },
    corporationDetails: {
      organisation: 'account-group-outline',
      fencing: 'fencing',
      colours: 'flag',
      foundation: 'calendar',
      jourFixe: 'glass-mug-variant',
    },
    poiDetails: {
      associatedCorporation: 'shield-home-outline',
    },
    explore: {
      favourite: 'star',
      nonFavourite: 'star-outline',
      showOnMap: 'map-marker',
      requestChange: 'tooltip-edit-outline',
    },
    sort: {
      sortButton: 'sort',
      selectedSortOption: 'check',
      sortbyName: 'sort-alphabetical-ascending',
      sortByDistance: 'map-marker',
    },
    favourites: {
      city: 'home-city-outline',
      corporation: 'flag',
    },
    map: {
      myLocationButton: 'crosshairs-gps',
    },
    coloursSearch: {
      dropdownIcon: 'palette',
    },
  },
  map: {
    defaultRegionDeltas: defaultRegionDeltas,
    defaultRegion: {
      ...defaultRegionDeltas,
      latitude: 51.3127342,
      longitude: 10.355706,
    },
    calloutWidthFactor: 0.62,
    popoverBottomSpaceFactor: 0.1,
    clustering: {
      minNumber: 5,
      maxZoomLevel: 11,
    },
    zoomToMarkerDeltas: {
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    },
    markerCentreOffset: {x: 0, y: -30},
  },
  explore: {
    search: {
      delayMs: 500,
    },
  },
  urls: {
    github: 'https://github.com/muffix/couleurbummel',
  },
  coloursSearch: {
    maxNumber: 5,
    minNumber: 1,
    defaultNumber: 3,
  },
  defaultTheme: 'light',
});

export default constants;
