import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Routes from './routes.js';
import API from './plugins/API.js';
import BootstrapVue from 'bootstrap-vue';   //bundles BS4, popper, and jQuery
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './libs/register.css';
import './libs/main.css';

Vue.use(BootstrapVue);
Vue.use(API, 'http://34.217.91.158:8080');  //this.$apiCall(apiURI, method, data)
//Vue.use(API, 'http://localhost:80');  //this.$apiCall(apiURI, method, data)
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: Routes
});

new Vue({
  el: '#app',
  render: h => h(App),
  router: router
});


router.beforeEach((to, from, next) => {
    if(to.path != '/login' && to.path != '/registration') {
        if(tokenExists()) {
            // If they have a token, let them go where requested if they have the proper role
            // Even if they hack our client side validation though, the API validates their role as well
            if(checkRole()) {
                (to.path == '/grader') ? next() : next('grader');
            } else {
                (to.path == '/student') ? next() : next('student');
            }
        } else {
            next('login');
        }
    } else {
        next();
    }
});

function tokenExists() {
    return localStorage.getItem('token');
}

function checkRole() {
    return localStorage.getItem('ta') == 'true';
}
