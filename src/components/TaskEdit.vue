<template>
    <div>
      <main class="main-content">
        
        <unit-search v-show="!(unitid>0 || $route.params.unitid>0)" @onSelectUnit="onSelectUnit" :placeholder="'choose a unit'" style="margin-top:50px;margin-left:80px;width:300px;"/><!-- v-show="$route.params.unitid==0"-->  

        <unit-header :unitid="unitid ? unitid : Number($route.params.unitid)" v-show="unitid>0 || $route.params.unitid>0" />
        
        <div style="margin-left:30px;">
          <form novalidate class="" @submit.prevent="validateForm" v-show="unitid || $route.params.unitid>0 || $route.params.taskid>0" style="margin:5px;" >
            <!--<br>-->
            <!--<div class="md-title" v-show="!showTaskInput"  @click="focusTaskInput" v-html="form.Task" />-->
            <!--<br>-->
            <!--<md-field :class="getValidationClass('Task')" v-show="showTaskInput">-->
            
            <md-field :class="getValidationClass('Task')" style="margin-top:20px;">
              <label>describe the maintenance request</label>
              <md-textarea v-model="form.Task" class="description-textarea" rows="2"></md-textarea>
              <span class="md-error" v-if="!$v.form.Task.required">add a description to save</span>
            </md-field>
            
            <md-field class="input-md-width" style="margin-left:0px;">
              <label for="movie">Status</label>
              <md-select v-model="form.StatusID" name="StatusID" id="StatusID" @md-opened="checkOpened()">
                <md-option value="1">Priority</md-option>
                <md-option value="2">Later</md-option>
                <md-option value="3">Complete</md-option>
              </md-select>
            </md-field>

            <md-button type="submit" class="md-raised md-primary" :disabled="checkValidate() || isFirstLoad"  style="margin-left:0px;">Save</md-button>
            <md-button  @click.native="remove" v-show="taskid" style="float:right">
              delete
            </md-button>
            
          </form>
          
          <md-dialog-confirm
            :md-active.sync="showConfirm"
            md-title="Deleting is this task permanent"
            md-content="Are you sure?"
            md-confirm-text="delete"
            md-cancel-text="cancel"
            @md-cancel="onCancel"
            @md-confirm="onConfirm"
          />
          
          <task-note :taskid="taskid" v-show="taskid>0" />
        </div>
      </main>
    </div>
</template>

<style>
  .md-textarea {
    overflow: hidden !important;
  }
  .description-textarea {
    min-height: 50px !important;
  }
</style>
<script>
  import { validationMixin } from 'vuelidate';
  import { required } from 'vuelidate/lib/validators';
  import taskService from '../services/task';
  import dexie from '../services/dexie';
  import store from '../services/store';
  
  export default {
    name: 'FormValidation',
    mixins: [validationMixin],
    store: ['state'],
    data: () => ({
      form: {
        Task: null,
        StatusID: 1,
      },
      tasks: [],
      unitid: 0,
      taskid: 0,
      sending: false,
      completeCount: 0,
      showSnackbar: false,
      showTaskInput: false,
      note: null,
      isFirstLoad: true,
      showConfirm: false,
    }),
    validations: {
      form: {
        Task: {
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
      checkOpened() {
        this.isFirstLoad = false;
      },
      checkValidate() {
        this.$v.$touch();
        if (this.$v.$invalid) {
          this.showTaskInput = true;
        }
        return this.$v.$invalid;
      },
      goBack() {
        this.$router.go(-1);
      },
      remove() {
        this.showConfirm = true;
      },
      onConfirm() {
        const task = {
          ID: this.taskid,
          Task: this.form.Task,
          UnitID: this.unitid,
          AssignedPersonID: this.form.AssignedPersonID,
          ReportingPersonID: this.form.ReportingPersonID,
          StatusID: Number(this.form.StatusID),
        };
        task.removed = true;
        dexie.putItem(dexie.TASK_STORE_NAME, task).then(() => {
          store.setTasks();
          this.$router.push('/dash/taskAll');
        });
        taskService.taskRemove(localStorage.token, this.taskid).then((res) => {
          console.log(res);
          dexie.removeItems(dexie.TASK_STORE_NAME, { ID: this.taskid }).then(() => {
            store.setTasks();
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
      onGetTaskStatusFromIDB(results) {
        if (results.length > 0) {
          this.form.StatusSort = results[0].sort;
          if (this.taskid) { // if update
            const data = {
              ID: this.taskid,
              Task: this.form.Task,
              UnitID: this.unitid,
              AssignedPersonID: this.form.AssignedPersonID,
              ReportingPersonID: this.form.ReportingPersonID,
              StatusID: Number(this.form.StatusID),
            };
            const saveData = Object.assign({}, data);
            saveData.StatusSort = this.form.StatusSort;
            saveData.CreatedTime = this.form.CreatedTime;
            dexie.putItem(dexie.TASK_STORE_NAME, saveData).then(() => {
              store.setTasks();
            });
            if (navigator.onLine) { // if online
              this.sending = true;
              taskService.taskPut(localStorage.token, data).then((response) => {
                console.log(response);
                this.sending = false;
              }).catch((e) => { // if save to server  failed then mark it modified
                this.sending = false;
                if (e.response.status === 401) {
                  this.sending = false;
                  saveData.added = true;
                  dexie.putItem(dexie.UNIT_STORE_NAME, saveData).then(() => {
                    store.setUnits();
                  });
                } else {
                  console.log(e);
                  data.modified = true;
                  dexie.putItem(dexie.TASK_STORE_NAME, saveData).then(() => {
                    store.setTasks();
                  });
                }
              });
            } else { // if offline then mark it to modified
              saveData.modified = true;
              this.state.showSnackbar = true;
              dexie.putItem(dexie.TASK_STORE_NAME, saveData).then(() => {
                store.setTasks();
              });
            }
          } else { // if add task
            console.log('Add Task');
            const taskid = Date.now();
            const data = {
              Task: this.form.Task,
              UnitID: this.unitid,
              StatusID: Number(this.form.StatusID),
            };
            const saveData = Object.assign({}, data);
            saveData.ID = taskid;
            saveData.StatusSort = this.form.StatusSort;
            saveData.CreatedTime = Date();
            dexie.putItem(dexie.TASK_STORE_NAME, saveData).then(() => {
              store.setTasks();
              this.$router.push('/dash/taskAll');
            });
            if (navigator.onLine) {
              this.sending = true;
              taskService.taskPost(localStorage.token, data).then((res) => {
                this.sending = false;
                let response = res.data[0][0];
                response = JSON.parse(response[Object.keys(response)[0]]);
                const tasks = response.Task;
                dexie.removeItems(dexie.TASK_STORE_NAME, { ID: taskid }).then(() => {
                  data.StatusSort = this.form.StatusSort;
                  dexie.putItem(dexie.TASK_STORE_NAME, tasks[0]).then(() => {
                    store.setTasks();
                  });
                });
              }).catch((e) => {
                saveData.added = true;
                dexie.putItem(dexie.TASK_STORE_NAME, saveData).then(() => {
                  store.setTasks();
                });
                this.sending = false;
                if (e.response.status === 401) {
                  store.signOut();
                } else {
                  console.log(e);
                }
              });
            } else { // if offline
              data.added = true;
              dexie.putItem(dexie.TASK_STORE_NAME, data).then(() => store.setTasks());
              this.state.showSnackbar = true;
            }
          }
        }
      },
      save() {
        this.isFirstLoad = true;
        dexie.filter(dexie.LOOKUP_STORE_NAME, 'Kind', 'taskStatus').then((results) => {
          const res = results.filter(item => item.ID === Number(this.form.StatusID));
          this.onGetTaskStatusFromIDB(res);
        });
      },
      onSelectUnit(unitid) {
        this.unitid = unitid;
        this.$router.push(`/dash/taskAdd/${unitid}`);
      },
      onSelectTask(taskid) {
        this.$router.push(`/dash/taskEdit/${taskid}`);
        this.getTask();
      },
      getTask() {
        this.taskid = Number(this.$route.params.taskid);
        if (!this.taskid) {
          this.isFirstLoad = false;
        }
        dexie.filter(dexie.TASK_STORE_NAME, 'ID', this.taskid).then((results) => {
          if (results.length > 0) {
            this.form.Task = results[0].Task;
            this.form.AssignedPersonID = results[0].AssignedPersonID;
            this.form.ReportingPersonID = results[0].ReportingPersonID;
            this.form.StatusID = results[0].StatusID;
            this.form.CreatedTime = results[0].CreatedTime;
            this.unitid = results[0].UnitID;
            setTimeout(() => {
              const textarea = document.querySelector('textarea');
              this.setCSS(textarea);
              this.showTaskInput = false;
            }, 200);
            dexie.filter(dexie.UNIT_STORE_NAME, 'UnitID', this.unitid).then(res => this.onGetUnitFromIDB(res));
          }
        });
      },
      onGetUnitFromIDB(results) {
        console.log('unit from idb = ', results);
        if (results.length > 0) {
          const data = results[0];
          this.form.Address1 = data.Address1;
          this.form.Address2 = data.Address2;
          this.form.City = data.City;
          this.form.State = data.State;
          // this.form.tasks = data.Tasks;
          this.form.tenants = data.Tenants;
          // this.form.tenants = JSON.parse(this.form.tenants);
          // this.form.tasks = JSON.parse(this.form.tasks);
          dexie.filter(dexie.TASK_STORE_NAME, 'UnitID', this.unitid).then(res => this.onGetTasksFromIDB(res));
        }
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
      setCSS(e) {
        const el = e;
        el.style.cssText = 'height:auto; padding:0';
        const scrollHeight = el.scrollHeight + 10;
        el.style.cssText = `height:${scrollHeight}px`;
      },
      autosize() {
        const textarea = document.querySelector('textarea');
        this.setCSS(textarea);
        this.isFirstLoad = false;
      },
      onblur() {
        this.showTaskInput = false;
      },
      focusTaskInput() {
        this.showTaskInput = true;
        // this.isFirstLoad = false;
        setTimeout(() => {
          const textarea = document.querySelector('textarea');
          if (textarea) {
            textarea.focus();
          }
        }, 200);
      },
    },
    mounted() {
      if (this.$route.params.unitid) {
        this.unitid = Number(this.$route.params.unitid);
        this.isFirstLoad = false;
        this.form.StatusID = this.state.selectedTaskStatusID;
      } else {
        this.getTask();
      }
      const textarea = document.querySelector('textarea');
      textarea.addEventListener('keydown', this.autosize);
      textarea.addEventListener('blur', this.onblur);
      this.focusTaskInput();
    },
    updated() {
      this.$nextTick(() => {
        // this.focusTaskInput();
      });
    },
  };
</script>
