import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import vueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'element-ui/lib/theme-chalk/index.css'
import store from './vuex'
import router from './routes'
import '@c/install.js'
import '@/common/js/permission'
import 'vue-directive-image-previewer/dist/assets/style.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/css/global.css'
import './styles/index.less'
import App from './App'
import axios from 'axios'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
  Options: {
    'inline': true,
    'button': true,
    'navbar': true,
    'title': true,
    'toolbar': true,
    'tooltip': true,
    'movable': true,
    'zoomable': true,
    'rotatable': true,
    'scalable': true,
    'transition': true,
    'fullscreen': true,
    'keyboard': true,
    'url': 'data-source'
  }
})

Vue.prototype.$axios = axios

Vue.use(vueDirectiveImagePreviewer)
Vue.use(ElementUI)


router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }

  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})


Vue.directive('preventReClick', {
  inserted(el, binding) {
    el.addEventListener('click', () => {

      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 5000)
      }
    })
  }
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

