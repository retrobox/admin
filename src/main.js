import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import CreateUpdate from './components/CreateUpdate.vue'
import VueApitator from './apitator'
import FlagIcon from 'vue-flag-icon'
import Vuelidate from 'vuelidate'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import VueClipboard from 'vue-clipboard2'
import Moment from 'moment'
import VueCookie from 'vue-cookie'

Vue.use(VueClipboard)
Vue.use(Vuelidate)
Vue.use(FlagIcon)
Vue.use(VueCookie)
Vue.use(mavonEditor)
Vue.use(VueApitator, {
  rootUrl: process.env.VUE_APP_API_ENDPOINT,
  graphQLUrl: process.env.VUE_APP_API_ENDPOINT + '/graphql',
  params: {
    timeout: 190000
  }
})

Vue.config.productionTip = true

Vue.filter('flag', function (value) {
  let flag = ''
  switch (value) {
    case 'en':
      flag = 'gb'
      break

    default:
      flag = value
  }
  return flag
})
Vue.filter('fromNow', function (value) {
  return Moment(value).fromNow()
})
Vue.filter('subDate', function (value) {
  return value.substring(0, value.length - 3)
})

Vue.component('create-update', CreateUpdate)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
