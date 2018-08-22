<template>
  <div>
    <form novalidate class="" @submit.prevent="validateForm">
      <md-card>
        <md-card-content class="input-container">
          <md-field class="input-lg-width" :class="getValidationClass('Amount')">
            <label>Amount</label>
            <md-input  type="text" v-model="form.Amount"></md-input>
          </md-field>
          <md-field class="input-lg-width" :class="getValidationClass('Description')">
            <label>Description</label>
            <md-input  type="text" v-model="form.Description"></md-input>
          </md-field>
        </md-card-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="close"><md-icon>close</md-icon>Reset</md-button>
          <md-button type="submit" class="md-raised md-primary" :disabled="checkValidate()">Save</md-button>
        </md-dialog-actions>
      </md-card>
    </form>
  </div>
</template>
<script>
  import { validationMixin } from 'vuelidate';
  import {
    required,
  } from 'vuelidate/lib/validators';
  import leaseTransService from '../services/leaseTrans';
  import store from '../services/store';
  import dexie from '../services/dexie';
  
  export default {
    mixins: [validationMixin],
    store: ['state'],
    data: () => ({
      form: {
        Amount: 0,
        Description: '',
      },
    }),
    props: {
      transid: {
        type: Number,
        default: 0,
      },
      unitid: {
        type: Number,
        default: 0,
      },
      activeLeaseID: {
        type: Number,
        default: 0,
      },
    },
    validations: {
      form: {
        Amount: {
          required,
        },
        Description: {
          required,
        },
      },
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
      close() {
        this.form = {
          Amount: 0,
          Description: '',
        };
        store.setSelectedTransID(0);
      },
      save() {
        const transID = Date.now();
        const data = {
          // TransID: transID,
          Amount: this.form.Amount,
          LeaseID: this.activeLeaseID,
          UnitID: this.unitid,
          Description: this.form.Description,
        };
        console.log(data);
        if (this.state.selectedTransID !== 0) { // if update
          const saveData = Object.assign({}, data);
          saveData.modified = true;
          saveData.TransID = transID;
          dexie.putItem(dexie.LEASE_TRANS_STORE_NAME, data);
          store.getTransList(this.unitid);
          data.TransID = this.state.selectedTransID;
          leaseTransService.leaseTransPut(localStorage.token, {
            TransID: this.state.selectedTransID,
            Amount: this.form.Amount,
            Description: this.form.Description,
          }).then((res) => {
            console.log(res);
            let response = res.data[0][0];
            response = JSON.parse(response[Object.keys(response)[0]]);
            const lease = response.LeaseTrans;
            dexie.removeItems(dexie.LEASE_TRANS_STORE_NAME, { TransID: this.state.selectedTransID }).then(() => {
              dexie.putItem(dexie.LEASE_TRANS_STORE_NAME, lease[0]).then(() => {
                store.getTransList(this.unitid);
              });
            });
          }).catch((e) => {
            console.log(e);
            if (e.response.status === 401) {
              store.signOut();
            } else {
              console.log(e);
            }
          });
        } else { // if add
          data.added = true;
          data.TransID = transID;
          dexie.putItem(dexie.LEASE_TRANS_STORE_NAME, data);
          store.getTransList(this.unitid);
          leaseTransService.leaseTransAdd(localStorage.token, {
            LeaseID: data.LeaseID,
            Amount: data.Amount,
            Description: data.Description,
          }).then((res) => {
            console.log(res);
            let response = res.data[0][0];
            response = JSON.parse(response[Object.keys(response)[0]]);
            const lease = response.LeaseTrans;
            dexie.removeItems(dexie.LEASE_TRANS_STORE_NAME, { TransID: transID }).then(() => {
              dexie.putItem(dexie.LEASE_TRANS_STORE_NAME, lease[0]).then(() => {
                store.getTransList(this.unitid);
              });
            });
          }).catch((e) => {
            console.log(e);
            if (e.response.status === 401) {
              store.signOut();
            } else {
              console.log(e);
            }
          });
        }
      },
    },
    mounted() {
    },
    watch: {
      transid: {
        handler() {
          if (this.transid === 0) {
            this.form = {
              Amount: 0,
              Description: '',
            };
          } else {
            dexie.retrieveByWhere(dexie.LEASE_TRANS_STORE_NAME, { TransID: this.transid }).then((results) => {
              this.form = results[0];
            });
          }
        },
      },
    },
  };
</script>