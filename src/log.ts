import Config from 'react-native-config';
import {consoleTransport, logger} from 'react-native-logs';

export default logger.createLogger<'debug' | 'info' | 'warn' | 'error'>({
  enabled: Config.ENABLE_LOGGING === 'true',
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  transport: consoleTransport,
  transportOptions: {
    colors: {
      debug: 'blueBright',
      info: 'blue',
      warn: 'yellowBright',
      error: 'redBright',
    },
    mapLevels: {
      debug: 'log',
      info: 'info',
      warn: 'warn',
      err: 'error',
    },
  },
});
