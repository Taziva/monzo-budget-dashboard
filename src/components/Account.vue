<template>
  <div class="account">
    <h1>Accounts</h1>
    This file will list all the transactions.
    <p v-if="typeof error != 'undefined'">{{error}}<br />

    </p>
    <button v-on:click="sendMessage">Send Balance</button>
    <div v-if="hasTransactions" v-for="transaction in transactions">
      <p>
        <span>{{ formatCategory(transaction.category) }}</span> -
        <span>{{ transaction.description }}</span> - <span><b>{{ formatAmount(transaction.amount, transaction.currency) }}</b></span>
      </p>
    </div>
    <div v-if="!hasTransactions">
      <a :href="monzoClient" >
        Monzo
      </a>
    </div>
  </div>
</template>

<script>
import TransactionsService from "@/services/TransactionsService";
import { formatAmount } from "@/services/CurrencyService";

export default {
  name: "account",
  data() {
    return {
      formatAmount,
      transactions: [],
      transactionsLoaded: false,
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
      const { data } = await TransactionsService.fetchTransactions();
      if (data.error) {
        this.error = data.error.message;
      }
      this.transactions = data;
      this.transactionsLoaded = true;
    },
    async sendMessage() {
      await TransactionsService.sendMessage("Your Balance Is:");
    },
    formatCategory(category) {
      return (
        category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")
      );
    },
    hasTransactions() {
      this.transactionsLoaded && this.transactions.length > 0 ? true : false;
    }
  }
};
</script>
