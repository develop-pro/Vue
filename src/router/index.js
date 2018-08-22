import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import VueRouter from 'vue-router';
import Login from '@/components/Login';
import Signup from '@/components/Signup';
import Dash from '@/Dash';
import Dashboard from '@/components/Dash';
import TransAll from '@/components/TransAll';
import Unit from '@/components/Unit';
import TransEdit from '@/components/TransEdit';
// import UnitSummary from '@/components/UnitSummary';
import UnitSearch from '@/components/UnitSearch';
import UnitEdit from '@/components/UnitEdit';
import TaskAll from '@/components/TaskAll';
import TaskEdit from '@/components/TaskEdit';
import TaskNote from '@/components/TaskNote';
import DrawerContent from '@/components/DrawerContent';
import UnitAll from '@/components/UnitAll';
import UnitTasks from '@/components/UnitTasks';
import UnitHeader from '@/components/UnitHeader';
import SnackBar from '@/components/SnackBar';
import GoogleContact from '@/components/GoogleContact';
import Lease from '@/components/Lease';
import PersonEdit from '@/components/PersonEdit';
import CasaOrgEdit from '@/components/CasaOrgEdit';
import LeaseTrans from '@/components/LeaseTrans';
import Trans from '@/components/Trans';
import RentSummary from '@/components/RentSummary';
import MaintenanceSummary from '@/components/MaintenanceSummary';
import '../css/main.scss';
import '../css/settings.scss';

Vue.use(VueMaterial);
Vue.use(VueRouter);

Vue.config.productionTip = false;
// Vue.component('unit-summary', UnitSummary);
Vue.component('unit-search', UnitSearch);
Vue.component('google-contact', GoogleContact);
Vue.component('drawer-content', DrawerContent);
Vue.component('unit-list', UnitAll);
Vue.component('unit-tasks', UnitTasks);
Vue.component('unit-header', UnitHeader);
Vue.component('task-note', TaskNote);
Vue.component('snack-bar', SnackBar);
Vue.component('lease', Lease);
Vue.component('lease-trans', LeaseTrans);
Vue.component('trans', Trans);
Vue.component('rent-summary', RentSummary);
Vue.component('maintenance-summary', MaintenanceSummary);

export default new VueRouter({
  routes: [
    { path: '/', component: Login },
    { path: '/signup', component: Signup },
    { path: '/dash',
      component: Dash,
      children: [
        { path: '', component: Dashboard },
        { path: 'transAll', component: TransAll },
        { path: 'transEdit', component: TransEdit },
        { path: 'unit/:id', component: Unit },
        { path: 'unitEdit/:id', component: UnitEdit },
        { path: 'unitAdd', component: UnitEdit },
        { path: 'taskAll', component: TaskAll },
        { path: 'taskEdit/:taskid', component: TaskEdit },
        { path: 'taskAdd/:unitid', component: TaskEdit },
        { path: 'unitAll', component: UnitAll },
        { path: 'personEdit', component: PersonEdit },
        { path: 'casaorgEdit', component: CasaOrgEdit },
      ],
    },
  ],
  mode: 'history',
});
