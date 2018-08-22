import axios from 'axios';
import config from './config';

const unitSearch = token =>
  axios.get(config.UNIT_SEARCH_URL, {
    headers: { token },
  });

const unitAll = token =>
  axios.get(config.UNIT_ALL_URL, {
    headers: { token },
  });

const unitGet = (token, unitid) =>
  axios.get(`${config.UNIT_GET_URL}?id=${unitid}`, {
    headers: { token },
  });

const unitAdd = (token, data) =>
  axios.post(config.UNIT_ADD_URL,
    data,
    {
      headers: { token },
    },
  );

const unitPut = (token, data) =>
  axios.put(config.UNIT_PUT_URL,
    data,
    {
      headers: { token },
    },
  );

const unitRemove = (token, unitid) =>
  axios.delete(`${config.UNIT_GET_URL}?id=${unitid}`,
    {
      headers: { token },
    },
  );

export default {
  unitSearch,
  unitAll,
  unitGet,
  unitAdd,
  unitPut,
  unitRemove,
};
