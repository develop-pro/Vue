import axios from 'axios';
import config from './config';

const tenantAdd = (token, data) =>
  axios.post(config.TENANT_ADD_URL,
    data,
    {
      headers: { token },
    },
  );
const tenantPut = (token, data) =>
  axios.put(config.TENANT_UPDATE_URL,
    data,
    {
      headers: { token },
    },
  );
const tenantRemove = (token, tenantid) =>
  axios.delete(`${config.TENANT_REMOVE_URL}?id=${tenantid}`,
    {
      headers: { token },
    },
  );
const tenantAll = token =>
  axios.get(config.TENANT_ALL_URL, {
    headers: { token },
  });

export default {
  tenantAdd,
  tenantPut,
  tenantRemove,
  tenantAll,
};
