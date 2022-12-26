import {Button, Icon, makeStyles} from '@rneui/themed';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Linking} from 'react-native';
import Config from 'react-native-config';

import constants from '../../constants';

interface RequestChangeButtonProps {
  name: string;
}

/**
 * A button with an icon to request changes to a database entry
 *
 * @param name the name of the item for which a change is requested
 */
export const RequestChangeButton = ({name}: RequestChangeButtonProps) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const subject = t('CHANGE_REQUEST_SUBJECT', {name});
  const url = `mailto:${Config.CONTACT_EMAIL}?subject=${subject}`;

  return (
    <Button
      buttonStyle={styles.button}
      icon={<Icon name={constants.icons.explore.requestChange} />}
      onPress={() => {
        Linking.canOpenURL(url).then(can => can && Linking.openURL(url));
      }}
    />
  );
};

const useStyles = makeStyles(() => ({
  button: {
    backgroundColor: 'transparent',
  },
}));
