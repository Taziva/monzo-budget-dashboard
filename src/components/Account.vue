<template>
  <div class="account">
    <h1>Account</h1>
    This file will list all the transactions.
    <p v-if="typeof error != 'undefined'">{{error}}<br />
    </p>
    <div class="balance-container">
      <h3>Balance</h3>
      <div v-if="balance != null" class="balance__current">
        <h4>Current Balance</h4>
        <p>{{formatAmount(balance.balance/100, balance.currency)}}</p>
      </div>
      <div class="budget">
        <div class="balance__remaining-budget">
          <h4>Remaining Budget</h4>
          <p>{{formatAmount(remainingBudget, "GBP")}}</p>
        </div>
        <div class="balance__total-budget">
          <h4>Total Budget</h4>
          <p>{{formatAmount(totalBudget, "GBP")}}</p>
        </div>
      </div>
    </div>

    <button v-on:click="sendMessage">Send Balance</button>
    <div v-if="hasTransactions()">
      <h3>Transactions</h3>
      <div class="transactions__month" v-for="(value, propertyName) in transactions">
        <h4>{{propertyName}}</h4>
        <div class="transactions" v-for="transaction in value">
          <p>
            <span>{{ formatCategory(transaction.category) }}</span> -
            <span>{{ transaction.description }}</span> - <span><b>{{ formatAmount(transaction.amount/100, transaction.currency) }}</b></span>
          </p>
        </div>
      </div>
    </div>
    <div v-if="!hasTransactions()">
      <a :href="monzoClient" >
        Monzo
      </a>
    </div>
    <div class="account-settings">
      <h3>Settings</h3>
      <div>
        <p>Total Budget</p>
        <label for="budget">£</label>
        <input type="text" name="budget" v-model="totalBudget" placeholder="Budget"><br/>
        <button v-on:click="saveBudget">Set Budget</button><br/>
      </div>
    </div>
  </div>
</template>

<script>
import TransactionsService from "@/services/TransactionsService";
import FeedService from "@/services/FeedService";
import { formatAmount } from "@/services/CurrencyService";
import { getUid } from "@/services/AccountsService";
import { setBudget, fetchBudget } from "@/services/BudgetService";
import { fetchBalance } from "@/services/BalanceService";
import DateService from "@/services/DateService";

export default {
  name: "account",
  data() {
    return {
      formatAmount,
      balance: null,
      remainingBudget: 0,
      totalBudget: 0,
      transactions: [],
      transactionsLoaded: false,
      error: "",
      monzoClient: `https://auth.monzo.com/?client_id=${
        process.env.MONZO_CLIENT
      }&redirect_uri=${process.env.HOST}/authorize&response_type=code`
    };
  },
  async beforeMount() {
    await this.getTransactions();
    await this.getBudget();
    await this.getBalance();
    this.calculateRemainingBudget();
  },
  methods: {
    async getTransactions() {
      const data = await TransactionsService.fetchTransactions();
      if (data.error) {
        this.error = data.error.message;
      }
      this.transactions = data;
      this.transactionsLoaded = true;
    },
    async sendMessage() {
      await FeedService.sendMessage("Your Balance Is:");
    },
    formatCategory(category) {
      return (
        category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ")
      );
    },
    hasTransactions() {
      return this.transactionsLoaded && this.transactions !== undefined
        ? true
        : false;
    },
    async saveBudget() {
      await setBudget(this.totalBudget);
    },
    async getBudget() {
      this.totalBudget = await fetchBudget();
    },
    async getBalance() {
      this.balance = await fetchBalance();
    },
    calculateRemainingBudget() {
      const thisMonth = DateService.monthNumToName(new Date().getMonth());
      const spentThisMonth =
        this.transactions[thisMonth]
          .map(transaction => {
            return transaction.amount;
          })
          .reduce((a, b) => {
            return a + b;
          }) / 100;
      this.remainingBudget = this.totalBudget + spentThisMonth;
    }
  }
};
</script>

<style media="screen">
.budget {
  display: flex;
  justify-content: center;
}
.budget :not(:last-child) {
  margin-right: 10px;
}
</style>
