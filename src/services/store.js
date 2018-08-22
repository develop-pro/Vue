import dexie from './dexie';
import utilities from './utilities';

const state = {
  showSnackbar: false,
  units: [],
  tasks: {
    priorities: [],
    laters: [],
    completes: [],
  },
  taskNotes: [],
  selectedTaskStatusID: 1,
  selectedTaskID: 0,
  user: null,
  leases: [],
  loading: true,
  rentDue: 0,
  selectedTrans: {
    Amount: 0,
    Description: '',
  },
  selectedTransID: 0,
  transList: [],
  RentDue: 0,
};
const setUnits = () => {
  dexie.retrieveBySortASC(dexie.UNIT_STORE_NAME, 'Address1').then((units) => {
    state.units = [];
    for (const unit of units) {
      if (!unit.removed) {
        state.units.push(unit);
      }
    }
    console.log('state units = ', state.units);
    state.rentDue = 0;
    for (const unit of state.units) {
      if (unit.RentDue) {
        state.rentDue += Number(unit.RentDue);
      }
    }
  });
};
const setTasks = () => {
  dexie.retrieveTasks(dexie.TASK_STORE_NAME, null).then((tasksFromDatabase) => {
    state.tasks.priorities = [];
    state.tasks.laters = [];
    state.tasks.completes = [];
    for (const task of tasksFromDatabase) {
      if (!task.removed) {
        task.CreatedTime = utilities.getFormattedDateFromDateObj(new Date(task.CreatedTime));
        task.Task = task.Task.replace(/\n/g, '<br />');
        if (task.StatusID === 1) {
          state.tasks.priorities.push(task);
        } else if (task.StatusID === 2) {
          state.tasks.laters.push(task);
        } else if (task.StatusID === 3) {
          state.tasks.completes.push(task);
        }
      }
    }
    state.loading = false;
  });
};
const setTaskNotes = () => {
  dexie.retrieveNotes(dexie.TASK_NOTES_STORE_NAME, { TaskID: state.selectedTaskID }).then((results) => {
    state.taskNotes = [];
    for (const result of results) {
      result.ModTime = utilities.getFormattedDateTimeFromDateObj(new Date(result.ModTime));
      result.Note = result.Note.replace(/\n/g, '<br />');
      state.taskNotes.push(result);
    }
  });
};
const setSelectedTaskID = (taskID) => {
  state.selectedTaskID = taskID;
};
const setUser = () => {
  state.user = JSON.parse(localStorage.user);
};
const signOut = () => {
  state.loading = true;
  state.user = null;
};
const setLeases = (unitid) => {
  dexie.retrieveLeases(dexie.LEASE_STORE_NAME, { UnitID: unitid }).then((results) => {
    state.leases = [];
    dexie.retrieve(dexie.TENANT_STORE_NAME).then((tenants) => {
      for (const result of results) {
        if (!result.removed) {
          result.StartDate = utilities.getFormattedDate(result.StartDate);
          result.EndDate = utilities.getFormattedDate(result.EndDate);
          const tenantList = [];
          for (const tenant of tenants) {
            if (tenant.LeaseID === result.ID) {
              tenantList.push(tenant);
            }
          }
          result.tenants = tenantList;
          state.leases.push(result);
        }
      }
    });
  });
};

const setSelectedTransID = (transID) => {
  state.selectedTransID = transID;
};

const getTransList = (unitid) => {
  dexie.filter(dexie.LEASE_TRANS_STORE_NAME, 'UnitID', unitid).then((results) => {
    state.transList = results;
    state.RentDue = 0;
    for (const item of state.transList) {
      if (item.Amount) {
        state.RentDue += Number(item.Amount);
      }
    }
  });
};
export default {
  state,
  setUnits,
  setTasks,
  setTaskNotes,
  setSelectedTaskID,
  setUser,
  setLeases,
  signOut,
  setSelectedTransID,
  getTransList,
};
