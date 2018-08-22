import axios from 'axios';
import config from './config';

const taskGet = (token, taskid) =>
  axios.get(`${config.TASK_GET_URL}?id=${taskid}`, {
    headers: { token },
  });
const taskPost = (token, data) =>
  axios.post(`${config.TASK_POST_URL}`,
    data,
    {
      headers: { token },
    },
  );
const taskPut = (token, data) =>
  axios.put(`${config.TASK_PUT_URL}`,
    data,
    {
      headers: { token },
    },
  );
const taskRemove = (token, taskid) =>
  axios.delete(`${config.TASK_GET_URL}?id=${taskid}`,
    {
      headers: { token },
    },
  );
const taskAll = token =>
  axios.get(config.TASK_ALL_URL, {
    headers: { token },
  });
const taskStatusAll = token =>
  axios.get(config.TASK_STATUS_ALL_URL, {
    headers: { token },
  });
const taskNoteAll = token =>
  axios.get(config.TASK_NOTE_ALL_URL, {
    headers: { token },
  });
const taskNotePost = (token, data) =>
  axios.post(`${config.TASK_NOTE_POST_URL}`,
    data,
    {
      headers: { token },
    },
  );
const taskNotePut = (token, data) =>
  axios.put(`${config.TASK_NOTE_PUT_URL}`,
    data,
    {
      headers: { token },
    },
  );

export default {
  taskGet,
  taskPost,
  taskPut,
  taskRemove,
  taskAll,
  taskStatusAll,
  taskNotePost,
  taskNotePut,
  taskNoteAll,
};
