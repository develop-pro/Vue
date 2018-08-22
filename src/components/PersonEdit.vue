<template>
  <div>
    <main class="main-content">
      <md-card>
        <md-card-header class="md-title">
        </md-card-header>
        <md-card-content>
          <md-button @click.native="showCasaOrg">{{CasaOrgName}}</md-button>
          <md-field class="input-lg-width">
            <label>First Name</label>
            <md-input v-model="user.FirstName" autocomplete='firstName' v-on:blur="updateUser"></md-input>
          </md-field>
          <md-field class="input-lg-width">
            <label>Last Name</label>
            <md-input v-model="user.LastName" autocomplete='lastName' v-on:blur="updateUser"></md-input>
          </md-field>
          <md-field class="input-lg-width">
            <label>Email</label>
            <md-input v-model="user.LoginEmail" autocomplete='LoginEmail'></md-input>
          </md-field>
        </md-card-content>
        <md-card-actions md-alignment="space-between">
          <md-button @click.native="signout"><md-icon>directions_run</md-icon>signout</md-button>
        </md-card-actions>
      </md-card>
    </main>
  </div>
</template>
<script>
  import personService from '../services/person';
  import store from '../services/store';
  
  export default {
    data: () => ({
      user: {
        FirstName: null,
        LastName: null,
        LoginEmail: null,
      },
      CasaOrgName: null,
    }),
    store: ['state'],
    methods: {
      showCasaOrg() {
        this.$router.push('/dash/casaorgEdit');
      },
      updateUser() {
        personService.personPut(localStorage.token, {
          ID: this.user.UserID,
          FirstName: this.user.FirstName,
          LastName: this.user.LastName,
        }).then((res) => {
          console.log(res);
        }).catch((e) => {
          if (e.response.status === 401) {
            store.signOut();
          } else {
            console.log(e);
          }
        });
      },
      signout() {
        store.signOut();
      },
    },
    mounted() {
      setTimeout(() => {
        console.log(this.state.user);
        this.user = this.state.user;
        personService.personSelect(localStorage.token, this.user.UserID).then((res) => {
          let data = res.data[0][0];
          data = JSON.parse(data[Object.keys(data)[0]]);
          data = data.Person;
          this.CasaOrgName = data[0].CasaOrgName;
        }).catch((e) => {
          console.log(e);
          if (e.response.status === 401) {
            store.signOut();
          } else {
          }
        });
      }, 200);
    },
  };
</script>