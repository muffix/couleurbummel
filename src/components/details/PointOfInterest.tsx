import {Divider, makeStyles} from '@rneui/themed';
import dayjs from 'dayjs';
import React, {memo, useContext} from 'react';
import {ScrollView, StyleProp, View, ViewStyle} from 'react-native';

import constants from '../../constants';
import {Event, PointOfInterest} from '../../types/model';
import {ColoursSet} from '../ColoursSet';
import {ModelContext} from '../contexts/ModelContext';
import {DetailRow} from './Details';
import {EventDetails} from './Event';

export interface POIDetailsProps {
  pois: PointOfInterest[];
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * The detailed view of a point of interest, as used on the map popover
 */
export const POIDetails = memo(({pois, containerStyle}: POIDetailsProps) => {
  const styles = useStyles();
  const model = useContext(ModelContext);

  const containerStyles: StyleProp<ViewStyle>[] = [
    styles.container,
    containerStyle,
  ];

  return (
    <ScrollView style={containerStyles} testID={'Screen:POIDetails'}>
      {pois.map((p, index) => {
        const associatedCorporation = model.corporation(
          p.associatedCorporationIds?.[0],
        );

        return (
          <View key={`details_${p.id}`} style={styles.poiContainer}>
            {associatedCorporation && <ColoursSet c={associatedCorporation} />}
            <PointOfInterestRows poi={p} />
            {index !== pois.length - 1 && (
              <Divider inset insetType={'middle'} />
            )}
          </View>
        );
      })}
    </ScrollView>
  );
});

/**
 * Fragment returning all the rows describing the details of the point of interest, if available
 *
 * @param poi the point of interest
 * @param disableAddressButton whether we want the user to be able to press the address button
 */
const PointOfInterestRows = ({poi}: {poi: PointOfInterest}) => {
  const model = useContext(ModelContext);

  const associatedCorporation = model.corporation(
    poi.associatedCorporationIds?.[0],
  );

  return (
    <>
      <DetailRow
        key={`details_${poi.id}_longName`}
        iconName={'home'}
        text={poi.longName}
      />
      <DetailRow
        key={`details_${poi.id}_address`}
        iconName={constants.icons.mapDisplayable.address}
        text={model.address(poi.addressId)?.fullAddress || ''}
      />
      {associatedCorporation && (
        <DetailRow
          key={`details_${poi.id}_corporation`}
          iconName={constants.icons.poiDetails.associatedCorporation}
          text={associatedCorporation.shortName}
        />
      )}

      {poi.phone && (
        <DetailRow
          key={`details_${poi.id}_phone`}
          iconName={constants.icons.mapDisplayable.phone}
          text={poi.phone}
          onPress={`tel:${poi.phone}`}
        />
      )}
      {poi.mail && (
        <DetailRow
          key={`details_${poi.id}_mail`}
          iconName={constants.icons.mapDisplayable.mail}
          text={poi.mail}
          onPress={`mailto:${poi.mail}`}
        />
      )}
      {poi.website && (
        <DetailRow
          key={`details_${poi.id}_web`}
          iconName={constants.icons.mapDisplayable.website}
          text={poi.website}
          onPress={
            poi.website.startsWith('http')
              ? poi.website
              : `https://${poi.website}`
          }
        />
      )}
      {poi.remark && (
        <DetailRow
          key={`details_${poi.id}_remark`}
          iconName={constants.icons.mapDisplayable.comment}
          text={poi.remark}
        />
      )}
      {poi.eventIds?.length &&
        poi.eventIds
          .map(eventId => model.event(eventId))
          .filter(e => {
            if (!e) {
              return false;
            }

            const eventDate = dayjs(e.begin);

            if (!eventDate) {
              return false;
            }

            // Do not display if it started more than 7 days in the past
            return eventDate.isAfter(dayjs().subtract(7, 'day'));
          })
          .map(e => e as Event)
          .sort((a, b) => a.begin.localeCompare(b.begin))
          .map(event => (
            <EventDetails key={`event_${event.id}`} event={event} />
          ))}
    </>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    padding: 5,
    backgroundColor: theme.colors.white,
  },
  poiContainer: {
    paddingTop: 10,
  },
  scrollViewContent: {
    backgroundColor: theme.colors.white,
  },
}));
