// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import CreateUpdate from './components/CreateUpdate.vue'
import router from './router.js'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import {store} from './store'
import VueApitator from './apitator'
import FlagIcon from 'vue-flag-icon'
import Vuelidate from 'vuelidate'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import VueClipboard from 'vue-clipboard2'
var VueCookie = require('vue-cookie');

Vue.use(VueClipboard)
Vue.use(Vuelidate)
Vue.use(FlagIcon);
Vue.use(VueCookie);
Vue.use(Vuetify)
Vue.use(mavonEditor)
Vue.use(VueApitator, {
    rootUrl: process.env.API_ENDPOINT,
    graphQLUrl: process.env.API_ENDPOINT + "/graphql",
    params: {
        timeout: 190000
    }
});

Vue.config.productionTip = false

Vue.filter('flag', function (value) {
  var flag = ""
  switch (value) {
    case 'en':
      flag = 'gb'
      break;

    default:
      flag = value
  }
  return flag
})
Vue.component('create-update', CreateUpdate)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
