<template lang="html">
  <div class="login">
    <h3>Sign Up</h3>
    <input type="email" name="email" v-model="email" placeholder="Email"><br/>
    <input type="password" name="password" v-model="password" placeholder="Password"><br/>
    <button v-on:click="signUp">Connection</button>
    <span>Or <router-link :to="{ name: 'Login', params: {} }">Log In</router-link></span>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "signUp",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    signUp: function() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert("New User Alert");
        })
        .catch(error => {
          alert(error.message);
        });
    }
  }
};
</script>

<style lang="css" scoped>
 .login {
   margin-top: 40px
 }
 input {
   margin: 10px 0;
   width: 20%;
   padding: 15px;
 }
 button{
   margin-top: 10px;
   width: 10%;
   cursor: pointer;
 }
 span {
   display: block;
   margin-top: 20px;
   font-size: 11px;
 }
</style>
