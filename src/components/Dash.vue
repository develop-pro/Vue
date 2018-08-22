<template>
  <main class="main-content">
    <rent-summary @onPress="transAll" v-show="!state.loading"/>
    <maintenance-summary @onPress="taskAll" v-show="!state.loading" />
    <div class="loading">
      <md-progress-spinner md-mode="indeterminate" v-if="state.loading"></md-progress-spinner>
    </div>
  </main>
</template>
<script>
  export default {
    data() {
      return {
        showSearch: false,
        rentDue: 0,
      };
    },
    store: ['state'],
    methods: {
      hello() {
        this.$router.push('/hello/9');
      },
      transAll() {
        this.$router.push('/dash/transAll');
      },
      unitAll() {
        this.$router.push('/dash/unitAll');
      },
      taskAll() {
        this.$router.push('/dash/taskAll');
      },
      onSelectUnit(unitid) {
        this.$router.push(`/dash/unit/${unitid}`);
      },
      goBack() {
      },
    },
    mounted() {
    },
  };
</script>

<style type="text/css">
  .has-ripple {
    display: inline-block;
    position: relative;
  }
  .green {
    color: #33cc33;
  }
  .card-ripple {
    width: 300px;
    margin-top: 24px;
  }
  .loading {
    margin-top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
