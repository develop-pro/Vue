<template>
  <md-app >
    <md-app-toolbar>
      <div class="md-toolbar-section-start">
        <md-button class="md-icon-button" @click="toggelNavigation" >
          <md-icon>menu</md-icon>
        </md-button>
        <!--<md-button class="md-title" @click.native="gotoPage('/dash')">-->
        <!--  816 Realty, llc-->
        <!--</md-button>-->
      </div>
      <div class="md-title" style="width: 50%;">
        <unit-search @onSelectUnit="onSelectUnit" />
      </div>
      <div class="md-toolbar-section-end">
        <!--<div v-if="user">-->
        <!--  {{user.FirstName}} {{user.LastName}}-->
        <!--</div>-->
        <!--<md-button class="md-icon-button" @click.native="signOut">-->
        <!--  <md-icon class="fa fa-sign-out"></md-icon>-->
        <!--</md-button>-->
      </div>
    </md-app-toolbar>
    <md-app-drawer md-persistent="mini" :md-active.sync="showNavigation" class="pc-drawer"><!-- desktop drawer -->
      <drawer-content @gotoPage="gotoPage" @signOut="signOut"/>
    </md-app-drawer>
    <md-app-drawer :md-active.sync="showMobileNavigation" class="mobile-drawer"><!-- Mobile drawer -->
      <drawer-content @gotoPage="gotoPage" @signOut="signOut"/>
    </md-app-drawer>
    <md-app-content class="main-container" v-bind:class="{ inactive: !showNavigation }">
      <snack-bar :showSnackbar="state.showSnackbar" @onClose="goBack" />
      <router-view />
    </md-app-content>
</md-app>
</template>

<style scoped>
  @media screen and (max-width: 950px) {
    .pc-drawer {
      display: none;
    }
  }
  @media screen and (min-width: 950px) {
    .mobile-drawer {
      display: none;
    }
    .inactive {
      margin-left: 70px;
    }
  }
</style>

<script>
  import unitService from './services/unit';
  import taskService from './services/task';
  import stateService from './services/state';
  import leaseService from './services/lease';
  import tenantService from './services/tenant';
  import personService from './services/person';
  import leaseTransService from './services/leaseTrans';
  import dexie from './services/dexie';
  import store from './services/store';
  
  const io = require('socket.io-client');
  
  export default {
    name: 'app',
    data: () => ({
      showNavigation: false,
      showMobileNavigation: false,
      showSidepanel: false,
    }),
    store: ['state'],
    mounted() {
      // this.showNavigation = true;
      // this.user = JSON.parse(localStorage.user);
      store.setUser();
      this.updateOnlineStatus();
      window.addEventListener('online', this.updateOnlineStatus);
      window.addEventListener('resize', this.setNavigationState);
      if (window.innerWidth > 950) {
        this.showNavigation = true;
      }
      this.bindSocket();
      this.$watch('state', (val) => {
        if (!val.user) {
          this.signOut();
        }
      }, {
        deep: true,
      });
    },
    beforeDestroy() {
      localStorage.user = null;
      localStorage.token = '';
      this.showNavigation = false;
    },
    methods: {
      goBack() {
        this.state.showSnackbar = false;
      },
      gotoPage(route) {
        if (window.innerWidth <= 950 || !route) {
          this.showNavigation = false;
          this.showMobileNavigation = false;
        }
        if (route) {
          this.$router.push(route);
        }
      },
      onSelectUnit(unitid) {
        this.$router.push(`/dash/unit/${unitid}`);
      },
      signOut() {
        this.showNavigation = false;
        this.showMobileNavigation = false;
        dexie.removedb();
        localStorage.token = '';
        const self = this;
        const gotoSignout = () => {
          self.$router.push('/');
        };
        setTimeout(gotoSignout, 100);
      },
      toggelNavigation() {
        if (window.innerWidth <= 950) {
          this.showMobileNavigation = !this.showMobileNavigation;
          this.showNavigation = false;
        } else {
          this.showNavigation = !this.showNavigation;
          this.showMobileNavigation = false;
        }
      },
      // Synchronize unit store
      async syncUnitStore(unitsFromDatabase, index) {
        if (index === unitsFromDatabase.length) {
          unitService.unitAll(localStorage.token).then((response) => {
            let data = response.data[0][0];
            data = JSON.parse(data[Object.keys(data)[0]]);
            const units = data.Unit;
            console.log('units from endpoint = ', units);
            dexie.removeAll(dexie.UNIT_STORE_NAME).then(() => {
              dexie.bulkPut(dexie.UNIT_STORE_NAME, units);
              store.setUnits();
            });
          }).catch((e) => {
            console.log(e.response);
            if (e.response.status === 401) {
              store.signOut();
            } else {
              console.log(e);
              store.setUnits();
            }
          });
        } else {
          const unit = unitsFromDatabase[index];
          if (unit.added) {
            const data = {
              Address1: unit.Address1,
              Address2: unit.Address2,
              City: unit.City,
              State: unit.State,
              Zip: unit.Zip,
            };
            // post unit to the server
            unitService.unitAdd(localStorage.token, data).then(() => {
              console.log('All units added to server');
              this.syncUnitStore(unitsFromDatabase, index + 1);
            }).catch((e) => {
              console.log(e);
              this.syncUnitStore(unitsFromDatabase, index + 1);
            });
          } else if (unit.modified) {
            const data = {
              ID: unit.UnitID,
              Address1: unit.Address1,
              Address2: unit.Address2,
              City: unit.City,
              State: unit.State,
              Zip: unit.Zip,
            };
            // put unit to the server
            unitService.unitPut(localStorage.token, data).then(() => {
              console.log('All units added to server');
              this.syncUnitStore(unitsFromDatabase, index + 1);
            }).catch((e) => {
              console.log(e);
              this.syncUnitStore(unitsFromDatabase, index + 1);
            });
          } else if (unit.removed) {
            unitService.unitRemove(localStorage.token, unit.UnitID).then(() => {
              this.syncUnitStore(unitsFromDatabase, index + 1);
            }).catch((e) => {
              console.log(e);
              this.syncUnitStore(unitsFromDatabase, index + 1);
            });
          } else {
            this.syncUnitStore(unitsFromDatabase, index + 1);
          }
        }
      },
      // Synchronize Task store
      syncTaskStore(tasksFromDatabase, index) {
        if (index === tasksFromDatabase.length) {
          taskService.taskAll(localStorage.token).then((response) => {
            let data = response.data[0][0];
            data = JSON.parse(data[Object.keys(data)[0]]);
            const tasks = data.Task;
            console.log('tasks from endpoint = ', tasks);
            dexie.removeAll(dexie.TASK_STORE_NAME).then(() => {
              dexie.bulkPut(dexie.TASK_STORE_NAME, tasks).then(() => store.setTasks());
            });
          }).catch((e) => {
            console.log(e.response);
            if (e.response.status === 401) {
              store.signOut();
            } else {
              console.log(e);
              store.setTasks();
            }
          });
        } else {
          const task = tasksFromDatabase[index];
          if (task.added) {
            const data = {
              Task: task.Task,
              UnitID: task.UnitID,
              AssignedPersonID: task.AssignedPersonID,
              ReportingPersonID: task.ReportingPersonID,
              StatusID: task.StatusID,
            };
            // post task to the server
            taskService.taskPost(localStorage.token, data).then((res) => {
              console.log(res);
              this.syncTaskStore(tasksFromDatabase, index + 1);
            }).catch((e) => {
              console.log(e);
              this.syncTaskStore(tasksFromDatabase, index + 1);
            });
          } else if (task.modified) {
            const data = {
              ID: task.ID,
              Task: task.Task,
              UnitID: task.UnitID,
              AssignedPersonID: task.AssignedPersonID,
              ReportingPersonID: task.ReportingPersonID,
              StatusID: task.StatusID,
            };
            // put task to the server
            taskService.taskPut(localStorage.token, data).then((response) => {
              console.log(response);
              this.syncTaskStore(tasksFromDatabase, index + 1);
            }).catch((e) => {
              console.log(e);
              this.syncTaskStore(tasksFromDatabase, index + 1);
            });
          } else if (task.removed) {
            taskService.taskRemove(localStorage.token, task.ID).then(() => {
              this.syncUnitStore(tasksFromDatabase, index + 1);
            }).catch((e) => {
              console.log(e);
              this.syncTaskStore(tasksFromDatabase, index + 1);
            });
          } else {
            this.syncTaskStore(tasksFromDatabase, index + 1);
          }
        }
      },
      // Synchronize Note store
      syncNoteStore(notesFromDatabase, index) {
        if (index === notesFromDatabase.length) {
          taskService.taskNoteAll(localStorage.token).then((response) => {
            let data = response.data[0][0];
            data = JSON.parse(data[Object.keys(data)[0]]);
            const notes = data.TaskNote;
            console.log('notes from endpoint = ', notes);
            dexie.removeAll(dexie.TASK_NOTES_STORE_NAME).then(() => dexie.bulkPut(dexie.TASK_NOTES_STORE_NAME, notes));
          }).catch((e) => {
            console.log(e.response);
            if (e.response.status === 401) {
              store.signOut();
            } else {
              console.log(e);
            }
          });
        } else {
          const note = notesFromDatabase[index];
          if (note.added) {
            const data = {
              Note: note.Note,
              TaskID: note.TaskID,
            };
            // post note to the server
            taskService.taskNotePost(localStorage.token, data).then((res) => {
              console.log(res);
              this.syncNoteStore(notesFromDatabase, index + 1);
            }).catch((e) => {
              console.log(e);
              this.syncNoteStore(notesFromDatabase, index + 1);
            });
          } else if (note.modified) {
          } else {
            this.syncNoteStore(notesFromDatabase, index + 1);
          }
        }
      },
      // Sync lease store
      syncLeaseStore(leasesFromDatabase, index) {
        if (index === leasesFromDatabase.length) {
          leaseService.leaseAll(localStorage.token).then((response) => {
            let data = response.data[0][0];
            data = JSON.parse(data[Object.keys(data)[0]]);
            const leases = data.Lease;
            console.log('leases from endpoint = ', leases);
            dexie.removeAll(dexie.LEASE_STORE_NAME).then(() => dexie.bulkPut(dexie.LEASE_STORE_NAME, leases));
          }).catch((e) => {
            console.log(e.response);
            if (e.response.status === 401) {
              store.signOut();
            } else {
              console.log(e);
            }
          });
          tenantService.tenantAll(localStorage.token).then((response) => {
            let data = response.data[0][0];
            data = JSON.parse(data[Object.keys(data)[0]]);
            const tenants = data.Tenant;
            console.log('tenants from endpoint = ', tenants);
            dexie.removeAll(dexie.TENANT_STORE_NAME).then(() => dexie.bulkPut(dexie.TENANT_STORE_NAME, tenants));
          });
        } else {
          const lease = leasesFromDatabase[index];
          if (lease.added) {
            const data = {
              StartDate: lease.StartDate,
              EndDate: lease.EndDate,
              Rent: lease.Rent,
              UnitID: lease.UnitID,
            };
            leaseService.leaseAdd(localStorage.token, data).then((response) => {
              console.log(response);
              this.syncLeaseStore(leasesFromDatabase, index + 1);
              this.syncTenant(lease.LeaseID, response.data[0][0].ID);
            }).catch((e) => {
              console.log(e);
              this.syncLeaseStore(leasesFromDatabase, index + 1);
            });
          } else {
            this.syncLeaseStore(leasesFromDatabase, index + 1);
          }
        }
      },
      // Sync Tenant
      syncTenant(leaseID, newLeaseID) {
        const user = JSON.parse(localStorage.user);
        dexie.retrieveByWhere(dexie.TENANT_STORE_NAME, { LeaseID: leaseID }).then((tenants) => {
          for (const tenant of tenants) {
            if (tenant.added) {
              personService.personAdd(localStorage.token, {
                FirstName: tenant.firstName,
                LastName: tenant.lastName,
                CasaOrgID: user.CasaOrgID,
              }).then((response) => {
                const ID = response.data[0][0].ID;
                tenant.ID = ID;
                tenant.LeaseID = newLeaseID;
                dexie.putItem(dexie.TENANT_STORE_NAME, tenant).then(() => {});
                tenantService.tenantAdd(localStorage.token, { LeaseID: newLeaseID, PersonID: ID });
              }).catch((e) => {
                console.log(e);
              });
            }
          }
        });
      },
      // Sync LeaseTrans
      syncLeaseTransStore(leaseTransFromDatabase, index) {
        if (index === leaseTransFromDatabase.length) {
          leaseTransService.leaseTransAll(localStorage.token).then((response) => {
            let data = response.data[0][0];
            data = JSON.parse(data[Object.keys(data)[0]]);
            const transes = data.LeaseTrans;
            console.log('leaseTranses from endpoint = ', transes);
            dexie.removeAll(dexie.LEASE_TRANS_STORE_NAME).then(() => dexie.bulkPut(dexie.LEASE_TRANS_STORE_NAME, transes));
          }).catch((e) => {
            console.log(e.response);
            if (e.response.status === 401) {
              store.signOut();
            } else {
              console.log(e);
            }
          });
        } else {
          const trans = leaseTransFromDatabase[index];
          if (trans.added) {
            const data = {
              LeaseID: trans.LeaseID,
              Amount: trans.Amount,
              Description: trans.Description,
            };
            leaseTransService.leaseTransAdd(localStorage.token, {
              LeaseID: data.LeaseID,
              Amount: data.Amount,
              Description: data.Description,
            }).then((res) => {
              console.log(res);
              this.syncLeaseTransStore(leaseTransFromDatabase, index + 1);
            }).catch((e) => {
              console.log(e);
              if (e.response.status === 401) {
                store.signOut();
              } else {
                console.log(e);
                this.syncLeaseTransStore(leaseTransFromDatabase, index + 1);
              }
            });
          } else if (trans.modified) {
            leaseTransService.leaseTransPut(localStorage.token, {
              LeaseID: trans.LeaseID,
              Amount: trans.Amount,
              Description: trans.Description,
            }).then((res) => {
              console.log(res);
              this.syncLeaseTransStore(leaseTransFromDatabase, index + 1);
            }).catch((e) => {
              console.log(e);
              if (e.response.status === 401) {
                store.signOut();
              } else {
                console.log(e);
                this.syncLeaseTransStore(leaseTransFromDatabase, index + 1);
              }
            });
          }
        }
      },
      refreshAllStores() {
        // refresh units
        dexie.retrieve(dexie.UNIT_STORE_NAME).then((units) => {
          console.log('units from db = ', units);
          this.syncUnitStore(units, 0);
        });
        // refresh tasks
        dexie.retrieve(dexie.TASK_STORE_NAME).then((tasksFromDatabase) => {
          console.log('tasks from db = ', tasksFromDatabase);
          this.syncTaskStore(tasksFromDatabase, 0);
        });
        // refresh task notes
        dexie.retrieve(dexie.TASK_NOTES_STORE_NAME).then((notesFromDatabase) => {
          console.log('notes from db = ', notesFromDatabase);
          this.syncNoteStore(notesFromDatabase, 0);
        });
        // refresh lease
        dexie.retrieve(dexie.LEASE_STORE_NAME).then((leasesFromDatabase) => {
          console.log('leases from db = ', leasesFromDatabase);
          this.syncLeaseStore(leasesFromDatabase, 0);
        });
        // refresh leasetrans
        dexie.retrieve(dexie.LEASE_TRANS_STORE_NAME).then((transFromDatabase) => {
          console.log('trans from db = ', transFromDatabase);
          this.syncLeaseTransStore(transFromDatabase, 0);
        });
        // refresh state
        dexie.getCount(dexie.LOOKUP_STORE_NAME, 'Kind', 'state').then((count) => {
          if (count === 0) { // if not yet synchronized with server
            stateService.stateAll(localStorage.token).then((response) => {
              let data = response.data[0][0];
              data = JSON.parse(data[Object.keys(data)[0]]);
              const results = data.State;
              console.log('state from endpoint = ', results);
              const states = [];
              for (const state of results) {
                state.Kind = 'state';
                states.push(state);
              }
              dexie.removeItems(dexie.LOOKUP_STORE_NAME, { Kind: 'state' }).then(() => dexie.bulkPut(dexie.LOOKUP_STORE_NAME, states));
            }).catch((e) => {
              console.log(e);
              if (e.response.status === 401) {
                this.signOut();
              } else {
                console.log(e);
              }
            });
          }
        });
        // refresh task status
        dexie.getCount(dexie.LOOKUP_STORE_NAME, 'Kind', 'taskStatus').then((count) => {
          if (count === 0) { // if not yet synchronized with server
            taskService.taskStatusAll(localStorage.token).then((response) => {
              let data = response.data[0][0];
              data = JSON.parse(data[Object.keys(data)[0]]);
              const results = data.TaskStatus;
              console.log('taskstatus from endpoint = ', results);
              // Caching states
              const states = [];
              for (const state of results) {
                state.Kind = 'taskStatus';
                states.push(state);
              }
              dexie.removeItems(dexie.LOOKUP_STORE_NAME, { Kind: 'taskStatus' }).then(() => dexie.bulkPut(dexie.LOOKUP_STORE_NAME, states));
            }).catch((e) => {
              console.log(e);
            });
          }
        });
      },
      updateOnlineStatus() {
        console.log('Online');
        this.refreshAllStores();
      },
      setNavigationState() {
        if (window.innerWidth >= 950) {
          this.showNavigation = true;
        } else {
          this.showNavigation = false;
        }
      },
      bindSocket() {
        const adminSocket = io('https://api.casamonkey.com/admin');
        adminSocket.on('add', (data) => {
          console.log(data);
          const id = data.id;
          if (id === 'Unit') {
            const unit = data.data[0];
            dexie.putItem(dexie.UNIT_STORE_NAME, unit).then(() => {
              store.setUnits();
            });
          } else if (id === 'Task') {
            const task = data.data[0];
            dexie.putItem(dexie.TASK_STORE_NAME, task).then(() => {
              store.setTasks();
            });
          } else if (id === 'TaskNote') {
            const note = data.data[0];
            dexie.putItem(dexie.TASK_NOTES_STORE_NAME, note).then(() => {
              store.setTaskNotes();
            });
          } else if (id === 'Lease') {
            const lease = data.data[0];
            dexie.putItem(dexie.LEASE_STORE_NAME, lease).then(() => {
            });
          } else if (id === 'Tenant') {
            const tenant = data.data[0];
            dexie.putItem(dexie.TENANT_STORE_NAME, tenant).then(() => {
            });
          }
        });
        adminSocket.on('put', (data) => {
          console.log(data);
          const id = data.id;
          if (id === 'Unit') {
            const unit = data.data[0];
            dexie.putItem(dexie.UNIT_STORE_NAME, unit).then(() => {
              store.setUnits();
            });
          } else if (id === 'Task') {
            const task = data.data[0];
            dexie.putItem(dexie.TASK_STORE_NAME, task).then(() => {
              store.setTasks();
            });
          } else if (id === 'TaskNote') {
            const note = data.data[0];
            dexie.putItem(dexie.TASK_NOTES_STORE_NAME, note).then(() => {
              store.setTaskNotes();
            });
          } else if (id === 'Lease') {
            const lease = data.data[0];
            dexie.putItem(dexie.LEASE_STORE_NAME, lease).then(() => {
            });
          } else if (id === 'Tenant') {
            const tenant = data.data[0];
            dexie.putItem(dexie.TENANT_STORE_NAME, tenant).then(() => {
            });
          }
        });
        adminSocket.on('delete', (data) => {
          console.log(data);
          const id = data.id;
          if (id === 'Unit') {
            const unitid = data.data[0].ID;
            dexie.removeItems(dexie.UNIT_STORE_NAME, { UnitID: unitid }).then(() => {
              store.setUnits();
            });
          } else if (id === 'Task') {
            const taskid = data.data[0].ID;
            dexie.removeItems(dexie.TASK_STORE_NAME, { ID: taskid }).then(() => {
              store.setTasks();
            });
          } else if (id === 'TaskNote') {
            const noteid = data.data[0].ID;
            dexie.removeItems(dexie.TASK_NOTES_STORE_NAME, { NoteID: noteid }).then(() => {
              store.setTaskNotes();
            });
          } else if (id === 'Lease') {
            const leaseid = data.data[0].ID;
            dexie.removeItems(dexie.LEASE_STORE_NAME, { ID: leaseid }).then(() => {
            });
          } else if (id === 'Tenant') {
            const tenantid = data.data[0].ID;
            dexie.removeItems(dexie.TENANT_STORE_NAME, { ID: tenantid }).then(() => {
            });
          }
        });
      },
    },
  };

</script>
