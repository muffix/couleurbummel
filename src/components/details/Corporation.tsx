import {DrawerActions, useNavigation} from '@react-navigation/native';
import {Divider, makeStyles} from '@rneui/themed';
import dayjs from 'dayjs';
import React, {memo, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleProp, View, ViewStyle} from 'react-native';

import constants from '../../constants';
import log from '../../log';
import {TranslationKey} from '../../types/i18n';
import {Corporation, Event} from '../../types/model';
import {ColoursSet} from '../ColoursSet';
import {setActiveDrawerAction} from '../contexts/actions';
import {StateContext} from '../contexts/GlobalStateContext';
import {ModelContext} from '../contexts/ModelContext';
import {DetailRow} from './Details';
import {EventDetails} from './Event';

const coloursTranslationKeys: TranslationKey[] = [
  'COLOURS_UNKNOWN',
  'COLOURS_NONE',
  'COLOURS_NEEDLE',
  'COLOURS_NOT_WEARING',
  'COLOURS_FACULTATIVELY',
  'COLOURS_YES',
];

const fencingTranslationKeys: TranslationKey[] = [
  'FENCING_UNKNOWN',
  'FENCING_NO',
  'FENCING_FREE',
  'FENCING_FACULTATIVELY',
  'FENCING_MANDATORY',
];

export interface CorporationDetailsProps {
  corporations: Corporation[];
  containerStyle?: StyleProp<ViewStyle>;
  disableAddressButton?: boolean;
}

/**
 * The detailed view of a corporation, as used on the map popover and after selecting a corporation from a list
 */
export const CorporationDetails = memo(
  ({
    corporations,
    containerStyle,
    disableAddressButton,
  }: CorporationDetailsProps) => {
    const styles = useStyles();

    log.debug(corporations);

    const containerStyles: StyleProp<ViewStyle>[] = [
      styles.container,
      containerStyle,
    ];

    const pinColoursToTop = corporations.length === 1;
    if (pinColoursToTop) {
      const c = corporations[0];

      return (
        <View
          style={[...containerStyles, styles.corporationContainer]}
          testID={'Screen:CorporationDetails'}>
          <ColoursSet c={c} />
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <CorporationRows
              c={c}
              disableAddressButton={disableAddressButton}
            />
          </ScrollView>
        </View>
      );
    }

    return (
      <ScrollView style={containerStyles} testID={'Screen:CorporationDetails'}>
        {corporations.map((c, index) => (
          <View key={`details_${c.id}`} style={styles.corporationContainer}>
            <ColoursSet c={c} />
            <CorporationRows c={c} />
            {index !== corporations.length - 1 && (
              <Divider inset insetType={'middle'} />
            )}
          </View>
        ))}
      </ScrollView>
    );
  },
);

/**
 * Fragment returning all the rows describing the details of the corporation, if available
 *
 * @param c the corporation
 * @param disableAddressButton whether we want the user to be able to press the address button
 */
const CorporationRows = ({
  c,
  disableAddressButton,
}: {
  c: Corporation;
  disableAddressButton?: boolean;
}) => {
  const {t} = useTranslation();
  const {dispatch} = useContext(StateContext);
  const model = useContext(ModelContext);
  const navigation = useNavigation();

  const foundationDate = c.foundationDate ? dayjs(c.foundationDate) : undefined;

  return (
    <>
      <DetailRow
        key={`details_${c.id}_longName`}
        iconName={'home'}
        text={c.longName}
      />
      <DetailRow
        key={`details_${c.id}_address`}
        iconName={constants.icons.mapDisplayable.address}
        text={model.address(c.addressId)?.fullAddress || ''}
        onPress={
          disableAddressButton
            ? undefined
            : () => {
                const newScreenName = 'Map';
                dispatch(setActiveDrawerAction(newScreenName));
                navigation.dispatch(
                  DrawerActions.jumpTo(newScreenName, {
                    addressIds: [c.addressId],
                  }),
                );
                navigation.dispatch(DrawerActions.closeDrawer);
              }
        }
      />
      {c.organisationIds?.map((orgId, idx) => {
        const org = model.organisation(orgId);

        if (!org) {
          return null;
        }
        return (
          <DetailRow
            key={`details_${c.id}_org_${orgId}_${idx}`}
            iconName={constants.icons.corporationDetails.organisation}
            text={org.name}
          />
        );
      })}

      {c.phone && (
        <DetailRow
          key={`details_${c.id}_phone`}
          iconName={constants.icons.mapDisplayable.phone}
          text={c.phone}
          onPress={`tel:${c.phone}`}
        />
      )}
      {c.mail && (
        <DetailRow
          key={`details_${c.id}_mail`}
          iconName={constants.icons.mapDisplayable.mail}
          text={c.mail}
          onPress={`mailto:${c.mail}`}
        />
      )}
      {c.website && (
        <DetailRow
          key={`details_${c.id}_web`}
          iconName={constants.icons.mapDisplayable.website}
          text={c.website}
          onPress={
            c.website.startsWith('http') ? c.website : `https://${c.website}`
          }
        />
      )}
      <DetailRow
        key={`details_${c.id}_fencing`}
        iconName={constants.icons.corporationDetails.fencing}
        text={t(fencingTranslationKeys[c.fencingPrinciple])}
      />
      <DetailRow
        key={`details_${c.id}_colours`}
        iconName={constants.icons.corporationDetails.colours}
        text={t(coloursTranslationKeys[c.coloursPrinciple])}
      />
      {foundationDate && (
        <DetailRow
          key={`details_${c.id}_foundation`}
          iconName={constants.icons.corporationDetails.foundation}
          text={`${
            foundationDate.date() === 1 && foundationDate.month() === 0
              ? foundationDate.year()
              : foundationDate.format('L')
          }`}
        />
      )}
      {c.jourFixe && (
        <DetailRow
          key={`details_${c.id}_bar`}
          iconName={constants.icons.corporationDetails.jourFixe}
          text={c.jourFixe}
        />
      )}
      {c.remark && (
        <DetailRow
          key={`details_${c.id}_remark`}
          iconName={constants.icons.mapDisplayable.comment}
          text={c.remark}
        />
      )}
      {c.eventIds?.length &&
        c.eventIds
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
  corporationContainer: {
    paddingTop: 5,
  },
  scrollViewContent: {
    backgroundColor: theme.colors.white,
  },
}));
