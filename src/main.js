// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import {store} from './store'
import VueApitator from './apitator'
import FlagIcon from 'vue-flag-icon'
import Vuelidate from 'vuelidate'
var VueCookie = require('vue-cookie');

Vue.use(Vuelidate)
Vue.use(FlagIcon);
Vue.use(VueCookie);
Vue.use(Vuetify)
Vue.use(VueApitator, {
    rootUrl: process.env.API_ENDPOINT,
    graphQLUrl: process.env.API_ENDPOINT + "/graphql",
    params: {
        timeout: 190000
    }
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
