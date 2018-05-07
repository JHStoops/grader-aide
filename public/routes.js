import login from './components/login.vue';
import grader from './components/grader.vue';
import student from './components/student.vue';
import registration from './components/registration.vue';

export default [
  {path: '/', component: login},
  {path: '/login', component: login},
  {path: '/grader', component: grader},
  {path: '/student', component: student},
  {path: '/registration', component: registration},

  {path: '/*', component: login}
];
