import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Button,
  Icon,
  ListItem,
  makeStyles,
  Switch,
  Text,
  useTheme,
} from '@rneui/themed';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

import constants from '../../constants';
import log from '../../log';
import {Address, Corporation} from '../../types/model';
import {
  ColoursSearchScreenProps,
  DrawerScreenName,
  StackScreenParamsList,
} from '../../types/screens';
import {ModelContext} from '../contexts/ModelContext';
import {CorporationDetailsScreen} from '../CorporationDetailsScreen';
import Dropdown from '../Dropdown';
import {CorporationList} from '../explore/CorporationList';
import {SortButton} from '../explore/SortButton';
import {ToggleDrawerButton} from '../navigation/ToggleDrawerButton';
import {ColoursQuery, searchColours} from './helpers';

const screenName: DrawerScreenName = 'SearchColours';

const Stack = createNativeStackNavigator<StackScreenParamsList>();

export const SearchColoursScreen = ({}: ColoursSearchScreenProps) => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={SearchColours}
        options={{
          title: t('SCREEN_SEARCH_COLOURS'),
          headerLeft: () => <ToggleDrawerButton />,
          headerRight: () => <SortButton screenName={screenName} />,
        }}
      />
      <Stack.Screen
        name="CorporationDetails"
        options={{title: t('SCREEN_DETAILS')}}
        component={CorporationDetailsScreen}
      />
    </Stack.Navigator>
  );
};

interface SearchFieldsProps {
  onChange: (query: ColoursQuery) => void;
}

/**
 * A component to input a search query for colours or corporations
 * @param onChange Callback which is invoked when the user changes the query
 */
const SearchFields = ({onChange}: SearchFieldsProps) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const model = useContext(ModelContext);

  const [isExpanded, setIsExpanded] = useState(true);

  const [numColours, setNumColours] = useState(
    constants.coloursSearch.defaultNumber,
  );
  const [withBaseColour, setWithBaseColour] = useState(false);

  const [selectedColourFamilies, setSelectedColourFamilies] = useState<
    string[]
  >(Array(numColours).fill(''));
  const [selectedBaseColourFamily, setSelectedBaseColourFamily] = useState('');

  useEffect(
    () =>
      onChange({
        baseColourId: selectedBaseColourFamily,
        colourFamilyIds: selectedColourFamilies,
      }),
    [onChange, selectedBaseColourFamily, selectedColourFamilies],
  );

  const colourFamilies = useMemo(() => {
    const families = model.allColourFamilies();
    return [
      {label: t('SEARCH_COLOURS_ANY_COLOUR'), value: ''},
      ...families
        .map(f => ({
          label: t(f.translationKey),
          value: f.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    ];
  }, [t, model]);

  return (
    <View style={styles.container}>
      <ListItem.Accordion
        isExpanded={isExpanded}
        onPress={() => {
          setIsExpanded(!isExpanded);
        }}
        containerStyle={styles.accordionContainer}
        content={
          <ListItem.Title style={styles.parametersTitle}>
            {t('SEARCH_COLOURS_ACCORDION')}
          </ListItem.Title>
        }>
        <View style={styles.searchParametersContainer}>
          <ListItem bottomDivider containerStyle={styles.parameterItem}>
            <ListItem.Content>
              <ListItem.Title>
                {t('SEARCH_COLOURS_PARAMETER_BASE_COLOUR')}
              </ListItem.Title>
            </ListItem.Content>
            <Switch
              value={withBaseColour}
              onValueChange={value => {
                log.debug(value);
                setWithBaseColour(value);
              }}
            />
          </ListItem>
          <ListItem bottomDivider containerStyle={styles.parameterItem}>
            <ListItem.Content>
              <ListItem.Title>
                {t('SEARCH_COLOURS_PARAMETER_NUM_COLOURS')}
              </ListItem.Title>
            </ListItem.Content>
            <View style={styles.numColoursSelector}>
              <Button
                buttonStyle={styles.iconButtonStyle}
                icon={
                  <Icon
                    name={'minus-circle-outline'}
                    {...(numColours <= constants.coloursSearch.minNumber && {
                      color: theme.colors.white,
                    })}
                  />
                }
                onPress={() => {
                  const newNumColours = Math.max(numColours - 1, 1);
                  setNumColours(newNumColours);
                  setSelectedColourFamilies(
                    [...selectedColourFamilies].splice(0, newNumColours),
                  );
                }}
              />
              <Text style={styles.numColoursText}>{numColours}</Text>
              <Button
                buttonStyle={styles.iconButtonStyle}
                icon={
                  <Icon
                    name={'plus-circle-outline'}
                    {...(numColours >= constants.coloursSearch.maxNumber && {
                      color: theme.colors.white,
                    })}
                  />
                }
                onPress={() => {
                  const newNumColours = Math.min(numColours + 1, 5);
                  setNumColours(newNumColours);
                  setSelectedColourFamilies(
                    [...selectedColourFamilies, ''].splice(0, newNumColours),
                  );
                }}
              />
            </View>
          </ListItem>
        </View>
      </ListItem.Accordion>
      {withBaseColour && (
        <Dropdown
          key={'dropdown_colour_base'}
          dropdownLabel={t('SEARCH_COLOURS_DROPDOWN_BASE_COLOUR')}
          data={colourFamilies}
          initialValue={selectedBaseColourFamily}
          onChange={v => setSelectedBaseColourFamily(v)}
          iconName={constants.icons.coloursSearch.dropdownIcon}
          iconColour={
            model.colourFamily(selectedBaseColourFamily)?.sampleColourValue
          }
          containerStyle={styles.dropdownContainer}
        />
      )}
      {Array(numColours)
        .fill(0)
        .map((_ignored, index) => (
          <Dropdown
            key={`dropdown_colour_${index}`}
            data={colourFamilies}
            dropdownLabel={t('SEARCH_COLOURS_DROPDOWN_COLOUR', {
              index: index + 1,
            })}
            initialValue={selectedColourFamilies[index]}
            onChange={v => {
              setSelectedColourFamilies([
                ...selectedColourFamilies.splice(0, index),
                v,
                ...selectedColourFamilies.splice(
                  index + 1,
                  selectedColourFamilies.length,
                ),
              ]);
            }}
            iconName={constants.icons.coloursSearch.dropdownIcon}
            iconColour={
              model.colourFamily(selectedColourFamilies[index])
                ?.sampleColourValue
            }
            containerStyle={styles.dropdownContainer}
          />
        ))}
    </View>
  );
};

/**
 * A list of corporations with search fields for colours
 */
export const SearchColours = () => {
  const model = useContext(ModelContext);

  const addressesAndCorporations = useMemo(
    () =>
      model
        .addressesWithCorporations(model.allAddresses().map(a => a.id))
        .flatMap(([address, corporations]) =>
          corporations.map(c => [address, c] as [Address, Corporation]),
        ),
    [model],
  );

  const [query, setQuery] = useState<ColoursQuery>({
    baseColourId: '',
    colourFamilyIds: [''],
  });

  const [matchingCorporations, setMatchingCorporations] = useState<
    [Address, Corporation][]
  >([]);

  const onQueryChange = useCallback(
    (q: ColoursQuery) => setQuery(q),
    [setQuery],
  );

  useEffect(() => {
    if (
      !query.baseColourId &&
      (!query.colourFamilyIds.length || query.colourFamilyIds.every(c => !c))
    ) {
      log.debug('Empty query', query);
      return setMatchingCorporations([]);
    }

    setMatchingCorporations(
      searchColours(query, addressesAndCorporations, model),
    );
  }, [addressesAndCorporations, model, query]);

  return (
    <CorporationList
      headerComponent={<SearchFields onChange={onQueryChange} />}
      testID={'Screen:SearchColours'}
      addressesAndCorporations={matchingCorporations}
      parentScreenName={screenName}
      searchable={false}
    />
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'column',
  },
  parametersTitle: {
    fontWeight: 'bold',
  },
  buttonsContainer: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButtonStyle: {
    backgroundColor: 'transparent',
  },
  accordionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  searchParametersContainer: {
    backgroundColor: theme.colors.grey5,
  },
  parameterItem: {
    alignItems: 'center',
  },
  numColoursSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numColoursText: {
    minWidth: 15,
    marginHorizontal: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    backgroundColor: theme.colors.grey5,
  },
}));
