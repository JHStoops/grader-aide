<template>
  <nav class="navbar navbar-custom navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <router-link class="navbar-brand brandingNavHdr" to="/login" >Grader-Aide</router-link>
      </div>
      <div class="collapse navbar-collapse" id="navbar-collapse-1">
        <ul class="nav navbar-nav navbar-right">
          <li><router-link to="/login" tag="a">Login</router-link></li>
        </ul>
      </div>
      <div id="logout" @click="logout" class="nav-item clickable"></div>
    </div>
  </nav>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    methods: {
      logout: function(event) {
          document.getElementById('logout').innerText = '';
          localStorage.removeItem('token');
          localStorage.removeItem('ta');
          this.$router.push('login');
      },
      checkAuthToken: function() {
          if (localStorage.getItem('token')) {
              document.getElementById('logout').innerText = 'logout';
          } else {
              document.getElementById('logout').innerText = 'logout';
          }
      }
    },
    mounted: function(){
      this.checkAuthToken();
    }
  }
</script>

<style>

</style>
