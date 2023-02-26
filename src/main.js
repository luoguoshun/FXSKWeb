// with polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/';
import i18n from './locales';
import { VueAxios } from './utils/request';
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout';
import themePluginConfig from '../config/themePluginConfig';
// import Print2 from '@/utils/print'
import bootstrap from './core/bootstrap';
import './core/lazy_use'; // use lazy load components
import './permission'; // permission control
import './utils/filter'; // global filter
import './global.less'; // global styleimport moment from 'moment';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Print from 'vue-print-nb'; // 打印二维码
import globalVariable from '@/api/global_variable';
import 'k-form-design/lib/k-form-design.css';
import JsonViewer from 'vue-json-viewer';
// import './common/stylus/index.styl'
import elementUI from 'element-ui';
Vue.use(elementUI);
Vue.use(JsonViewer);
// Vue.use(KFormDesign)
Vue.prototype.GLOBAL = globalVariable;
Vue.use(Print);
moment.locale('zh-cn');
Vue.config.productionTip = false;
Vue.use(VueAxios);
Vue.component('pro-layout', ProLayout);
Vue.component('page-container', PageHeaderWrapper);
Vue.component('page-header-wrapper', PageHeaderWrapper);
window.umi_plugin_ant_themeVar = themePluginConfig.theme;

var vueThis = new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex
  created: bootstrap,
  render: (h) => h(App),
}).$mount('#app');
export default vueThis;
