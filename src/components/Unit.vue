<template>
    <div>
      <unit-header :unitid="unitid" />
      <rent-summary :unitid="unitid" v-if="this.unit.RentDue" />
      <unit-tasks :unitid="unitid" @onSelectTask="onSelectTask"/>
      <trans :transid="state.selectedTransID" :unitid="unitid" :activeLeaseID="activeLeaseID" />
      <lease-trans :unitid="unitid" />
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
    store: ['state'],
    props: {
    },
    data: () => ({
      unit: {
      },
      tasks: [],
      sending: false,
      unitid: 0,
      activeLeaseID: 0,
    }),
    mounted() {
      this.unitid = Number(this.$route.params.id);
      if (this.unitid) {
        dexie.filter(dexie.UNIT_STORE_NAME, 'UnitID', this.unitid).then((results) => {
          this.unit = results[0];
        });
        dexie.filter(dexie.LEASE_STORE_NAME, 'UnitID', this.unitid).then((results) => {
          if (results.length > 0) {
            this.activeLeaseID = results[0].ID;
          }
        });
      }
    },
    methods: {
      unitEdit() {
        this.$router.push(`/dash/unitEdit/${this.unitid}`);
      },
      gotoTaskEdit() {
        this.$router.push(`/dash/taskEdit/${this.unitid}/0`);
      },
      onSelectTask(taskid) {
        // this.$emit('onSelectTask', taskid);
        this.$router.push(`/dash/taskEdit/${taskid}`);
      },
    },
    watch: {
      unitid: {
        handler() {
        },
      },
      $route(to, from) {
        console.log(from);
        console.log(to);
        this.unitid = Number(to.params.id);
      },
    },
  };
</script>