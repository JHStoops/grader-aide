<template>
  <div class="centered" @>
    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-6 text-center logoTitle">
          <div style="color: white; font-size: 68px;">Grader-Aide
          </div>
        </div>
        <div class="col-sm-12 col-md-6">
          <div style="padding: 50px;">
            <div style="color: #f92828; padding-bottom: 5px;">{{errorMsg}}</div>
            <div class="form-group">
              <input type="text" class="form-control textInputLogin" @keyup.enter="login" v-model="username" id="username" placeholder="User Name">
            </div>
            <div class="form-group">
              <input type="password" class="form-control textInputLogin" @keyup.enter="login" v-model="password" id="password" placeholder="Password">
            </div>
            <!--<router-link to="/grader">-->
              <button class="btn btn-primary login-btn"  id="login-button" @click="login">Login</button>
            <!--</router-link>-->
            <a style="visibility: hidden;" href="/grader" id="loginRedirectPath"></a>
            <div class="form-group">
              <router-link to="/registration">Create New Account</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        username: null,
        password: null,
        errorMsg: ""
      }
    },
    methods: {
        login: function(event) {
            this.errorMsg = '';
            let self = this;

            const creds = {'username': this.username, 'password' : this.password};
            this.$apiCall('/api/v1/authenticate', 'POST', creds)
                .then(function(res){ return res.json() })
                .then(function(response){
                    if (response.token != undefined) {
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('ta', response.ta);
                        document.getElementById('logout').innerText = response.name;
                        self.$router.push('grader');
                    } else {
                        self.errorMsg = 'Invalid username or password';
                    }
                })
                .catch(function(error){
                    self.errorMsg = 'Invalid username or password';
                    console.log(error)
                })
        }
    }
  }
</script>

<style>

</style>
