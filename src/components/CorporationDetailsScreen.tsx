import {makeStyles} from '@rneui/themed';
import React, {memo, useEffect} from 'react';

import {CorporationDetailsScreenProps} from '../types/screens';
import {CorporationDetails} from './details/Corporation';
import {RequestChangeButton} from './details/RequestChangeButton';

/**
 * A screen displaying the details of a corporation
 */
export const CorporationDetailsScreen = memo(
  ({navigation, route}: CorporationDetailsScreenProps) => {
    const styles = useStyles();
    const corporation = route.params.corporation;

    useEffect(() => {
      navigation.setOptions({
        title: corporation.shortName,
        headerRight: () => <RequestChangeButton name={corporation.shortName} />,
      });
    });

    return (
      <CorporationDetails
        corporations={[corporation]}
        containerStyle={styles.container}
      />
    );
  },
);

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
  },
}));
