import {makeStyles} from '@rneui/themed';
import {useTheme} from '@rneui/themed';
import React, {memo, useContext} from 'react';
import {ColorValue, Text, View} from 'react-native';

import {Colours, MapDisplayables} from '../../types/model';
import ColoursView from '../Colours';
import {ModelContext} from '../contexts/ModelContext';
import {OrganisationIndicator} from '../OrganisationIndicator';

type AddressCalloutProps = {
  title: string;
  distanceString?: string;
  mapDisplayables: MapDisplayables;
};

interface CalloutCellProps {
  id: string;
  colours?: Colours[];
  shortName: string;
  indicatorColourId?: string;
}

/**
 * The address callout shown when a marker is tapped
 */
export const AddressCallout = memo(
  ({title, distanceString, mapDisplayables}: AddressCalloutProps) => {
    const styles = useStyles();
    const model = useContext(ModelContext);

    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text numberOfLines={1} style={styles.calloutHeaderText}>
            {title}
          </Text>
          <View style={styles.calloutDistance}>
            <Text numberOfLines={1} style={styles.calloutDistanceText}>
              {distanceString}
            </Text>
          </View>
        </View>
        <View>
          {mapDisplayables.corporations.map(c => (
            <CalloutCell
              key={c.id}
              id={c.id}
              colours={c.colours}
              shortName={c.shortName}
              indicatorColourId={c.indicatorColourId}
            />
          ))}
          {mapDisplayables.pois.map(p => {
            const colours = model.corporation(
              p.associatedCorporationIds?.[0],
            )?.colours;
            return (
              <CalloutCell
                key={p.id}
                id={p.id}
                shortName={p.shortName}
                indicatorColourId={p.indicatorColourId}
                {...(colours && {colours})}
              />
            );
          })}
        </View>
      </View>
    );
  },
);

const CalloutCell = ({
  id,
  shortName,
  indicatorColourId,
  colours,
}: CalloutCellProps) => {
  const {theme} = useTheme();
  const model = useContext(ModelContext);
  const styles = useStyles();

  const indicatorColour = model.colour(indicatorColourId) || theme.colors.grey0;

  const cols = (colours?.[0]?.colourIds || [])
    .map(c => model.colour(c))
    .filter(c => !!c)
    .map(c => c as ColorValue);

  return (
    <View style={styles.cell}>
      <OrganisationIndicator colour={indicatorColour} />
      <Text style={styles.cellName}>{shortName}</Text>
      {colours && (
        <View style={styles.cellColours}>
          <ColoursView
            key={`colours_${id}`}
            coloursKey={`colours_${id}`}
            colours={cols}
            percussion={model.colour(colours?.[0].percussionColourId)}
            baseColour={model.colour(colours?.[0].baseColourId)}
          />
        </View>
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
  },
  calloutHeaderText: {
    textAlign: 'auto',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    flex: 1,
    color: theme.colors.fixed.black,
  },
  calloutDistance: {
    marginBottom: 5,
    justifyContent: 'center',
    minWidth: '20%',
  },
  calloutDistanceText: {
    color: theme.colors.fixed.darkGrey,
    fontSize: 11,
    textAlign: 'center',
  },
  cell: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  cellName: {
    flexWrap: 'nowrap',
    flex: 1,
    fontSize: 18,
    marginHorizontal: 5,
    color: theme.colors.fixed.black,
  },
  cellColours: {
    alignSelf: 'center',
    width: '20%',
  },
}));
