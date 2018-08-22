import axios from 'axios';
import config from './config';

const leaseAdd = (token, data) =>
  axios.post(config.LEASE_ADD_URL,
    data,
    {
      headers: { token },
    },
  );
const leasePut = (token, data) =>
  axios.put(config.LEASE_UPDATE_URL,
    data,
    {
      headers: { token },
    },
  );
const leaseRemove = (token, leaseid) =>
  axios.delete(`${config.LEASE_REMOVE_URL}?id=${leaseid}`,
    {
      headers: { token },
    },
  );
const leaseAll = token =>
  axios.get(config.LEASE_ALL_URL, {
    headers: { token },
  });

export default {
  leaseAdd,
  leasePut,
  leaseRemove,
  leaseAll,
};
