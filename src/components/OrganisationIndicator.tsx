import {useTheme} from '@rneui/themed';
import React, {memo} from 'react';
import {ColorValue, StyleSheet, View} from 'react-native';
import Svg, {Ellipse} from 'react-native-svg';

interface Props {
  colour: ColorValue;
}

/**
 * The round view to indicate membership of an organisation
 */
export const OrganisationIndicator = memo(({colour}: Props) => {
  const {theme} = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.indicator}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
          <Ellipse
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
            fill={colour}
            stroke={theme.colors.greyOutline}
            strokeWidth={2}
          />
        </Svg>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    height: 20,
    marginRight: 5,
  },
  indicator: {},
});
