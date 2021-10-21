import Vue from 'vue'
import App from './App.vue'
import router from './router'
import jquery from 'jquery'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vmodal from 'vue-js-modal'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueAxios, axios)
Vue.use(jquery)
Vue.use(vmodal)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
