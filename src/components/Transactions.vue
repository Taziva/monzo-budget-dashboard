<template>
  <div class="transactions">
    <h1>Accounts</h1>
    This file will list all the transactions.
    <p v-if="typeof error != 'undefined'">{{error}}<br />

    </p>
    <button v-on:click="sendMessage">Send Balance</button>
    <div v-if="transactions.length > 0" v-for="transaction in transactions">
      <p>
        <span>{{ formatCategory(transaction.category) }}</span> -
        <span>{{ transaction.description }}</span> - <span><b>{{ formatAmount(transaction.amount, transaction.currency) }}</b></span>
      </p>
    </div>
    <div>
      <a :href="monzoClient" >
        Monzo
      </a>
    </div>
  </div>
</template>

<script>
import TransactionsService from "@/services/TransactionsService";
export default {
  name: "transactions",
  data() {
    return {
      transactions: [],
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
      console.log(this.$route.name);
      const { data } = await TransactionsService.fetchTransactions();
      if (data.error) {
        this.error = data.error.message;
      }
      this.transactions = data;
    },
    async sendMessage() {
      await TransactionsService.sendMessage();
    },
    formatCategory(category) {
      return (
        category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")
      );
    },
    formatAmount(amount, currency) {
      return (amount / 100).toLocaleString("en-GB", {
        style: "currency",
        currency: currency
      });
    }
  }
};
</script>
