<template>
  <div>
      <md-tabs class="md-card">
        <template slot="md-tab" slot-scope="{ tab }">
          {{ tab.label }} <i class="badge" v-if="tab.data.badge">({{ tab.data.badge }})</i>
        </template>
        <md-tab id="priority" md-label="Priority" :md-template-data="{ badge: state.tasks.priorities ? state.tasks.priorities.length : 0 }">
          <div v-show="state.tasks.priorities ? state.tasks.priorities.length==0 : state.tasks.priorities != null">
            <md-empty-state
              class="md-primary"
              md-icon="done"
              md-label="nothing in Priority"
              md-description="priority maintenance requests go here"
              >
              <!--  style="display:none" adding this prevent-->
            </md-empty-state>
          </div>
          <md-list class="md-double-line">
            <md-list-item v-for="task in state.tasks.priorities" :key="task.ID" class="list-item" @click="onSelectTask(task.ID)" md-ripple>
              <div class="md-list-item-text"><!--class="md-list-text-container"-->
                <div class="test" v-html="task.Task" />
                <div>
                    <span>created {{task.CreatedTime}} <span class="md-body-2">{{task.UnitAddress}}</span></span>
                </div>
              </div>
            </md-list-item>
            <md-list-item>
              <md-button @click.native="taskNew(1)">                
                add new task
              </md-button>
            </md-list-item>
          </md-list>
        </md-tab>
        <md-tab id="later" md-label="Later" :md-template-data="{ badge: state.tasks.laters ? state.tasks.laters.length : 0 }">
          <div v-show="state.tasks.laters ? state.tasks.laters.length==0 : state.tasks.laters != null">
            <md-empty-state
              class="md-primary"
              md-icon="done"
              md-label="nothing in Later"
              md-description="non-urgent maintenance requests go here">
            </md-empty-state>
          </div>
          <md-list class="md-double-line">
            <md-list-item v-for="task in state.tasks.laters" :key="task.ID" class="list-item" @click="onSelectTask(task.ID)" md-ripple>
              <div class="md-list-item-text">
                <div class="test" v-html="task.Task" />
                <div>
                    <span>created {{task.CreatedTime}} {{task.UnitAddress}}</span>
                </div>
              </div>
            </md-list-item>
            <md-list-item>
              <md-button @click.native="taskNew(2)">                
                add new task
              </md-button>
            </md-list-item>
          </md-list>
        </md-tab>
        <md-tab id="complete" md-label="Complete" :md-template-data="{ badge: state.tasks.completes ? state.tasks.completes.length : 0 }">
          <div v-show="state.tasks.completes ? state.tasks.completes.length==0 : state.tasks.completes != null">
            <md-empty-state
              class="md-primary"
              md-icon="done"
              md-label="nothing in Complete"
              md-description="completed maintenance requests go here">
            </md-empty-state>
          </div>
          <md-list class="md-double-line">
            <md-list-item v-for="task in state.tasks.completes" :key="task.ID" class="list-item" @click="onSelectTask(task.ID)" md-ripple>
              <div class="md-list-item-text">
                <div class="test" v-html="task.Task" />
                <div>
                    <span>created {{task.CreatedTime}} {{task.UnitAddress}}</span>
                </div>
              </div>
            </md-list-item>
            <md-list-item>
              <md-button @click.native="taskNew(3)">                
                add new task
              </md-button>
            </md-list-item>
          </md-list>
        </md-tab>
    </md-tabs>
   </div>
</template>
<style scoped>
  .md-tabs-content {
    height: auto !important;
  }
  .md-card {
    /*box-shadow: none !important;*/
  }
</style>
<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
      };
    },
    store: ['state'],
    methods: {
      unit() {
        this.$router.push('/unit');
      },
      newTrans() {
        this.$router.push('/dash/newTrans');
      },
      taskEdit() {
        this.$router.push('/dash/taskEdit/1');
      },
      taskNew(taskStatusID) {
        this.state.selectedTaskStatusID = taskStatusID;
        this.$router.push('/dash/taskAdd/0');
      },
      onSelectTask(taskid) {
        this.$router.push(`/dash/taskEdit/${taskid}`);
      },
    },
    mounted() {
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
