<template>
    <div>
      <md-card>
        <md-card-header class="md-title">
          Maintenance Requests
          <md-button class="md-dense" @click.native="gotoTaskAdd" style="float:right">add one</md-button>
        </md-card-header>
        <md-card-content>
          <div v-show="this.tasks ? this.tasks.length==0 : this.tasks!=null">
            <md-empty-state
              md-icon="check-box"
              md-label="No requests yet"
              md-description="maintenance request for this unit will show here"
              >
              <md-button class="md-primary md-raised" @click.native="gotoTaskAdd">add one</md-button>
            </md-empty-state>
          </div>
          <md-list class="md-double-line">
            <md-list-item v-for="task in this.tasks" :key="task.ID" @click="onSelectTask(task.ID)" class="list-item" md-ripple>
                <md-chip class="chip">{{task.Status}}</md-chip>
                <span class="md-list-item-text">{{task.Task}}</span>
            </md-list-item>
          </md-list>
        </md-card-content>
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
      },
      tasks: null,
    }),
    methods: {
      gotoTaskAdd() {
        this.$router.push(`/dash/taskAdd/${this.unitid}`);
      },
      onSelectTask(taskid) {
        this.$emit('onSelectTask', taskid);
      },
      onGetTasksFromIDB(results) {
        const tasks = results;
        console.log('tasks', tasks);
        dexie.retrieveByWhere(dexie.LOOKUP_STORE_NAME, { Kind: 'taskStatus' }).then((statusFromDatabase) => {
          console.log('status', statusFromDatabase);
          this.tasks = [];
          for (const task of tasks) {
            for (const status of statusFromDatabase) {
              if (task.StatusID === status.ID) {
                task.Status = status.status;
                this.tasks.push(task);
              }
            }
          }
          console.log(this.tasks);
        }).catch((e) => {
          console.log(e);
        });
      },
    },
    watch: {
      unitid: {
        handler() {
          dexie.retrieveTasks(dexie.TASK_STORE_NAME, { UnitID: this.unitid }).then(results => this.onGetTasksFromIDB(results));
        },
      },
    },
  };
</script>