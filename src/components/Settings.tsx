import {ListItem, makeStyles} from '@rneui/themed';
import dayjs from 'dayjs';
import {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import RNLocalize from 'react-native-localize';

import i18n from '../i18n';
import log from '../log';
import {SettingsScreenProps} from '../types/screens';
import {ActionKind, Language} from '../types/state';
import {StateContext} from './contexts/GlobalStateContext';

const changeLanguage = (lng: string) => {
  if (lng === 'auto') {
    lng =
      RNLocalize.findBestAvailableLanguage(['de', 'en'])?.languageTag || 'en';
  }

  if (lng !== 'de' && lng !== 'en') {
    log.error(`invalid language: ${lng}`);
    return;
  }

  i18n.changeLanguage(lng).then(() => log.info(`Changed language to ${lng}`));
  dayjs.locale(lng);
};

/**
 * The root screen in the Search section
 */
export const SettingsScreen = ({}: SettingsScreenProps) => {
  const {t} = useTranslation();
  const {globalState, dispatch} = useContext(StateContext);

  const styles = useStyles();

  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(
    globalState.settings.language,
  );
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(
    globalState.settings.theme,
  );

  useEffect(() => {
    setSelectedLanguageIndex(globalState.settings.language);
    setSelectedThemeIndex(globalState.settings.theme);
  }, [globalState]);

  return (
    <View testID={'Screen:Settings'} style={styles.container}>
      <ListItem key={'settings_language'} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{t('LANGUAGE')}</ListItem.Title>
        </ListItem.Content>
        <ListItem.ButtonGroup
          buttons={[t('LANGUAGE_SYSTEM'), '🇩🇪', '🇬🇧']}
          buttonStyle={styles.buttonGroup}
          selectedIndex={selectedLanguageIndex}
          onPress={index => {
            if (Language[index]) {
              setSelectedLanguageIndex(index);
              dispatch({
                kind: ActionKind.LanguageSelected,
                payload: {language: index},
              });
              changeLanguage(Language[index]);
            }
          }}
        />
      </ListItem>

      <ListItem key={'settings_theme'} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{t('THEME')}</ListItem.Title>
        </ListItem.Content>
        <ListItem.ButtonGroup
          buttons={[t('THEME_AUTO'), t('THEME_LIGHT'), t('THEME_DARK')]}
          buttonStyle={styles.buttonGroup}
          selectedIndex={selectedThemeIndex}
          onPress={index => {
            dispatch({
              kind: ActionKind.ThemeSelected,
              payload: {theme: index},
            });
            setSelectedThemeIndex(index);
          }}
        />
      </ListItem>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
    flex: 1,
  },
  buttonGroup: {},
}));
