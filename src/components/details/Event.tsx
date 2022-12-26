import {ListItem, makeStyles, Text} from '@rneui/themed';
import dayjs from 'dayjs';
import {memo} from 'react';

import {Event} from '../../types/model';

export const EventDetails = memo(({event}: {event: Event}) => {
  const styles = useStyles();
  return (
    <ListItem containerStyle={styles.container} topDivider>
      <ListItem.Content style={styles.contentContainer}>
        <Text style={styles.title}>{event.name}</Text>
        <Text style={styles.dates}>
          {dayjs(event.begin).format('L, LT')}
          {event.end && ` - ${dayjs(event.end).format('L, LT')}`}
        </Text>
        {event.description && (
          <Text style={styles.description}>{event.description}</Text>
        )}
      </ListItem.Content>
    </ListItem>
  );
});

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.white,
    flexDirection: 'column',
  },
  contentContainer: {
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'center',
  },
  dates: {
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  description: {
    marginVertical: 5,
    width: '100%',
    fontSize: 16,
  },
}));
