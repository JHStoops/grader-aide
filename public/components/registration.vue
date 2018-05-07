<template>
  <div class="centered">
    <div class="container">
      <div class="row">
        <div class="col-sm-1 col-md-3">
        </div>
        <div class="col-sm-10 col-md-6 text-center">
          <div v-if="errors.length" style="color: #e24343; padding-bottom: 5px;">
            <ul>
              <li style="list-style-type: none; font-size: 22px;"><b>Errors:</b></li>
              <li style="list-style-type: none;" v-for="error in errors">- {{error}}</li>
            </ul>
          </div>
          <div class="mainDiv">
            <div class="sumXtraPadding">
              <h2 class="accountHdr">Create Account</h2>
              <hr class="line">
              <div class="form-row">
                  <div class="form-group col-md-6">
                    <input type="text" class="form-control textInput" @keyup.enter="register"
                           v-model="first" id="firstname" placeholder="First Name">
                  </div>
                  <div class="form-group col-md-6">
                    <input type="text" class="form-control textInput" @keyup.enter="register"
                           v-model="last" id="lastname" placeholder="Last Name">
                  </div>
              </div>
              <div class="form-group">
                <input type="text" class="form-control textInput" @keyup.enter="register"
                       v-model="username" id="username" placeholder="User Name">
              </div>
              <div class="form-group">
                <input type="password" class="form-control textInput" @keyup.enter="register"
                       v-model="password" id="password" placeholder="Password">
              </div>
              <div class="form-group">
                <input type="password" class="form-control textInput" @keyup.enter="register"
                       v-model="cpassword" id="cpassword" placeholder="Confirm Password">
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input style="height: 15px;" type="checkbox" class="form-check-input" id="graderCheck" v-model="grader">
                  <label style="padding-left: 20px;" class="form-check-label" for="graderCheck">Grader</label>
                </div>
              </div>
              <!--<router-link to="/login">-->
                <button class="btn btn-primary create-btn" @click="register">Create</button>
              <!--</router-link>-->
              <div class="form-group col-md-12">
                <router-link class="alreadyLink" to="/login">I already have an account</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-1 col-md-3">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                first: null,
                last: null,
                username: null,
                password: null,
                cpassword: null,
                grader: false,
                errors:[]
            }
        },
        methods: {
            register: function(event) {
                this.validateFields();
                if (this.errors.length == 0) {
                    let self = this;
                    const creds = {
                        'first': this.first,
                        'last': this.last,
                        'username': this.username,
                        'password' : this.password,
                        'grader': this.grader
                    };
                    this.$apiCall('/api/v1/authenticate/register', 'POST', creds)
                        .then(function(res){ return res.json() })
                        .then(function(response){
                            if (response.token != undefined) {
                                localStorage.setItem('token', response.token); // write
                                self.$router.push('login');
                            } else {
                                self.errors.push('Error creating account');
                                for (let i = 0; i < response.errors.length; i++) {
                                  self.errors.push(response.errors[i]);
                                }
                            }
                        })
                        .catch(function(error){
                            self.errors.push('Error creating account');
                            self.errors.push(error);
                            console.log(error)
                        })
                }
            },
            validateFields: function() {
                this.errors = [];
                if (!this.first) this.errors.push("First name required");
                if (!this.last) this.errors.push("Last name required");
                if (!this.username) this.errors.push("Username required");
                if (!this.password) this.errors.push("Password required");
                if (!this.cpassword) this.errors.push("Confirm password required");
                if (this.password != this.cpassword) this.errors.push("Passwords must match");
            }
        }
    }
</script>

<style>

</style>
