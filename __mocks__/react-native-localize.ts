const getLocales = () => [
  {countryCode: 'GB', languageTag: 'en-GB', languageCode: 'en', isRTL: false},
  {countryCode: 'DE', languageTag: 'de-DE', languageCode: 'de', isRTL: false},
];

const findBestAvailableLanguage = () => ({
  languageTag: 'en',
  isRTL: false,
});

const getNumberFormatSettings = () => ({
  decimalSeparator: '.',
  groupingSeparator: ',',
});

const getCalendar = () => 'gregorian';
const getCountry = () => 'GB';
const getCurrencies = () => ['GBP'];
const getTemperatureUnit = () => 'celsius';
const getTimeZone = () => 'Europe/Berlin';
const uses24HourClock = () => true;
const usesMetricSystem = () => true;

const addEventListener = jest.fn();
const removeEventListener = jest.fn();

export {
  addEventListener,
  findBestAvailableLanguage,
  getCalendar,
  getCountry,
  getCurrencies,
  getLocales,
  getNumberFormatSettings,
  getTemperatureUnit,
  getTimeZone,
  removeEventListener,
  uses24HourClock,
  usesMetricSystem,
};
