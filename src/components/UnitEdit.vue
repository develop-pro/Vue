<template>
  <main class="main-content" >
    
    <form novalidate class="" @submit.prevent="validateForm">
      <md-card>
        <md-card-header v-show="this.unitid">
          
        </md-card-header>
        <md-card-content class="input-container">
          
          <md-field :class="getValidationClass('Address1')" class="input-lg-width">
            <label>address</label>
            <md-input v-model="form.Address1" autocomplete='address-line1'></md-input>
            <span class="md-error" v-if="!$v.form.Address1.required">The Address1 is required</span>
          </md-field>        
          
          <md-field class="input-lg-width">
            <label>address2</label>
            <md-input v-model="form.Address2" autocomplete='address-level2'></md-input>
          </md-field>
          
          <md-field :class="getValidationClass('Zip')"  class="input-md-width">
            <label>zip</label>
            <md-input v-model="form.Zip" autocomplete='zip'></md-input>
          </md-field>
      
          <md-field :class="getValidationClass('City')" class="input-md-width">
            <label>city</label>
            <md-input v-model="form.City" autocomplete='city'></md-input>
          </md-field> 
      
          <md-field :class="getValidationClass('State')" class="input-md-width">
            <select name="st" id="st" v-model="form.State">
              <option v-for="(state, index) in states" :value="state.StateAbbr" :key="index">{{state.StateAbbr}}</option>
            </select>
          </md-field>
        </md-card-content>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
        
        
        <md-card-actions md-alignment="space-between">
          <div>
            <md-button  @click.native="remove" style="float: left;" v-show="unitid">
              delete
            </md-button>
            <md-button class="md-raised" @click.native="showNewLeaseForm()" v-show="unitid">new lease</md-button>
          </div>
          
          <div>
            <md-button @click.native="goBack"><md-icon>close</md-icon>Cancel</md-button>
              <span style="width:50px;"></span>
            <md-button type="submit" class="md-raised md-primary" style="color:white" :disabled="checkValidate()">Save</md-button>
          </div>
        </md-card-actions>
      </md-card>
      
      <md-table v-model="state.leases" md-card v-show="state.leases.length>0">
        <!--<md-table-toolbar>-->
        <!--  <h1 class="md-title">previous leases</h1>-->
        <!--</md-table-toolbar>-->
        <md-table-row slot="md-table-row" slot-scope="{ item }" :class="getClass(item)" md-selectable="single" @click.native="onSelectLease(item)">
          <md-table-cell>${{item.Rent}}</md-table-cell>
          <md-table-cell>{{item.StartDate}} - {{item.EndDate}}</md-table-cell>
          <md-table-cell>
            <div v-for="tenant of item.tenants" :key="tenant.ID">
              {{tenant.FirstName}} {{tenant.LastName}}
            </div>
          </md-table-cell>
          <md-table-cell>
            <div v-show="item.isActive" class="active-badge">Active</div>
          </md-table-cell>
        </md-table-row>
      </md-table>
     
    </form>
    <md-dialog-confirm
      :md-active.sync="showConfirm"
      md-title="Deleting is this unit permanent"
      md-content="Are you sure?"
      md-confirm-text="delete"
      md-cancel-text="cancel"
      @md-cancel="onCancel"
      @md-confirm="onConfirm"
    />
    <md-dialog :md-active.sync="showLeaseForm">
      <lease :leaseid="selectedLeaseID" :unitid="unitid" @close="showLeaseForm = false" />
    </md-dialog>
    
  </main>
 
</template>

<script>
  import { validationMixin } from 'vuelidate';
  import {
    required,
  } from 'vuelidate/lib/validators';
  import unitService from '../services/unit';
  import dexie from '../services/dexie';
  import store from '../services/store';
  
  export default {
    name: 'FormValidation',
    mixins: [validationMixin],
    store: ['state'],
    data: () => ({
      states: [],
      unitid: 0,
      form: {
        Address1: null,
        Address2: null,
        City: null,
        State: null,
        Zip: null,
      },
      leases: [],
      tenants: [],
      sending: false,
      showConfirm: false,
      showLeaseForm: false,
      selectedLeaseID: 0,
    }),
    validations: {
      form: {
        Address1: {
          required,
        },
      },
    },
    mounted() {
      this.unitid = Number(this.$route.params.id);
      if (this.unitid) {
        dexie.filter(dexie.UNIT_STORE_NAME, 'UnitID', this.unitid).then((results) => {
          this.form = results[0];
          this.form.tenants = this.form.Tenants;
        });
      }
      store.setLeases(this.unitid);
      dexie.filter(dexie.LOOKUP_STORE_NAME, 'Kind', 'state').then((results) => {
        this.states = results;
      });
    },
    methods: {
      getValidationClass(fieldName) {
        const field = this.$v.form[fieldName];
        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty,
          };
        }
        return {};
      },
      validateForm() {
        this.$v.$touch();

        if (!this.$v.$invalid) {
          this.save();
        }
      },
      checkValidate() {
        this.$v.$touch();
        return this.$v.$invalid;
      },
      getClass: ({ id }) => ({
        'md-primary': id === 2,
        'md-accent': id === 3,
      }),
      goBack() {
        this.$router.go(-1);
      },
      onSelectLease(lease) {
        this.selectedLeaseID = lease.ID;
        this.showLeaseForm = true;
      },
      showNewLeaseForm() {
        this.selectedLeaseID = 0;
        this.showLeaseForm = true;
      },
      save() {
        const data = {
          Address1: this.form.Address1,
          Address2: this.form.Address2,
          City: this.form.City,
          State: this.form.State,
          Zip: this.form.Zip,
        };
        if (this.unitid) { // if update
          if (navigator.onLine) {
            this.sending = true;
            data.ID = this.unitid;
            const saveData = Object.assign({}, data);
            saveData.UnitID = this.unitid;
            saveData.Tenants = this.form.Tenants;
            dexie.putItem(dexie.UNIT_STORE_NAME, saveData).then(() => {
              store.setUnits();
              this.$router.go(-1);
            });
            unitService.unitPut(localStorage.token, data).then((res) => {
              console.log(res);
              this.sending = false;
            }).catch((e) => {
              this.sending = false;
              saveData.modified = true;
              dexie.putItem(dexie.UNIT_STORE_NAME, saveData).then(() => {
                store.setUnits();
              });
              if (e.response.status === 401) {
                store.signOut();
              } else {
                console.log(e);
              }
            });
          } else {
            data.modified = true;
            data.UnitID = this.unitid;
            data.Tenants = this.form.Tenants;
            data.Tasks = this.form.Tasks;
            this.state.showSnackbar = true;
            dexie.putItem(dexie.UNIT_STORE_NAME, data).then(() => store.setUnits());
          }
        } else { // if Add
          console.log('Unit Add');
          if (navigator.onLine) {
            this.sending = true;
            const saveData = Object.assign({}, data);
            saveData.Tenants = null;
            saveData.Tasks = null;
            const unitID = Date.now();
            saveData.UnitID = unitID;
            dexie.putItem(dexie.UNIT_STORE_NAME, saveData).then(() => {
              store.setUnits();
            });
            this.$router.go(-1);
            unitService.unitAdd(localStorage.token, data).then((res) => {
              console.log(res);
              this.sending = false;
              let response = res.data[0][0];
              response = JSON.parse(response[Object.keys(response)[0]]);
              const units = response.Unit;
              dexie.removeItems(dexie.UNIT_STORE_NAME, { UnitID: unitID }).then(() => {
                dexie.putItem(dexie.UNIT_STORE_NAME, units[0]).then(() => {
                  store.setUnits();
                });
              });
            }).catch((e) => {
              console.log(e);
              if (e.response.status === 401) {
                store.signOut();
              } else {
                console.log(e);
                this.sending = false;
                saveData.added = true;
                dexie.putItem(dexie.UNIT_STORE_NAME, saveData).then(() => {
                  store.setUnits();
                });
              }
            });
          } else { // if offline then store it to indexedDB
            data.UnitID = Date.now();
            data.added = true;
            data.Tenants = null;
            data.Tasks = null;
            dexie.putItem(dexie.UNIT_STORE_NAME, data).then(() => store.setUnits());
            this.state.showSnackbar = true;
          }
        }
      },
      remove() {
        this.showConfirm = true;
      },
      onConfirm() {
        const unit = this.form;
        unit.removed = true;
        dexie.putItem(dexie.UNIT_STORE_NAME, unit).then(() => {
          store.setUnits();
          this.$router.push('/dash/unitAll');
        });
        this.sending = true;
        unitService.unitRemove(localStorage.token, this.unitid).then((res) => {
          console.log(res);
          this.sending = false;
          dexie.removeItems(dexie.UNIT_STORE_NAME, { UnitID: this.unitid }).then(() => {
            store.setUnits();
          });
        }).catch((e) => {
          this.sending = false;
          if (e.response.status === 401) {
            store.signOut();
          } else {
            console.log(e);
          }
        });
      },
      onCancel() {
      },
    },
  };

</script>
<style>
   .md-table {
     height: auto !important;
   }
   
   .md-table-content {
     height: auto !important;
   }
   
  
  #st {
    border: none;
    background: transparent;
    font-size: 16px;
    outline: none;
    width: 100%;
  }
  
 @media screen (max-width: 400px) {
    .col {
      width:20%;
    }
    .col-3 {
      width:20%;
    }
}
  
</style>