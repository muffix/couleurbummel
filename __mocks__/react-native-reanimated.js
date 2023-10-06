// This mock is required as per setup instructions for react-navigation testing
// https://reactnavigation.org/docs/testing/#mocking-native-modules

const Reanimated = require('react-native-reanimated/mock');
const {setUpTests} = require('react-native-reanimated');

setUpTests();

Reanimated.default.call = () => {};
module.exports = Reanimated;
