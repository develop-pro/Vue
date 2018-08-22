<template>
    <div>
      
       <form novalidate class="" @submit.prevent="validateForm" >

          <div class="md-title" style="margin-left:8px;">
              activity
           </div>

          <!--<md-progress-bar md-mode="indeterminate" v-if="sending" />-->

          <md-list class="md-double-line" v-show="state.taskNotes.length > 0">
            <div v-for="note in state.taskNotes" :key="note.ID" >
              
              <md-list-item @click="showNoteInput(note)" :class="getItemClass(note)">
                <div class="md-list-item-text">
                  <div class="md-body-2" v-show="!note.showNoteInput">{{note.ModUser}}</div>
                  
                    <div v-html="note.Note" v-show="!note.showNoteInput"  class="note" />
                    
                    <md-field v-show="note.showNoteInput" :id="note.NoteID">
                      <label>leave a comment</label>
                      <md-textarea v-model="note.Note" class="comment-textarea" v-on:blur="updateNote(note)" v-on:focus="onFocusTextArea(note)"></md-textarea>
                    </md-field>    
                  
                  <div class="md-body-2" v-show="!note.showNoteInput">{{note.ModTime}}  <span @click="showNoteInput(note)" style="text-decoration:underline;" v-show="note.ModUid === state.user.UserID">edit</span>
                  </div>
                  <md-divider></md-divider>
                </div>
              </md-list-item>
            </div>
          </md-list>
          
          <md-field class="md-elevation-3" style="margin-bottom:10px;">
            <label>leave a comment</label>
            <md-textarea v-model="note" class="comment-textarea" rows="2" id="comment"></md-textarea>
            <span class="md-error" v-if="!$v.note.required">add a note to save</span>
          </md-field>      
          
          <md-button type="submit" class="md-raised md-primary" :disabled="checkValidate()">Save</md-button>

      </form>
    </div>
</template>

<style>
  .md-textarea {
    overflow: hidden !important;
  }
  .note {
    min-height: 50px;
    padding-top:10px;
  }
  .comment-textarea {
    min-height: 50px !important;
  }
  .normal-item button{
    cursor: initial !important;
  }
  .normal-item button:hover {
    background: none !important;
  }
</style>
<script>
  import { validationMixin } from 'vuelidate';
  import { required } from 'vuelidate/lib/validators';
  import taskService from '../services/task';
  import dexie from '../services/dexie';
  import store from '../services/store';
  
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 32 && e.target === document.body) {
      e.preventDefault();
    }
  });
  
  export default {
    props: {
      taskid: {
        type: Number,
        default: 0,
      },
    },
    name: 'FormValidation',
    mixins: [validationMixin],
    store: ['state'],
    data: () => ({
      note: null,
      task: null,
      sending: false,
      notes: [],
      showSnackbar: false,
    }),
    validations: {
      note: {
        required,
      },
    },
    methods: {
      getValidationClass(fieldName) {
        const field = this.$v[fieldName];

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
      getItemClass(note) {
        if (!note.showNoteInput) {
          if (note.ModUid !== this.state.user.UserID) {
            return 'normal-item';
          }
        }
        return '';
      },
      showNoteInput(note) {
        if (!note.showNoteInput) {
          if (note.ModUid === this.state.user.UserID) {
            const notes = this.state.taskNotes;
            const index = notes.indexOf(note);
            const tmp = Object.assign({}, note);
            tmp.showNoteInput = true;
            this.state.taskNotes.splice(index, 1, tmp);
            setTimeout(() => {
              const element = document.getElementById(note.NoteID);
              const textarea = element.querySelector('textarea');
              textarea.focus();
            }, 200);
          }
        }
      },
      save() {
        const user = this.state.user;
        const data = {
          Note: this.note,
          TaskID: this.taskid,
        };
        const saveData = Object.assign({}, data);
        const noteID = Date.now();
        saveData.NoteID = noteID;
        saveData.ModTime = Date();
        saveData.ModUser = `${user.FirstName} ${user.LastName}`;
        if (navigator.onLine) {
          this.sending = true;
          dexie.putItem(dexie.TASK_NOTES_STORE_NAME, saveData).then(() => {
            store.setTaskNotes();
            this.note = '';
          });
          taskService.taskNotePost(localStorage.token, data).then((response) => {
            console.log(response);
            let res = response.data[0][0];
            res = JSON.parse(res[Object.keys(res)[0]]);
            const notes = res.TaskNote;
            dexie.removeItems(dexie.TASK_NOTES_STORE_NAME, { NoteID: noteID }).then(() => {
              dexie.putItem(dexie.TASK_NOTES_STORE_NAME, notes[0]).then(() => {
                store.setTaskNotes();
                this.note = '';
              });
            });
          }).catch((e) => {
            if (e.response.status === 401) {
              store.signOut();
            } else {
              saveData.added = true;
              dexie.putItem(dexie.TASK_NOTES_STORE_NAME, saveData).then(() => {
                store.setTaskNotes();
                this.note = '';
              });
              console.log(e);
            }
          });
        } else {
          data.NoteID = Date.now();
          data.added = true;
          data.ModTime = Date();
          data.ModUser = `${user.FirstName} ${user.LastName}`;
          dexie.putItem(dexie.TASK_NOTES_STORE_NAME, data).then(() => {
            store.setTaskNotes();
            this.note = '';
            this.state.showSnackbar = true;
          });
        }
      },
      goBack() {
      },
      setCSS(e) {
        const el = e;
        el.style.cssText = 'height:auto; padding:0';
        const scrollHeight = el.scrollHeight + 10;
        el.style.cssText = `height:${scrollHeight}px`;
      },
      updateNote(note) {
        const tmp = Object.assign({}, note);
        tmp.showNoteInput = false;
        const notes = this.state.taskNotes;
        const index = notes.indexOf(note);
        this.state.taskNotes.splice(index, 1, tmp);
        if (navigator.onLine) {
          taskService.taskNotePut(localStorage.token, { noteID: Number(tmp.NoteID), Note: tmp.Note }).then((response) => {
            console.log(response);
            let res = response.data[0][0];
            res = JSON.parse(res[Object.keys(res)[0]]);
            dexie.putItem(dexie.TASK_NOTES_STORE_NAME, res.TaskNote[0]).then(() => {
              store.setTaskNotes();
            });
          }).catch((e) => {
            if (e.response.status === 401) {
              store.signOut();
            } else {
              tmp.modified = true;
              dexie.putItem(dexie.TASK_NOTES_STORE_NAME, note).then(() => {
                store.setTaskNotes();
              });
              console.log(e);
            }
          });
        } else {
          tmp.modified = true;
          dexie.putItem(dexie.TASK_NOTES_STORE_NAME, note).then(() => {
            store.setTaskNotes();
            this.state.showSnackbar = true;
          });
        }
      },
      onFocusTextArea(note) {
        const element = document.getElementById(note.NoteID);
        const textarea = element.querySelector('textarea');
        textarea.addEventListener('keydown', () => {
          this.setCSS(textarea);
        });
        textarea.value = textarea.value.replace(/<br\s*[/]?>/gi, '\n');
        this.setCSS(textarea);
      },
    },
    mounted() {
      const textarea = document.getElementById('comment');
      textarea.addEventListener('keydown', () => {
        this.setCSS(textarea);
      });
    },
    watch: {
      taskid: {
        handler() {
          store.setSelectedTaskID(this.taskid);
          store.setTaskNotes();
        },
      },
    },
  };
</script>
