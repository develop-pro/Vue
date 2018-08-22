import idb from 'idb';

const DB_NAME = 'CASAPP';
const UNIT_STORE_NAME = 'Units';
const STATE_STORE_NAME = 'States';
const TASK_STORE_NAME = 'Tasks';
const TASK_STATUS_STORE_NAME = 'TaskStatus';
const TASK_NOTES_STORE_NAME = 'TaskNotes';

const OpenIDB = () => idb.open(DB_NAME, 5, (upgradeDb) => {
  console.log(upgradeDb);
  const stores = upgradeDb.objectStoreNames;
  const storeNames = [];
  for (let i = 0; i < stores.length; i += 1) {
    storeNames.push(stores[i]);
  }
  if (storeNames.indexOf(UNIT_STORE_NAME) === -1) {
    const UnitsStore = upgradeDb.createObjectStore(UNIT_STORE_NAME, {
      keyPath: 'UnitID',
    });
    UnitsStore.createIndex('UnitID', 'UnitID');
  }
  if (storeNames.indexOf(STATE_STORE_NAME) === -1) {
    const StatesStore = upgradeDb.createObjectStore(STATE_STORE_NAME, {
      keyPath: 'State',
    });
    StatesStore.createIndex('State', 'State');
  }
  if (storeNames.indexOf(TASK_STORE_NAME) === -1) {
    const TasksStore = upgradeDb.createObjectStore(TASK_STORE_NAME, {
      keyPath: 'ID',
    });
    TasksStore.createIndex('ID', 'ID');
  }
  if (storeNames.indexOf(TASK_STATUS_STORE_NAME) === -1) {
    const TasksStore = upgradeDb.createObjectStore(TASK_STATUS_STORE_NAME, {
      keyPath: 'ID',
    });
    TasksStore.createIndex('ID', 'ID');
  }
  if (storeNames.indexOf(TASK_NOTES_STORE_NAME) === -1) {
    const TasksStore = upgradeDb.createObjectStore(TASK_NOTES_STORE_NAME, {
      keyPath: 'NoteID',
    });
    TasksStore.createIndex('NoteID', 'NoteID');
  }
});

const add = (dbStore, data) => OpenIDB().then((db) => {
  const tx = db.transaction(dbStore, 'readwrite');
  const store = tx.objectStore(dbStore);
  store.put(data);
  return tx.complete;
});

const search = (dbStore, dbIndex, searchKey, searchValue, callback) => {
  const results = [];
  return OpenIDB().then((db) => {
    const tx = db.transaction(dbStore, 'readwrite');
    const store = tx.objectStore(dbStore);

    if (!dbIndex) { return store.openCursor(); }
    const index = store.index(dbIndex);
    return index.openCursor();
  })
    .then(function findItem(cursor) {
      if (!cursor) {
        callback(results);
        return;
      }
      if (cursor.value[searchKey] === searchValue) {
        results.push(cursor.value);
      }
      cursor.continue().then(findItem);
    })
    .then(() => true);
};

const remove = (dbStore, dbIndex, searchKey, searchValue) => OpenIDB().then((db) => {
  const tx = db.transaction(dbStore, 'readwrite');
  const store = tx.objectStore(dbStore);

  if (!dbIndex) { return store.openCursor(); }
  const index = store.index(dbIndex);
  return index.openCursor();
})
  .then(function deleteItem(cursor) {
    if (!cursor) {
      return;
    }
    if (cursor.value[searchKey] === searchValue) {
      cursor.delete();
    }
    cursor.continue().then(deleteItem);
  })
  .then(() => true);

const retrieve = (dbStore, dbIndex, check) => OpenIDB().then((db) => {
  console.log(db);
  const tx = db.transaction(dbStore);
  const store = tx.objectStore(dbStore);

  if (!check) { return store.getAll(); }

  const index = store.index(dbIndex);
  return index.getAll(check);
});

export default {
  STATE_STORE_NAME,
  TASK_STORE_NAME,
  UNIT_STORE_NAME,
  TASK_STATUS_STORE_NAME,
  TASK_NOTES_STORE_NAME,
  add,
  search,
  remove,
  retrieve,
};
