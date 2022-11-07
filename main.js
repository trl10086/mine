import Vue from 'vue'
import App from './App'
import store from '@/store';
import uView from "uview-ui";
import notice from 'utils/notice.js'
Vue.prototype.$notice = notice;
Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.$BASE_URL_photo = 'https://cs.jczenergy.com/app.php?c=ImgUpLoad&a=imgUpLoad';
App.mpType = 'app'

let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);

const app = new Vue({
	store,
    ...App
})

// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径1
import httpInterceptor from '@/common/http.interceptor.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)

// http接口API集中管理引入部分
import httpApi from '@/common/http.api.js'
import httpApi2 from '@/common/http.api2.js'
Vue.use(httpApi, app)
Vue.use(httpApi2, app)

app.$mount()
