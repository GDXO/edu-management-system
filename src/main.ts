import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

// 添加 element-ui
import './assets/element'

// 添加全局样式
import './styles/index.scss'
import '@wangeditor/editor/dist/css/style.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
