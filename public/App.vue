<template>
  <div>
    <nav-bar></nav-bar>
    <router-view></router-view>
  </div>
</template>

<script>
  import navbar from './components/navbar.vue';
  import login from './components/login.vue';

  export default {
    components: {
      'nav-bar': navbar,
      'login': login
    },
    data () {
      return {

      }
    }
  }
</script>

<style>

</style>
