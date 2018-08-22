import Dexie from 'dexie';

const DB_NAME = '_CASAPP';
const DB_VERSION = 1;
const UNIT_STORE_NAME = 'Units';
const TASK_STORE_NAME = 'Tasks';
const TASK_NOTES_STORE_NAME = 'TaskNotes';
const LOOKUP_STORE_NAME = 'LookUps';
const LEASE_STORE_NAME = 'Lease';
const TENANT_STORE_NAME = 'Tenants';
const LEASE_TRANS_STORE_NAME = 'LeaseTrans';

let DB = new Dexie(DB_NAME);

DB.version(DB_VERSION).stores({
  Units: '&UnitID',
  Tasks: '&ID, UnitID',
  TaskNotes: '&NoteID, TaskID',
  LookUps: '++ID, Kind',
  Lease: 'ID, UnitID, StartDate, EndDate, Rent',
  Tenants: '++ID, LeaseID, firstName, lastName',
  LeaseTrans: '++TransID',
});
// check db is exist
const isExist = () => Dexie.exists(DB_NAME);
// remove db
const removedb = () => Dexie.delete(DB_NAME);
// create db
const createdb = () => {
  DB = new Dexie(DB_NAME);
  DB.version(DB_VERSION).stores({
    Units: '&UnitID',
    Tasks: '&ID, UnitID',
    TaskNotes: '&NoteID, TaskID',
    LookUps: '++ID, Kind',
    Lease: 'ID, UnitID, StartDate, EndDate, Rent',
    Tenants: '++ID, LeaseID, firstName, lastName',
    LeaseTrans: 'TransID',
  });
};
// retrieve all items from store
const retrieve = dbStore => DB[dbStore].toArray();
const retrieveBySort = (dbStore, keypath) => DB[dbStore].reverse().sortBy(keypath);
const retrieveBySortASC = (dbStore, keypath) => DB[dbStore].reverse().reverse().sortBy(keypath);
const compareTaskCreatedTime = (a, b) => {
  if (a.StatusSort < b.StatusSort) {
    return -1;
  }
  if (a.StatusSort > b.StatusSort) {
    return 1;
  }
  if (new Date(a.CreatedTime) > new Date(b.CreatedTime)) {
    return -1;
  }
  if (new Date(a.CreatedTime) < new Date(b.CreatedTime)) {
    return 1;
  }
  return 0;
};
const compareNotesModtime = (a, b) => {
  if (new Date(a.ModTime) < new Date(b.ModTime)) {
    return -1;
  }
  if (new Date(a.ModTime) > new Date(b.ModTime)) {
    return 1;
  }
  return 0;
};
const compareLeaseStartDate = (a, b) => {
  if (new Date(a.StartDate) > new Date(b.StartDate)) {
    return -1;
  }
  if (new Date(a.StartDate) < new Date(b.StartDate)) {
    return 1;
  }
  return 0;
};
// retrieve tasks and sort by status and createdTime
const retrieveTasks = (dbStore, keypathObj) => {
  let collection;
  if (keypathObj) {
    collection = DB[dbStore].where(keypathObj);
  } else {
    collection = DB[dbStore].reverse();
  }
  collection = collection.sortBy('StatusSort');
  return collection.then(result => result.sort(compareTaskCreatedTime));
};
const retrieveNotes = (dbStore, keypathObj) => {
  let collection;
  if (keypathObj) {
    collection = DB[dbStore].where(keypathObj).sortBy('NoteID');
  } else {
    collection = DB[dbStore].reverse();
  }
  return collection.then(result => result.sort(compareNotesModtime));
};
const retrieveLeases = (dbStore, keypathObj) => {
  let collection;
  if (keypathObj) {
    collection = DB[dbStore].where(keypathObj).sortBy('ID');
  } else {
    collection = DB[dbStore].reverse();
  }
  return collection.then(result => result.sort(compareLeaseStartDate));
};
// retrieve notes and sort by modTime
// retrieve by where
const retrieveByWhere = (dbStore, keypathObj) => DB[dbStore].where(keypathObj).toArray();
// get count
const getCount = (dbStore, key, value) => DB[dbStore].where(key).equals(value).count();
// remove all items
const removeAll = dbStore => DB[dbStore].clear();
// remove by keypath array
const removeItems = (dbStore, keypathObj) => DB[dbStore].where(keypathObj).delete();
// put item
const putItem = (dbStore, obj) => DB[dbStore].put(obj);
// put bulk items
const bulkPut = (dbStore, obj) => DB[dbStore].bulkPut(obj);
// filter
const filter = (dbStore, key, value) => DB[dbStore].filter(obj => obj[key] === value).toArray();

export default {
  TASK_STORE_NAME,
  UNIT_STORE_NAME,
  TASK_NOTES_STORE_NAME,
  LOOKUP_STORE_NAME,
  LEASE_STORE_NAME,
  TENANT_STORE_NAME,
  LEASE_TRANS_STORE_NAME,
  isExist,
  retrieve,
  retrieveBySort,
  retrieveBySortASC,
  retrieveByWhere,
  removeAll,
  removeItems,
  putItem,
  bulkPut,
  filter,
  getCount,
  retrieveTasks,
  retrieveNotes,
  retrieveLeases,
  removedb,
  createdb,
};
