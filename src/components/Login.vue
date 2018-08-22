<template>
  <div>
    <form novalidate class="md-layout md-alignment-center-center login-form" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          
          <div class="logo"><!--center me :)-->
            <img src="/static/img/icons/apple-touch-icon-120x120.png" style="grid-area: a;"></img>
          </div>
          
          
          <div class="md-title signin-title">Sign in</div>
          <div class="signup-link">or <md-button class="md-primary signup-btn" :disabled="sending" @click.native="signUp">create an account</md-button></div>
        </md-card-header>

        <md-card-content class="content">
          <g-signin-button
            :params="googleSignInParams"
            @success="onSignInSuccess"
            @error="onSignInError">
            Sign in with Google
          </g-signin-button>
          <div class="hr-label"><span class="hr-label__text">or</span></div>
          <md-field :class="getValidationClass('email')">
              <label for="email">Email</label>
              <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.email.required">email is required</span>
              <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
          </md-field>
          <md-field :class="getValidationClass('password')">
            <label for="password">Password</label>
            <md-input name="password" id="password" v-model="form.password" :disabled="sending" type="password" autocomplete="current-password"></md-input>
            <span class="md-error" v-if="!$v.form.password.required">password is required</span>
          </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Sign in</md-button>
        </md-card-actions>
      </md-card>
      <md-dialog-alert
      :md-active.sync="form.fail"
      md-content="Email or Password is incorrect!"
      md-confirm-text="OK" />
    </form>
  </div>
</template>
<style>
  .logo {
    display:grid;
    align-items:center;
  }
</style>
<script>
    import { validationMixin } from 'vuelidate';
    import {
      required,
      email,
    } from 'vuelidate/lib/validators';
    import GSignInButton from 'vue-google-signin-button';
    import Vue from 'vue';
    import dexie from '../services/dexie';
    import authService from '../services/auth';
    
    Vue.use(GSignInButton);
    export default {
      name: 'FormValidation',
      mixins: [validationMixin],
      data: () => ({
        form: {
          email: null,
          fail: false,
        },
        sending: false,
        googleSignInParams: {
          client_id: '905721551578-0latc7dopmbr7hr7qkku9h36tto157pd.apps.googleusercontent.com',
        },
      }),
      validations: {
        form: {
          email: {
            required,
            email,
          },
          password: {
            required,
          },
        },
      },
      mounted() {
        if (navigator.onLine) {
          dexie.isExist().then((res) => {
            if (res && localStorage.token && localStorage.user) {
              this.$router.push('/dash');
            } else {
              console.log(res);
            }
          })
            .catch(e => console.log(e));
        } else if (localStorage.token && localStorage.user) { // Offline login
          this.$router.push('/dash');
        } else {
          this.sending = false;
          alert('Unable to signin!');
        }
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
        clearForm() {
          this.$v.$reset();
          this.form.email = null;
        },
        login() {
          this.sending = true;
          dexie.createdb();
          if (navigator.onLine) {
            authService.login(this.form.email, this.form.password).then((response) => {
              const response1 = response.data;
              console.log(response1);
              if (response1.status) {
                localStorage.token = response1.token;
                localStorage.user = JSON.stringify(response1.user);
                this.$router.push('/dash');
              } else {
                this.form.fail = true;
              }
              this.sending = false;
            }).catch((e) => {
              console.log(e.response);
              if (e.response) {
                const status = e.response.status;
                if (status) {
                  this.form.fail = true;
                } else {
                  alert(e);
                }
              } else {
                alert(e);
              }
              this.sending = false;
            });
          } else if (localStorage.token && localStorage.user) { // Offline login
            this.$router.push('/dash');
          } else {
            this.sending = false;
            alert('Unable to signin!');
          }
        },
        signUp() {
          this.$router.push('/signup');
        },
        validateUser() {
          this.$v.$touch();
          if (!this.$v.$invalid) {
            this.login();
          }
        },
        onSignInSuccess(googleUser) {
          // `googleUser` is the GoogleUser object that represents the just-signed-in user.
          // See https://developers.google.com/identity/sign-in/web/reference#users
          console.log(googleUser);
          const profile = googleUser.getBasicProfile();// etc etc
          console.log(profile);
          this.sending = true;
          authService.googleSignin(googleUser.Zi.id_token).then((response) => {
            const response1 = response.data;
            if (response1.status) {
              localStorage.token = response1.token;
              localStorage.user = JSON.stringify(response1.user);
              this.$router.push('/dash');
            } else {
              this.form.fail = true;
            }
            this.sending = false;
          }).catch((e) => {
            console.log(e);
            alert('Unable to signin');
            this.sending = false;
          });
        },
        onSignInError(error) {
          // `error` contains any error occurred.
          console.log('OH NOES', error);
        },
      },
    };
</script>
<style>
    .login-form {
        height: 100vh;
    }
    .g-signin-button {
      /* This is where you control how the button looks. Be creative! */
      display: inline-block;
      padding: 4px 8px;
      border-radius: 3px;
      color: #fff;
      cursor: pointer;
      width: 100%;
      text-align: center;
      margin-bottom: 10px;
      background-image: url(../assets/google-logo-white-vfltwSoWq.svg);
      background-color: #4285f4;
      background-size: 16px 16px;
      background-repeat: no-repeat;
      background-position: left 10px center;
      border: 1px solid rgb(34, 101, 212);
      font-size: 14px;
    }
    .g-signin-button:before {
      content: '';
      position: absolute;
      left: 50px;
      margin-top: -4px;
      height: 30px;
      border-left: 1px solid rgba(0,0,0,0.1);
      border-color: #2265d4;
    }
    
    .hr-label {
      position: relative;
      margin-top: 20px;
      margin-bottom: 5px;
      text-align: center;
      clear: both;
      overflow: hidden;
    }
    .hr-label::before, .hr-label::after {
      content: '';
      position: relative;
      width: 50%;
      background-color: rgba(0,0,0,0.2);
      display: inline-block;
      height: 1px;
      vertical-align: middle;
    }
    .hr-label::before {
      right: 0.5em;
      margin-left: -50%;
    }
    .hr-label::after {
      left: 0.5em;
      margin-right: -50%;
    }
    .signup-link {
      float: right;
      line-height: 32px;
      margin: 8px;
    }
    .signin-title {
      width: 150px;
      float: left;
      font-size: 18px !important;
    }
    .content {
      margin-top: 50px;
    }
    .signup-btn {
      font-size: 0.7em;
    }
</style>