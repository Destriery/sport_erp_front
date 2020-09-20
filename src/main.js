import Vue from 'vue'

import ElementUI from 'element-ui'
import lang from 'element-ui/lib/locale/lang/ru-RU'
import locale from 'element-ui/lib/locale'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

locale.use(lang)
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
