<template>
  <div>
    <md-steppers md-vertical>
      <md-step id="first" md-label="enter new lease information" >
        <div class="input-container">
  
          <md-datepicker v-model="lease.StartDate" class="input-lg-width">
            <label>start date</label>
          </md-datepicker>
          <md-datepicker v-model="lease.EndDate"  class="input-lg-width">
            <label>end date</label>
          </md-datepicker>
          <md-field  class="input-lg-width">
              <md-icon>attach_money</md-icon>
              <label>rent amount</label>
              <md-input v-model="lease.Rent" type="number" step="50"></md-input>
          </md-field>
          <br>
          <md-checkbox v-model="lease.isActive">is this the active lease?</md-checkbox>
          
        </div>
        
        <!-- when they change to next step, save data-->
        
      </md-step>
  
      <md-step id="second" md-label="add tenants to lease">
        <md-table>
            <md-table-row v-for="tenant in tenants" :key="tenant.ID" v-show="!tenant.removed">
              <md-table-cell>{{tenant.FirstName}}</md-table-cell>
              <md-table-cell>{{tenant.LastName}}</md-table-cell>
              <md-table-cell @click.native="removeTenant(tenant)" class="remove-button">
                Remove
              </md-table-cell>
            </md-table-row>
          </md-table>
        
        <div class="input-container">
  
          <md-field class="input-lg-width">
              <label>first name</label>
              <md-input  type="text" v-model="tenant.FirstName"></md-input>
          </md-field>  
          
          <md-field class="input-lg-width">
              <label>last name</label>
              <md-input  type="text" v-model="tenant.LastName"></md-input>
          </md-field>  
          
          <span style="margin-top:10px;">
            <md-button class="md-raised md-primary" @click.native="addTenant">add tenant</md-button>    
          </span>
          
        </div>
      </md-step>
    </md-steppers>
    <md-dialog-actions>
      <md-button class="md-primary md-accent" @click="removeLease" v-show="leaseid"><md-icon>close</md-icon>Remove</md-button>
      <md-button class="md-primary" @click="close"><md-icon>close</md-icon>Cancel</md-button>
      <md-button class="md-raised md-primary" @click="save">Save</md-button>
    </md-dialog-actions>
  </div>
</template>
<style>
  .remove-button {
    cursor: pointer;
  }
</style>
<script>
  import leaseService from '../services/lease';
  import personService from '../services/person';
  import tenantService from '../services/tenant';
  import dexie from '../services/dexie';
  import utilities from '../services/utilities';
  import store from '../services/store';
  
  export default {
    store: ['state'],
    data: () => ({
      lease: {
        StartDate: utilities.getTomorrow(),
        EndDate: utilities.getAfterOneYear(),
        Rent: 0,
      },
      tenant: {
        FirstName: '',
        LastName: '',
      },
      tenants: [],
      removedTenants: [],
    }),
    props: {
      leaseid: {
        type: Number,
        default: 0,
      },
      unitid: {
        type: Number,
        default: 0,
      },
    },
    methods: {
      close() {
        if (this.removedTenants.length > 0) { // if removed tenants exist then mark them as unremoved
          for (const tenant of this.removedTenants) {
            const item = Object.assign({}, tenant);
            item.removed = 0;
            if (item.PersonID) {
              dexie.putItem(dexie.TENANT_STORE_NAME, item);
            } else {
              dexie.removeItems(dexie.TENANT_STORE_NAME, { ID: tenant.ID });
            }
          }
        }
        this.$emit('close');
      },
      removeLease() {
        const data = {
          ID: this.lease.ID,
          StartDate: this.lease.StartDate,
          EndDate: this.lease.EndDate,
          UnitID: this.lease.UnitID,
          Rent: this.lease.Rent,
          isActive: this.lease.isActive ? 1 : 0,
          removed: 1,
        };
        dexie.putItem(dexie.LEASE_STORE_NAME, data).then(() => {
          this.getLeases();
        });
        leaseService.leaseRemove(localStorage.token, this.leaseid).then(() => {
          dexie.removeItems(dexie.LEASE_STORE_NAME, { ID: this.leaseid });
          this.getLeases();
        }).catch((e) => {
          if (e.response.status === 401) {
            localStorage.token = '';
            this.$router.push('/');
          } else {
            console.log(e);
          }
        });
        this.$emit('close');
      },
      removeTenant(tenant) {
        const item = Object.assign({}, tenant);
        item.removed = 1;
        dexie.putItem(dexie.TENANT_STORE_NAME, item);
        this.getTenants(this.leaseid);
        this.removedTenants.push(tenant);
      },
      save() {
        this.$emit('close');
        if (this.lease.isActive) { // if set active then mark other leases as inactive
          dexie.retrieveByWhere(dexie.LEASE_STORE_NAME, { UnitID: this.unitid }).then((leases) => {
            for (const lease of leases) {
              if (lease.ID !== this.leaseid) {
                const item = Object.assign({}, lease);
                item.isActive = 0;
                dexie.putItem(dexie.LEASE_STORE_NAME, item);
              }
            }
          });
        }
        if (this.leaseid) { // if update
          dexie.putItem(dexie.LEASE_STORE_NAME, this.lease).then(() => {
            this.putTenants(this.leaseid);
            this.getLeases();
          });
          if (navigator.onLine) {
            console.log(this.lease);
            const data = {
              ID: this.lease.ID,
              StartDate: this.lease.StartDate,
              EndDate: this.lease.EndDate,
              UnitID: this.lease.UnitID,
              Rent: this.lease.Rent,
              isActive: this.lease.isActive ? 1 : 0,
            };
            leaseService.leasePut(localStorage.token, data).then((response) => {
              console.log(response);
            }).catch((e) => {
              this.lease.modified = true;
              dexie.putItem(dexie.LEASE_STORE_NAME, this.lease).then(() => {
                this.getLeases();
              });
              if (e.response.status === 401) {
                localStorage.token = '';
                this.$router.push('/');
              } else {
                console.log(e);
              }
            });
            this.postTenants(this.leaseid);
          } else {
            this.lease.modified = true;
            dexie.putItem(dexie.LEASE_STORE_NAME, this.lease).then(() => {
              this.getLeases();
            });
          }
        } else {
          const leaseID = Date.now();
          const data = {
            UnitID: this.unitid,
            StartDate: this.lease.StartDate,
            EndDate: this.lease.EndDate,
            Rent: this.lease.Rent,
            isActive: this.lease.isActive ? 1 : 0,
          };
          const saveData = Object.assign({}, data);
          saveData.ID = leaseID;
          dexie.putItem(dexie.LEASE_STORE_NAME, saveData).then(() => {
            this.putTenants(leaseID);
            this.getLeases();
          }); // add lease then add tenants
          if (navigator.onLine) {
            leaseService.leaseAdd(localStorage.token, data).then((response) => {
              console.log(response);
              let res = response.data[0][0];
              res = JSON.parse(res[Object.keys(res)[0]]);
              const leases = res.Lease;
              const ID = leases[0].ID;
              data.ID = ID;
              dexie.removeItems(dexie.LEASE_STORE_NAME, { ID: leaseID }).then(() => {
                dexie.putItem(dexie.LEASE_STORE_NAME, data).then(() => {
                  this.getLeases();
                });
              });
              dexie.removeItems(dexie.TENANT_STORE_NAME, { LeaseID: leaseID }).then(() => this.postTenants(ID));
            }).catch((e) => {
              saveData.added = true;
              dexie.putItem(dexie.LEASE_STORE_NAME, saveData).then(() => {
                this.getLeases();
              });
              if (e.response.status === 401) {
                localStorage.token = '';
                this.$router.push('/');
              } else {
                console.log(e);
              }
            });
          } else {
            saveData.added = true;
            dexie.putItem(dexie.LEASE_STORE_NAME, saveData).then(() => {
              this.getLeases();
            });
            this.putTenants(leaseID);
            this.state.showSnackbar = true;
          }
        }
      },
      putTenants(leaseID) {
        for (const tenant of this.tenants) {
          tenant.LeaseID = leaseID;
          dexie.putItem(dexie.TENANT_STORE_NAME, tenant);
        }
      },
      postTenants(leaseID) {
        const user = JSON.parse(localStorage.user);
        for (const tenant of this.tenants) {
          if (tenant.added) {
            tenant.LeaseID = leaseID;
            personService.personAdd(localStorage.token, {
              FirstName: tenant.FirstName,
              LastName: tenant.LastName,
              CasaOrgID: user.CasaOrgID,
            }).then((res) => {
              dexie.removeItems(dexie.TENANT_STORE_NAME, { ID: tenant.ID }).then(() => {
                let response = res.data[0][0];
                response = JSON.parse(response[Object.keys(response)[0]]);
                const person = response.Person[0];
                const ID = person.ID;
                tenant.ID = ID;
                tenant.added = false;
                dexie.putItem(dexie.TENANT_STORE_NAME, tenant).then(() => {
                  this.getLeases();
                });
                tenantService.tenantAdd(localStorage.token, { LeaseID: leaseID, PersonID: ID });
              });
            }).catch((e) => {
              tenant.added = true;
              dexie.putItem(dexie.TENANT_STORE_NAME, tenant).then(() => {
                this.getLeases();
              });
              if (e.response.status === 401) {
                localStorage.token = '';
                this.$router.push('/');
              } else {
                console.log(e);
              }
            });
          } else if (tenant.modified) { // if modified
          } else if (tenant.removed) { // if removed
            tenantService.tenantRemove(localStorage.token, tenant.ID).then(() => {
              dexie.removeItems(dexie.TENANT_STORE_NAME, { ID: tenant.ID });
              this.getLeases();
            });
          }
        }
      },
      addTenant() {
        if (this.tenant.FirstName && this.tenant.LastName) {
          const tenant = Object.assign({}, this.tenant);
          tenant.ID = Date.now();
          tenant.added = true;
          this.tenants.push(tenant);
        }
        this.tenant.FirstName = '';
        this.tenant.LastName = '';
      },
      getLease() {
        dexie.filter(dexie.LEASE_STORE_NAME, 'ID', this.leaseid).then((results) => {
          if (results.length > 0) {
            const lease = results[0];
            this.lease = Object.assign({}, lease);
            if (lease.isActive === 1) {
              this.lease.isActive = true;
            } else {
              this.lease.isActive = false;
            }
          }
        });
        this.getTenants(this.leaseid);
      },
      getTenants(leaseid) {
        dexie.retrieveByWhere(dexie.TENANT_STORE_NAME, { LeaseID: leaseid }).then((results) => {
          this.tenants = results;
        });
      },
      getLeases() {
        store.setLeases(this.unitid);
        store.setUnits();
      },
    },
    mounted() {
      if (this.leaseid) {
        this.getLease();
      }
    },
    watch: {
      leaseid: {
        handler() {
          this.getLease();
        },
      },
    },
  };
</script>