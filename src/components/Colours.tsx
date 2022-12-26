import {makeStyles} from '@rneui/themed';
import {memo} from 'react';
import {ColorValue, View, ViewStyle} from 'react-native';

interface ColoursProps {
  colours?: ColorValue[];
  percussion?: ColorValue;
  baseColour?: ColorValue;
  coloursKey: string;
}

/**
 * Represents a sash or flag-like collection of colours, such as a tricolore
 */
export const Colours = memo(
  ({colours, percussion, baseColour, coloursKey}: ColoursProps) => {
    const styles = useStyles();

    if (!colours) {
      return null;
    }

    let mainStyle = [styles.mainContainer as ViewStyle];

    if (percussion) {
      mainStyle.push(styles.percussionPadding, {
        backgroundColor: percussion,
      });
    } else if (baseColour) {
      mainStyle.push(styles.baseColourPadding, {
        backgroundColor: baseColour,
      });
    }

    return (
      <View style={styles.container}>
        <View style={mainStyle}>
          {colours.map((col, i) => (
            <View
              key={`${coloursKey}_${i}`}
              style={[styles.colour, {backgroundColor: col}]}
            />
          ))}
        </View>
      </View>
    );
  },
);

const useStyles = makeStyles(theme => ({
  container: {
    aspectRatio: 3 / 2,
  },
  mainContainer: {
    justifyContent: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: theme.colors.greyOutline,
    borderWidth: 1,
    width: '100%',
    flexGrow: 1,
    flexShrink: 1,
  },
  colour: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  percussionPadding: {
    paddingTop: '5%',
    paddingBottom: '5%',
  },
  baseColourPadding: {
    paddingTop: '12%',
    paddingBottom: '12%',
  },
}));

export default Colours;
