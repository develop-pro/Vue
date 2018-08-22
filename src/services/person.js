import axios from 'axios';
import config from './config';

const personAdd = (token, data) =>
  axios.post(config.PERSON_ADD_URL,
    data,
    {
      headers: { token },
    },
  );
const personPut = (token, data) =>
  axios.put(config.PERSON_ADD_URL,
    data,
    {
      headers: { token },
    },
  );
const personSelect = (token, personid) =>
  axios.get(`${config.PERSON_ADD_URL}?id=${personid}`, {
    headers: { token },
  });

export default {
  personAdd,
  personPut,
  personSelect,
};
