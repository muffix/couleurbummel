import {makeStyles} from '@rneui/themed';
import React, {memo, useContext} from 'react';
import {ColorValue, View} from 'react-native';

import {Corporation} from '../types/model';
import Colours from './Colours';
import {ModelContext} from './contexts/ModelContext';

/**
 * A collection of one or more Colours views for a corporation
 */
export const ColoursSet = memo(({c}: {c: Corporation}) => {
  const styles = useStyles();
  const model = useContext(ModelContext);

  return (
    <View style={styles.coloursContainersContainer}>
      {Array.from(c?.colours || []).map((colourSet, idx) => {
        const cols =
          (colourSet.colourIds
            ?.map(col => model.colour(col))
            .filter(col => !!col) as ColorValue[]) || [];
        const percussion = model.colour(colourSet.percussionColourId);
        const baseColour = model.colour(colourSet.baseColourId);

        return (
          <View
            style={styles.coloursContainer}
            key={`list_colours_${c?.id}_${idx}`}>
            <Colours
              coloursKey={`colours_${c?.id}`}
              colours={cols}
              percussion={percussion}
              baseColour={baseColour}
            />
          </View>
        );
      })}
    </View>
  );
});

const useStyles = makeStyles(() => ({
  coloursContainersContainer: {
    width: '100%',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    maxHeight: 80,
    alignItems: 'center',
  },
  coloursContainer: {
    marginHorizontal: 5,
    aspectRatio: 3 / 2,
    maxWidth: 120,
    flexGrow: 1,
    flexShrink: 1,
  },
}));
