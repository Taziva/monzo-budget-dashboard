<template>
  <div class="authorize">
    <h1>Authorize</h1>
    This file will list all the transactions.
    <p v-if="typeof error != 'undefined'">{{error}}<br />
      <a :href="monzoClient" >
        Monzo
      </a>
    </p>
  </div>
</template>

<script>
import { authorizeUser } from "@/services/AccountsService";

export default {
  name: "authorize",
  data() {
    return {
      error: "",
      monzoClient: `https://auth.monzo.com/?client_id=${
        process.env.MONZO_CLIENT
      }&redirect_uri=${process.env.HOST}/authorize&response_type=code`
    };
  },
  beforeMount() {
    this.getTransactions();
  },
  methods: {
    async getTransactions() {
      try {
        let response = await authorizeUser(this.$route.query.code);
        this.$router.push("Account");
      } catch (error) {
        this.error = error.message;
      }
    }
  }
};
</script>
