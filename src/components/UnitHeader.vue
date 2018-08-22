<template>
    <div>
      <md-card >
        <md-card-header>
          <div class="md-title">
            <md-button  @click.native="unitEdit" class="md-title">
              {{this.form.Address1}} {{this.form.Address2}}
            </md-button>
          </div>
          <div style="margin-left:10px;">
              {{this.form.City}} {{this.form.State}} {{this.form.Zip}}
          </div>
         
        </md-card-header>
        <md-card-content>
          <md-list>
            <md-list-item v-for="tenant in this.tenants" :key="tenant.FirstName">
              <md-chip class="chip" v-if="tenant.FirstName">{{tenant.FirstName.charAt(0)}}</md-chip>
              <span class="md-list-item-text" v-if="tenant.FirstName">{{tenant.FirstName}} {{tenant.LastName}}</span>
            </md-list-item>
          </md-list>
        </md-card-content>
        <md-progress-bar md-mode="indeterminate" v-if="sending" />
      </md-card>
    </div>
</template>
<style>
  .chip {
    margin-right: 20px;
  }
  .list-item {
    cursor: pointer;
  }
</style>
<script>
  import dexie from '../services/dexie';
  
  export default {
    props: {
      unitid: {
        type: Number,
        default: 0,
      },
      taskid: {
        type: Number,
        default: 0,
      },
    },
    data: () => ({
      form: {
        Address1: '',
        Address2: '',
        tenants: [],
      },
      tenants: [],
      tasks: [],
      sending: false,
    }),
    methods: {
      unitEdit() {
        this.$router.push(`/dash/unitEdit/${this.unitid}`);
      },
      getUnit() {
        dexie.filter(dexie.UNIT_STORE_NAME, 'UnitID', this.unitid).then((results) => {
          this.form = results[0];
          this.getTenants();
        });
      },
      getTenants() {
        this.tenants = [];
        dexie.retrieveByWhere(dexie.LEASE_STORE_NAME, { UnitID: this.unitid, isActive: 1 }).then((leases) => {
          for (const lease of leases) {
            dexie.retrieveByWhere(dexie.TENANT_STORE_NAME, { LeaseID: lease.ID }).then((tenants) => {
              for (const tenant of tenants) {
                this.tenants.push(tenant);
              }
            });
          }
        });
      },
    },
    mounted() {
      if (this.unitid) {
        this.getUnit();
      }
    },
    watch: {
      unitid: {
        handler() {
          this.getUnit();
        },
      },
    },
  };
</script>