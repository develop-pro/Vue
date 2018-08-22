// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueStash from 'vue-stash';
import App from './App';
import router from './router';
import store from './services/store';

Vue.config.productionTip = false;
Vue.use(VueStash);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: { store },
});
