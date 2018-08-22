<template>
    <main class="main-content">
        
      <unit-summary :unitid="unitid" @onSelectTask="onSelectTask"></unit-summary>

      <md-card>

     </md-card>

  </main>
</template>

<script>
  export default {
    data: () => ({
      unitid: 0,
    }),
    mounted() {
      this.unitid = Number(this.$route.params.id);
    },
    methods: {
      newTrans() {
        this.$router.push('/newTrans');
      },
      onSelectTask(taskid) {
        this.$router.push(`/dash/taskEdit/${taskid}`);
      },
    },
    watch: {
      $route(to, from) {
        console.log(from);
        console.log(to);
        this.unitid = Number(to.params.id);
      },
    },
  };
</script>


