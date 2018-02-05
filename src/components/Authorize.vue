<template>
  <div class="authorize">
    <h1>Authorize</h1>
    This file will list all the transactions.
    <p v-if="typeof error != 'undefined'">{{error}}<br />
      <a href="https://auth.monzo.com/?client_id=oauthclient_00009Sv14jlo3oKpWer8sr&redirect_uri=http://localhost:8080/authorize&response_type=code">
        Monzo
      </a>
    </p>
  </div>
</template>

<script>
import AccountsService from "@/services/AccountsService";

export default {
  name: "authorize",
  data() {
    return { error: "" };
  },
  beforeMount() {
    this.getTransactions();
  },
  methods: {
    async getTransactions() {
      try {
        let response = await AccountsService.authorizeUser(
          this.$route.query.code
        );
        this.$router.push("Account");
      } catch (error) {
        this.error = error.message;
      }
    }
  }
};
</script>
