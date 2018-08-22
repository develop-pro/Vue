import axios from 'axios';
import config from './config';

const stateAll = token =>
  axios.get(config.STATE_ALL_URL, {
    headers: { token },
  });

export default {
  stateAll,
};
