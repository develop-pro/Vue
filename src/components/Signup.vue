<template>
  <div>
    <form novalidate class="md-layout md-alignment-center-center signup-form" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100">
        <md-card-header>
          <div class="md-title signin-title">Create an account</div>
          <div class="signup-link">or <md-button class="md-primary signup-btn" :disabled="sending" @click.native="login">login</md-button></div>
        </md-card-header>

        <md-card-content>
            <md-field :class="getValidationClass('firstName')">
              <label for="firstName">First Name</label>
              <md-input name="firstName" id="firstName" v-model="form.firstName" :disabled="sending" type="text" autocomplete='given-name'></md-input>
              <span class="md-error" v-if="!$v.form.firstName.required">The first name is required</span>
            </md-field>
            <md-field :class="getValidationClass('lastName')">
              <label for="lastName">Last Name</label>
              <md-input name="lastName" id="lastName" v-model="form.lastName" :disabled="sending" type="text" autocomplete='family-name'></md-input>
              <span class="md-error" v-if="!$v.form.lastName.required">The last name is required</span>
            </md-field>
            <md-field :class="getValidationClass('email')">
                <label for="email">Email</label>
                <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" :disabled="sending" />
                <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
                <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
            </md-field>
            <md-field :class="getValidationClass('password')">
              <label for="password">Password</label>
              <md-input name="password" id="password" v-model="form.password" :disabled="sending" type="password" autocomplete="current-password"></md-input>
              <span class="md-error" v-if="!$v.form.password.required">The password is required</span>
            </md-field>
        </md-card-content>

        <md-progress-bar md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Create an account</md-button>
        </md-card-actions>
      </md-card>
      <md-dialog-alert
      :md-active.sync="form.fail"
      md-content="Email exist!!!"
      md-confirm-text="OK" />
    </form>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate';
  import {
    required,
    email,
  } from 'vuelidate/lib/validators';
  import authService from '../services/auth';
  
  export default {
    name: 'FormValidation',
    mixins: [validationMixin],
    data: () => ({
      form: {
        email: null,
        password: null,
        firstName: null,
        lastName: null,
        fail: false,
        mismatch: false,
      },
      sending: false,
    }),
    validations: {
      form: {
        email: {
          required,
          email,
        },
        firstName: {
          required,
        },
        lastName: {
          required,
        },
        password: {
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
      clearForm() {
        this.$v.$reset();
        this.form.email = null;
      },
      login() {
        this.$router.push('/');
      },
      signUp() {
        this.sending = true;
        authService.signUp(this.form.email, this.form.firstName, this.form.lastName, this.form.password).then((response) => {
          console.log(response);
          const response1 = response.data;
          if (Array.isArray(response1)) {
            if (response1[0][0].LoginEmail) {
              this.form.fail = true;
            } else {
              this.$router.push('/');
            }
          } else {
            this.form.fail = true;
          }
          this.sending = false;
        }).catch((e) => {
          this.sending = false;
          alert(e);
        });
      },
      validateUser() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
          this.signUp();
        }
      },
    },
  };
</script>
<style>
    .signup-form {
      height: 100vh;
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