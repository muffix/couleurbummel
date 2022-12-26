import {Image, makeStyles, useTheme} from '@rneui/themed';
import React, {memo, useContext, useMemo} from 'react';
import {ColorValue, StyleSheet, View} from 'react-native';
import {Point} from 'react-native-maps/lib/sharedTypes';
import Svg, {Circle, G, Path} from 'react-native-svg';

import getIconNamed from '../../assets/icons';
import {MapDisplayables} from '../../types/model';
import {ModelContext} from '../contexts/ModelContext';

interface AddressMarkerProps {
  mapDisplayables: MapDisplayables;
}

/**
 * The marker shown on the map
 */
export const AddressMarker = memo(({mapDisplayables}: AddressMarkerProps) => {
  const model = useContext(ModelContext);

  const colours = useMemo(
    () =>
      model.colourValues(
        [...mapDisplayables.corporations, ...mapDisplayables.pois]
          .map(c => c.indicatorColourId)
          .concat(mapDisplayables.pois.map(c => c.indicatorColourId))
          .filter(c => !!c)
          .map(c => c as string),
      ),
    [model, mapDisplayables],
  );

  /* If we have only POIs, we show their icon on a neutral background */
  if (
    !mapDisplayables.corporations.length &&
    mapDisplayables.pois.length &&
    mapDisplayables.pois[0].iconName
  ) {
    return <AddressMarkerView colours={[]} iconName={'icon_coat_mch'} />;
  }

  return <AddressMarkerView colours={colours} />;
});

const getCoordinatesForPercent = (
  percent: number,
  radius: number,
  centre: Point,
) => {
  const angle = 2 * Math.PI * percent;
  const target = {
    x: centre.x + radius * Math.cos(angle),
    y: centre.y + radius * Math.sin(angle),
  };

  return target;
};

/**
 * Returns the paths to draw the slices of a pie chart in the given colours
 *
 * For each slice, we move to the start point
 * @param colours
 * @param radius
 * @param centre
 */
const pathForColours = (
  colours: ColorValue[],
  radius: number,
  centre: Point,
) => {
  let cumulativePercentage = 0;

  // Start at the top of the circle
  let previous = getCoordinatesForPercent(0, radius, centre);

  return colours.map((col, i) => {
    cumulativePercentage += 1 / colours.length;

    const target = getCoordinatesForPercent(
      cumulativePercentage,
      radius,
      centre,
    );

    // We're drawing each wedge individually and more than one. So we always want to draw the short arc.
    const largeArcFlag = 0;

    // Draw the wedge
    const pathData = [
      `M ${previous.x} ${previous.y}`, // Move to start
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${target.x} ${target.y}`, // Arc to the next coordinate
      `L ${centre.x} ${centre.y}`, // Line to centre
    ].join(' ');

    previous = target;

    return (
      <Path
        transform={`rotate(-90, ${centre.x}, ${centre.y})`}
        key={`slice_${i}`}
        d={pathData}
        fill={col}
      />
    );
  });
};

export const AddressMarkerView = memo(
  ({colours, iconName}: {colours: ColorValue[]; iconName?: string}) => {
    const {theme} = useTheme();
    const styles = useStyles();

    const centreStrokeColour = colours.length
      ? theme.colors.fixed.black
      : theme.colors.mapMarkerFill;

    let centreFillColour: ColorValue = 'transparent';
    if (colours.length === 0 && iconName) {
      centreFillColour = theme.colors.mapMarkerFill;
    }
    if (colours.length === 1) {
      centreFillColour = colours[0];
    }

    colours.sort();

    return (
      <View>
        <View style={styles.pin}>
          <Svg height="100%" width="100%" viewBox="0 0 210 297">
            <G transform="translate(129.53117,73.448518)">
              <Path
                d={
                  'm -25.025404,-67.058727 c -45.32449,0 -82.066306,36.742196 -82.066306,82.065275 0,4.763553 0.82687,10.552168 2.30218,17.093013 9.699623,11.693867 22.660072,25.824516 38.471556,39.712305 21.739555,19.094783 44.542681,34.003844 67.775191,44.313054 6.3887991,2.83493 12.816193,5.31994 19.272725,7.45743 18.651695,-40.130906 37.299533,-85.91832 37.299533,-108.575802 0,-45.323079 -36.742171,-82.065275 -82.066309,-82.065275 -0.06773,0 -0.494027,0.0021 -0.494027,0.0021 0,0 -0.427162,-0.0021 -0.494543,-0.0021 z m 0.116272,41.017134 c 0.05151,0 0.378271,0.0047 0.378271,0.0047 0,0 0.326413,-0.0047 0.378272,-0.0047 21.0502278,0 38.230224,17.0657417 38.230224,38.118087 0,21.051992 -17.2352894,38.118087 -38.285518,38.118087 -0.05186,0 -0.322978,-0.0041 -0.322978,-0.0041 0,0 -0.271988,0.0041 -0.323494,0.0041 -21.050581,0 -38.285519,-17.066095 -38.285519,-38.118087 0,-21.0523453 17.180161,-38.118087 38.230742,-38.118087 z m -71.18687,86.949732 c 2.888542,8.085306 6.206886,16.581123 9.777698,25.214998 3.238497,3.092094 6.622888,6.201435 10.149252,9.299174 21.739555,19.094429 44.542165,34.002819 67.774674,44.312029 5.9905133,2.65817 12.0154312,5.00568 18.065564,7.05073 1.837971,-3.76837 3.715013,-7.65704 5.611544,-11.63495 C 8.8590062,132.97207 2.4655418,130.47282 -3.8897434,127.64567 -28.330868,116.77413 -52.247642,101.1174 -74.975327,81.11104 -82.709972,74.302789 -89.759061,67.479324 -96.096002,60.908139 Z m 21.681364,52.605061 c 20.065274,44.27215 41.946794,84.70439 41.946794,84.70439 2.09832,3.87525 5.707782,5.75042 7.936983,5.6534 2.229201,0.097 5.838311,-1.77815 7.936983,-5.6534 0,0 8.9257808,-16.49329 20.6023605,-39.94382 -5.945005,-2.06163 -11.8637297,-4.39986 -17.7498205,-7.01817 -20.737316,-9.22443 -41.096623,-21.89493 -60.6733,-37.7424 z'
                }
                stroke={theme.colors.fixed.black}
                strokeWidth={2}
                fill={theme.colors.mapMarkerFill}
              />
            </G>
            {
              // If there's more than one colour, we'll draw a pie chart
              colours.length > 1 &&
                pathForColours(colours, 38.5, {x: 105.60272, y: 85.525055})
            }
            <Circle
              cx="105.60272"
              cy="85.525055"
              r="38.75"
              fill={centreFillColour}
              stroke={centreStrokeColour}
              strokeWidth={2}
            />
          </Svg>

          {iconName && (
            <View style={styles.iconContainer}>
              <Image style={styles.icon} source={getIconNamed(iconName)} />
            </View>
          )}
        </View>
      </View>
    );
  },
);

const useStyles = makeStyles(() => ({
  pin: {
    alignSelf: 'center',
    width: 40,
    height: 67,
  },
  iconContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'center',
    top: 10,
  },
  icon: {
    width: 25,
    height: 25,
  },
}));
