import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Axios from 'axios'


Vue.prototype.$http = Axios;
Vue.prototype.$apiUrl = 'http://localhost:8000/';
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
