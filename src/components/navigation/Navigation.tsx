import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerNavigationOptions,
} from '@react-navigation/drawer';
import {DrawerContentComponentProps} from '@react-navigation/drawer/src/types';
import {
  DrawerActions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {
  Icon,
  ListItem,
  makeStyles,
  useTheme,
  useThemeMode,
} from '@rneui/themed';
import React, {memo, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Linking,
  PressableStateCallbackType,
  Text,
  useColorScheme,
  ViewStyle,
} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

import constants, {IconKey} from '../../constants';
import log from '../../log';
import {navigationTheme} from '../../style/themes';
import {TranslationKey} from '../../types/i18n';
import {Address} from '../../types/model';
import {DrawerScreenName, DrawerScreenParamsList} from '../../types/screens';
import {Theme} from '../../types/state';
import {setActiveDrawerAction} from '../contexts/actions';
import {StateContext} from '../contexts/GlobalStateContext';
import {ModelContext} from '../contexts/ModelContext';
import {ExploreCitiesScreen} from '../explore/ExploreCities';
import {ExploreCountriesScreen} from '../explore/ExploreCountries';
import {ExploreNearbyScreen} from '../explore/ExploreNearby';
import {ExploreOrganisationsScreen} from '../explore/ExploreOrganisations';
import {MapScreen} from '../Map';
import {SearchColoursScreen} from '../search/SearchColours';
import {SearchNameScreen} from '../search/SearchName';
import {SettingsScreen} from '../Settings';
import {ToggleDrawerButton} from './ToggleDrawerButton';

const Drawer = createDrawerNavigator<DrawerScreenParamsList>();

const drawerOptions: DrawerNavigationOptions = {
  drawerType: 'front',
  drawerIcon: ({size}) => <Icon name={'menu'} size={size} />,
};

/**
 * The custom navigation content in the drawer menu
 */
export const Navigation = () => {
  const {setMode} = useThemeMode();
  const {t} = useTranslation();
  const {globalState} = useContext(StateContext);

  const systemColourScheme = useColorScheme() || constants.defaultTheme;
  const [userColourScheme, setUserColourScheme] = useState(systemColourScheme);

  // Apply the correct theme
  useEffect(() => {
    switch (globalState.settings.theme) {
      case Theme.Auto:
        setUserColourScheme(systemColourScheme);
        break;
      case Theme.Light:
        setUserColourScheme('light');
        break;
      case Theme.Dark:
        setUserColourScheme('dark');
        break;
    }
  }, [globalState, systemColourScheme]);

  // If the user selected a theme, use it
  useEffect(() => {
    setMode(userColourScheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userColourScheme]);

  return (
    <NavigationContainer
      onReady={() => RNBootSplash.hide({fade: true})}
      theme={
        userColourScheme === 'dark'
          ? navigationTheme.darkTheme
          : navigationTheme.lightTheme
      }>
      <Drawer.Navigator
        initialRouteName="Map"
        screenOptions={{...drawerOptions}}
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          options={{
            headerShown: false,
          }}
          name="Map"
          initialParams={{region: constants.map.defaultRegion}}
          component={MapScreen}
        />

        <Drawer.Screen
          options={{headerShown: false}}
          name="ExploreNearby"
          component={ExploreNearbyScreen}
        />
        <Drawer.Screen
          options={{headerShown: false}}
          name="ExploreCities"
          component={ExploreCitiesScreen}
        />
        <Drawer.Screen
          options={{headerShown: false}}
          name="ExploreCountries"
          component={ExploreCountriesScreen}
        />
        <Drawer.Screen
          options={{headerShown: false}}
          name="ExploreOrganisations"
          component={ExploreOrganisationsScreen}
        />

        <Drawer.Screen
          options={{headerShown: false}}
          name="SearchName"
          component={SearchNameScreen}
        />
        <Drawer.Screen
          options={{headerShown: false}}
          name="SearchColours"
          component={SearchColoursScreen}
        />

        <Drawer.Screen
          options={{
            headerShown: true,
            title: t('SCREEN_SETTINGS'),
            headerLeft: () => <ToggleDrawerButton />,
          }}
          name="Settings"
          component={SettingsScreen}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

/**
 * An item in the drawer that links to a website
 */
const LinkItem = memo(
  (props: {
    iconKey: IconKey;
    titleTranslationKey: TranslationKey;
    url: string;
  }) => {
    const styles = useStyles();
    const {t} = useTranslation();

    return (
      <ListItem
        style={({pressed}) =>
          pressed ? [styles.listItem, styles.listItemPressed] : styles.listItem
        }
        onPress={() => Linking.openURL(props.url)}>
        <Icon name={constants.icons.drawer[props.iconKey]} />
        <ListItem.Content>
          <ListItem.Title>
            <Text style={styles.listItemText}>
              {t(props.titleTranslationKey)}
            </Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  },
);

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  useTheme();

  const {t} = useTranslation();
  const styles = useStyles();

  const {globalState, dispatch} = useContext(StateContext);
  const nav = props.navigation;

  const [activeDrawer, setActiveDrawer] = useState<DrawerScreenName>(
    globalState.uiState.screenName,
  );
  const [isExploreExpanded, setIsExploreExpanded] = useState(true);
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);

  useEffect(() => {
    setActiveDrawer(globalState.uiState.screenName);
  }, [globalState]);

  const screenItem = ({
    screenName,
    iconKey,
    titleTranslationKey,
    containerStyle,
  }: {
    screenName: DrawerScreenName;
    titleTranslationKey: TranslationKey;
    iconKey?: IconKey;
    containerStyle?: ViewStyle;
  }) => {
    return (
      <ListItem
        key={`drawer_menu_${screenName}`}
        testID={`Navigation:${screenName}`}
        style={({pressed}: PressableStateCallbackType) => {
          let style: ViewStyle[] = [styles.listItem];
          if (pressed) {
            style.push(styles.listItemPressed);
          }
          if (activeDrawer === screenName) {
            style.push(styles.listItemActive);
          }
          return style;
        }}
        {...(containerStyle && {containerStyle})}
        onPress={() => {
          dispatch(setActiveDrawerAction(screenName));
          nav.navigate(screenName);

          if (activeDrawer === screenName) {
            nav.closeDrawer();
          }
        }}>
        <Icon name={constants.icons.drawer[iconKey || screenName]} />
        <ListItem.Content>
          <ListItem.Title>
            <Text style={styles.listItemText}>{t(titleTranslationKey)}</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.scrollView}
      testID={'Navigation:CustomContent'}>
      {screenItem({
        screenName: 'Map',
        titleTranslationKey: 'SCREEN_MAP',
      })}

      <Favourites />

      <ListItem.Accordion
        key={'drawer_menu_explore'}
        testID={'Navigation:Explore'}
        style={styles.listItem}
        onPress={() => setIsExploreExpanded(!isExploreExpanded)}
        isExpanded={isExploreExpanded}
        content={
          <>
            <Icon name={constants.icons.drawer.Explore} />
            <ListItem.Content style={styles.accordionContent}>
              <ListItem.Title>
                <Text style={styles.listItemText}>{t('DRAWER_EXPLORE')}</Text>
              </ListItem.Title>
            </ListItem.Content>
          </>
        }>
        {screenItem({
          screenName: 'ExploreNearby',
          titleTranslationKey: 'SCREEN_NEARBY',
          containerStyle: styles.listItemContentInAccordion,
        })}

        {screenItem({
          screenName: 'ExploreCities',
          titleTranslationKey: 'SCREEN_CITIES',
          containerStyle: styles.listItemContentInAccordion,
        })}

        {screenItem({
          screenName: 'ExploreCountries',
          titleTranslationKey: 'SCREEN_COUNTRIES',
          containerStyle: styles.listItemContentInAccordion,
        })}

        {screenItem({
          screenName: 'ExploreOrganisations',
          titleTranslationKey: 'SCREEN_ORGANISATIONS',
          containerStyle: styles.listItemContentInAccordion,
        })}
      </ListItem.Accordion>

      <ListItem.Accordion
        key={'drawer_menu_search'}
        testID={'Navigation:Search'}
        style={styles.listItem}
        onPress={() => setIsSearchExpanded(!isSearchExpanded)}
        isExpanded={isSearchExpanded}
        content={
          <>
            <Icon name={constants.icons.drawer.Search} />
            <ListItem.Content style={styles.accordionContent}>
              <ListItem.Title>
                <Text style={styles.listItemText}>{t('DRAWER_SEARCH')}</Text>
              </ListItem.Title>
            </ListItem.Content>
          </>
        }>
        {screenItem({
          screenName: 'SearchName',
          titleTranslationKey: 'SCREEN_SEARCH_NAME',
          containerStyle: styles.listItemContentInAccordion,
        })}

        {screenItem({
          screenName: 'SearchColours',
          titleTranslationKey: 'SCREEN_SEARCH_COLOURS',
          containerStyle: styles.listItemContentInAccordion,
        })}
      </ListItem.Accordion>
      {screenItem({
        screenName: 'Settings',
        titleTranslationKey: 'SCREEN_SETTINGS',
      })}

      <LinkItem
        url={constants.urls.github}
        iconKey={'GitHub'}
        titleTranslationKey={'GITHUB'}
      />
    </DrawerContentScrollView>
  );
};

interface FavouriteItemProps {
  item: {id: string; name: string};
  addresses: Address[];
  iconName: string;
}

/**
 * An item inside the collapsible favourites menu
 */
const FavouriteItem = memo(
  ({item, addresses, iconName}: FavouriteItemProps) => {
    const {dispatch} = useContext(StateContext);
    const styles = useStyles();
    const navigation = useNavigation();

    return (
      <ListItem
        key={`favourite_item_${item.id}`}
        style={({pressed}) =>
          pressed ? [styles.listItem, styles.listItemPressed] : styles.listItem
        }
        containerStyle={styles.listItemContentInAccordion}
        onPress={() => {
          const newScreenName = 'Map';
          dispatch(setActiveDrawerAction(newScreenName));
          navigation.dispatch(
            DrawerActions.jumpTo(newScreenName, {
              addressIds: addresses.map(a => a.id),
            }),
          );
          navigation.dispatch(DrawerActions.closeDrawer);
        }}>
        <Icon name={iconName} />
        <ListItem.Content>
          <ListItem.Title>
            <Text style={styles.listItemText}>{item.name}</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  },
);

/**
 * The favourites menu in the drawer
 */
const Favourites = () => {
  const {globalState} = useContext(StateContext);
  const {t} = useTranslation();
  const styles = useStyles();

  const model = useContext(ModelContext);

  const [favourites, setFavourites] = useState(globalState.favourites);
  const [expanded, setExpanded] = useState(
    favourites.city.size > 0 || favourites.corporation.size > 0,
  );

  useEffect(() => {
    log.debug('Navigation: Global state changed.');
    setFavourites({...globalState.favourites});
  }, [globalState]);

  const [corporations, setCorporations] = useState(
    model.corporationsWithAddress(Array.from(favourites.corporation)),
  );
  const [cities, setCities] = useState(
    model.citiesWithAddresses(Array.from(favourites.city)),
  );

  useEffect(() => {
    log.debug('Navigation: Favourites changed.');
    setCities(model.citiesWithAddresses(Array.from(favourites.city)));
    setCorporations(
      model.corporationsWithAddress(Array.from(favourites.corporation)),
    );
  }, [favourites, model]);

  return (
    <ListItem.Accordion
      key={'drawer_menu_favourite'}
      testID={'Navigation:Favourites'}
      style={styles.listItem}
      onPress={() => setExpanded(!expanded)}
      isExpanded={expanded}
      content={
        <>
          <Icon name={constants.icons.drawer.Favourites} />
          <ListItem.Content style={styles.accordionContent}>
            <ListItem.Title>
              <Text style={styles.listItemText}>{t('DRAWER_FAVOURITES')}</Text>
            </ListItem.Title>
          </ListItem.Content>
        </>
      }>
      {cities.map(([city, addresses]) => (
        <FavouriteItem
          key={`favourite_${city.id}`}
          item={{
            id: city.id,
            name: city.name,
          }}
          addresses={addresses}
          iconName={constants.icons.favourites.city}
        />
      ))}
      {corporations.map(([c, address]) => (
        <FavouriteItem
          key={`favourite_${c.id}`}
          item={{
            id: c.id,
            name: c.shortName,
          }}
          addresses={[address]}
          iconName={constants.icons.favourites.corporation}
        />
      ))}
    </ListItem.Accordion>
  );
};

const useStyles = makeStyles(theme => ({
  scrollView: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
  },
  listItem: {
    marginHorizontal: 4,
    marginVertical: 4,
    backgroundColor: theme.colors.white,
    borderRadius: 5,
  },
  listItemPressed: {
    backgroundColor: theme.colors.grey5,
  },
  listItemActive: {
    backgroundColor: theme.colors.accent,
  },
  accordionContent: {marginHorizontal: 15},
  listItemContentInAccordion: {marginHorizontal: 20},
  listItemText: {color: theme.colors.black, fontWeight: 'bold'},
}));
