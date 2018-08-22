import axios from 'axios';
import config from './config';

const leaseTransAdd = (token, data) =>
  axios.post(config.LEASE_TRANS_ADD_URL,
    data,
    {
      headers: { token },
    },
  );
const leaseTransPut = (token, data) =>
  axios.put(config.LEASE_TRANS_UPDATE_URL,
    data,
    {
      headers: { token },
    },
  );
const leaseTransRemove = (token, transid) =>
  axios.delete(`${config.LEASE_TRANS_REMOVE_URL}?id=${transid}`,
    {
      headers: { token },
    },
  );
const leaseTransAll = token =>
  axios.get(config.LEASE_TRANS_ALL_URL, {
    headers: { token },
  });

export default {
  leaseTransAdd,
  leaseTransPut,
  leaseTransRemove,
  leaseTransAll,
};
