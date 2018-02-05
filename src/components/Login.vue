<template lang="html">
  <div class="login">
    <h3>Sign In</h3>
    <input type="email" name="email" v-model="email" placeholder="Email"><br/>
    <input type="password" name="password" v-model="password" placeholder="Password"><br/>
    <button v-on:click="login">Connection</button>
    <p>You don't have an account? <router-link :to="{ name: 'Sign Up', params: {} }">Create one</router-link></p>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login: function() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            this.$router.replace("/");
          },
          err => {
            alert(`Oops, ${err.message}`);
          }
        );
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
