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
    <h1>Monzo Budget Dashboard</h1>
    <router-view/>
    <footer class="footer">
      <div class="footer__copyright">
        &copy; Idealisme Sombre
      </div>
    </footer>
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
  margin-top: 30px;
}
.footer {
  margin: 30px;
  display: flex;
  justify-content: center;
}
.footer__copyright {
  flex: 0 0 70%;
  font-size: 15px;
}
a:visited {
  color: #42b983;
}
</style>
