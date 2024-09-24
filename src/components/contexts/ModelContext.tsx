import '@react-native-firebase/app-check';
import '@react-native-firebase/database';

import firebase from '@react-native-firebase/app';
import {Dialog, Text} from '@rneui/themed';
import React, {PropsWithChildren, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Config from 'react-native-config';

import testDatabase from '../../../resources/testDatabase.json';
import log from '../../log';
import {CouleurbummelModel} from '../../model/model';

/**
 * Context providing the latest available model
 *
 * The app subscribes to database updates and immediately updates the model. This context can be used by components to
 * listen to model updates.
 */
export const ModelContext = React.createContext(new CouleurbummelModel());

const activateAppCheck = async () => {
  await firebase.appCheck().activate('ignored', true);
  const {token} = await firebase.appCheck().getToken();
  if (!token) {
    throw new Error('Did not receive an App Check token');
  }
  return token;
};

export const ModelContextProvider = ({children}: PropsWithChildren) => {
  const [appCheckErrorVisible, setAppCheckErrorVisible] = useState(false);
  const {t} = useTranslation();

  const [model, setModel] = useState<CouleurbummelModel>(() => {
    if (Config.DATABASE_TYPE !== 'prod') {
      log.debug('Using mock database');
      return new CouleurbummelModel(testDatabase);
    }

    activateAppCheck()
      .catch(e => {
        log.error('Error activating App Check', e);
        setAppCheckErrorVisible(true);
      })
      .finally(() => {
        log.debug('Subscribing to database updates');
        const db = firebase.app().database(Config.DATABASE_URL);

        db.ref(Config.DATABASE_PATH).on('value', snap => {
              log.debug('Database update received');
              setModel(new CouleurbummelModel(snap.val()));
            },
            err => log.error(err),
        );

        db.setPersistenceEnabled(true);
      });

    return new CouleurbummelModel();
  });

  return (
    <ModelContext.Provider value={model}>
      {children}
      <Dialog isVisible={appCheckErrorVisible}>
        <Dialog.Title title={t('APP_CHECK_DIALOGUE_TITLE')} />
        <Text>{t('APP_CHECK_DIALOGUE_TEXT')}</Text>
        <Dialog.Actions>
          <Dialog.Button
            title={t('APP_CHECK_DIALOGUE_BUTTON_TEXT')}
            onPress={() => setAppCheckErrorVisible(false)}
          />
        </Dialog.Actions>
      </Dialog>
    </ModelContext.Provider>
  );
};
