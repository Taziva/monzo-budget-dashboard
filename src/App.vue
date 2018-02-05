<template>
  <div id="app">
    <ul id="nav">
      <li>
        <router-link :to="{ name: 'Home', params: {} }">Home</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Account', params: {} }">Account</router-link>
      </li>
    </ul>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#nav {
  padding: 0;
  display: flex;
  justify-content: flex-end;
}
#nav li {
  list-style: none;
  display: inline-block;
  margin: 0 10px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
