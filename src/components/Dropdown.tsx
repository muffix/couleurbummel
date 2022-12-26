import {Text} from '@rneui/base';
import {Icon, makeStyles, useTheme} from '@rneui/themed';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ColorValue, View, ViewStyle} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

export interface DropdownData {
  label: string;
  value: string;
}

interface DropdownProps {
  data: DropdownData[];
  onChange: (value: string) => void;
  iconName: string;
  iconColour?: ColorValue;
  containerStyle?: ViewStyle;
  initialValue?: string;
  dropdownLabel?: string;
}

export default ({
  data,
  onChange,
  iconName,
  iconColour,
  containerStyle,
  dropdownLabel,
  initialValue,
}: DropdownProps) => {
  const [value, setValue] = useState(initialValue);
  const [hasFocus, setHasFocus] = useState(false);
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();

  const renderLabel = () => {
    if (dropdownLabel) {
      return (
        <Text
          style={[
            styles.label,
            {backgroundColor: containerStyle?.backgroundColor},
            hasFocus && {color: theme.colors.primary},
          ]}>
          {dropdownLabel}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {dropdownLabel && renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          hasFocus && {borderColor: theme.colors.primary},
        ]}
        data={data}
        activeColor={theme.colors.accent as string}
        containerStyle={styles.list}
        inputSearchStyle={styles.inputSearchStyle}
        selectedTextStyle={styles.selectedTextStyle}
        placeholderStyle={styles.placeholderStyle}
        iconStyle={styles.iconStyle}
        itemContainerStyle={styles.itemContainer}
        itemTextStyle={styles.itemText}
        search
        labelField="label"
        valueField="value"
        placeholder={!hasFocus ? t('DROPDOWN_PLACEHOLDER') : '...'}
        searchPlaceholder={t('SEARCH_BAR_PLACEHOLDER')}
        value={value}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        onChange={item => {
          setValue(item.value);
          setHasFocus(false);
          onChange(item.value);
        }}
        renderLeftIcon={() => (
          <Icon
            style={styles.icon}
            color={
              hasFocus ? theme.colors.primary : iconColour || theme.colors.black
            }
            name={iconName}
          />
        )}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: theme.colors.grey4,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: theme.colors.white,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: theme.colors.black,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: theme.colors.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  list: {
    backgroundColor: theme.colors.white,
  },
  itemContainer: {
    backgroundColor: theme.colors.white,
  },
  itemText: {
    color: theme.colors.black,
  },
}));
