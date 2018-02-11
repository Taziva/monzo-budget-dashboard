<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>An Idealisme Sombre Project</h2>
    <p>Check Your Account Below:</p>
    <ul>
      <li>
        <a
          href="/account"
        >
          Account
        </a>
      </li><br />
      <li>
        <button v-on:click="logout" name="logout">Log Out</button>
      </li>
    </ul>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "home",
  data() {
    return {
      msg: "Welcome to the Monzo Budget Dashboard"
    };
  },

  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("login");
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
