import Vue from 'vue';
import router from './router';
import Store from './vuex';
import App from './App';
import 'babel-polyfill';
import './assets/css/content.css';
import ax from './api/index';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ax);
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$Platform = require('./assets/platform/tvShow/js/base');
/* eslint-disable no-new */
new Vue({
    router,
    store: Store,
    el: '#app',
    render: (h) => h(App),
});
