<template>
  <div class="account">
    <h1>Account</h1>
    <p>Your Account Information</p>
    <p v-if="typeof error != 'undefined'">{{error}}<br />
    </p>
    <div v-if="balance != null" class="balance-container">
      <h3>Balance</h3>
      <div class="balance__current">
        <h4>Current Balance</h4>
        <p>{{formatAmount(balance.balance/100, balance.currency)}}</p>
      </div>
      <div class="budget">
        <div class="balance__remaining-budget">
          <h4>Remaining Budget</h4>
          <p>{{formatAmount(remainingBudget, balance.currency)}}</p>
        </div>
        <div class="balance__total-budget">
          <h4>Total Budget</h4>
          <p>{{formatAmount(totalBudget, balance.currency)}}</p>
        </div>
        <div class="balance__budget-percentage">
          <h4>Remaining Percentage</h4>
          <p>{{(remainingBudget / totalBudget * 100).toFixed(2)}}%</p>
        </div>
      </div>
    </div>

    <button v-on:click="sendMessage">Send Balance</button>

    <div v-if="hasTransactions()">
      <h3>Transactions</h3>
      <tabs class="transactions__month">
        <tab v-for="(value, propertyName) in transactions" :name="propertyName" :key="propertyName">
          <h4>{{propertyName}}</h4>
          <h5>Total: {{ formatAmount(calculateMonthTotal(propertyName), balance.currency)}}</h5>
          <div class="transaction" v-for="transaction in value">
            <div class="transaction__info">
              <p>
                <span class="transaction__info-category">{{ formatCategory(transaction.category) }}</span> -
                <span class="transaction__info-description">{{ transaction.description }}</span> <span class="transaction__info-amount"><b>{{ formatAmount(transaction.amount/100, transaction.currency) }}</b></span>
              </p>
            </div>
          </div>
        </tab>
      </tabs>
    </div>
    <div v-if="!hasTransactions()">
      <a :href="monzoClient" >
        Monzo
      </a>
    </div>
    <div class="account-settings">
      <h3>Settings</h3>
      <tabs>
        <tab name="Budget">
          <div>
            <p>Budget Settings</p>
            <label for="budget">£</label>
            <input type="text" name="budget" v-model="totalBudget" placeholder="Budget"><br/>
            <button v-on:click="saveBudget">Set Budget</button><br/>
          </div>
        </tab>
        <tab name="Notifications">
          <div>
            <p>Notification Settings</p>
            <button v-if="!notificationsStatus" v-on:click="setUpNotifications">Start Notifications</button>
            <button v-if="notificationsStatus" v-on:click="stopNotifications">Stop Notifications</button>
            <button v-on:click="getNotifications">Get Notifications</button><br/>
          </div>
        </tab>
      </tabs>
    </div>
  </div>
</template>

<script>
import TransactionsService from "@/services/TransactionsService";
import MessageService from "@/services/MessageService";
import FeedService from "@/services/FeedService";
import { formatAmount } from "@/services/CurrencyService";
import { getUid } from "@/services/AccountsService";
import {
  setBudget,
  fetchBudget,
  saveRemainingBudget,
  fetchRemainingBudget
} from "@/services/BudgetService";
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
      notificationsStatus: false,
      error: "",
      monzoClient: `https://auth.monzo.com/?client_id=${
        process.env.MONZO_CLIENT
      }&redirect_uri=${process.env.HOST}/authorize&response_type=code`
    };
  },
  async beforeMount() {
    await this.getBalance();
    await this.getBudget();
    await this.getTransactions();
    await this.getNotificationsStatus();
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
    async setUpNotifications() {
      await MessageService.setUpNotifications();
      this.getNotificationsStatus();
    },
    async getNotifications() {
      await MessageService.getNotifications();
    },
    async stopNotifications() {
      await MessageService.stopNotifications();
      this.getNotificationsStatus();
    },
    async getNotificationsStatus() {
      this.notificationsStatus = await MessageService.getNotificationsStatus();
    },
    calculateMonthTotal(month) {
      return (
        this.transactions[month]
          .map(transaction => {
            return transaction.amount;
          })
          .reduce((a, b) => {
            return a + b;
          }) / 100
      );
    },

    async calculateRemainingBudget() {
      const thisMonth = DateService.monthNumToName(new Date().getMonth());
      const spentThisMonth = this.calculateMonthTotal(thisMonth);
      const remainingBudget = parseInt(this.totalBudget) + spentThisMonth;
      const persistentRemainingBudget = await fetchRemainingBudget();
      if (persistentRemainingBudget !== remainingBudget) {
        saveRemainingBudget(remainingBudget);
      }
      this.remainingBudget = remainingBudget;
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
.tabs-component {
  margin: 0 auto;
  width: 70%;
}

.tabs-component-tabs {
  border: solid 1px #ddd;
  border-radius: 6px;
  list-style: none;
  margin-bottom: 5px;
  -webkit-padding-start: 0;
}

@media (min-width: 700px) {
  .tabs-component-tabs {
    border: 0;
    align-items: stretch;
    display: flex;
    justify-content: flex-start;
    margin-bottom: -1px;
  }
}

.tabs-component-tab {
  color: #999;
  font-size: 14px;
  font-weight: 600;
  margin-right: 0px !important;
}

.tabs-component-tab:not(:last-child) {
  border-bottom: dotted 1px #ddd;
}

.tabs-component-tab:hover {
  color: #666;
}

.tabs-component-tab.is-active {
  color: #000;
}

@media (min-width: 700px) {
  .tabs-component-tab {
    background-color: #fff;
    border: solid 1px #ddd;
    border-radius: 3px 3px 0 0;
    margin-right: 0.5em;
  }

  .tabs-component-tab.is-active {
    border-bottom: solid 1px #fff;
    text-decoration: underline;
    z-index: 2;
    transform: translateY(0);
  }
}

.tabs-component-tab-a {
  align-items: center;
  color: inherit;
  display: flex;
  padding: 0.75em 1em;
  text-decoration: none;
}

.tabs-component-panels {
  padding: 4em 0;
}

.transaction {
  border: 1px solid #eee;
}

.transaction__info {
  width: 101%;
  background: #fff;
  margin-left: -0.5%;
}

.transaction__info-amount {
  display: block;
}

@media (max-width: 400px) {
  .transaction__info p {
    padding: 5%;
  }
  .budget {
    flex-direction: column;
  }
}

.transaction:not(:last-child) {
  margin-bottom: 5px;
}

@media (min-width: 700px) {
  .tabs-component-panels {
    border-top-left-radius: 0;
    background-color: #fff;
    border: solid 1px #ddd;
    border-radius: 0 6px 6px 6px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    padding: 2em 2em;
  }
}
</style>
