// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import VueScroll from 'vue-infinite-scroll'
Vue.config.productionTip = false
Vue.use(VueScroll);
Vue.use(VueLazyload);
// or with options
Vue.use(VueLazyload, {
  loading: 'assets/loading-bars.svg'
});
/* eslint-disable no-new */
new Vue({
  //el: '#app',
  router,
  render: h => h(App)
}).$mount('#app');
