import axios from "axios";
import request from "request-promise";
import { formatAmount } from "../services/CurrencyService";

export default class Monzo {
  static async getTransactions(accessToken, accountId) {
    try {
      const { data } = await axios.get("https://api.monzo.com/transactions", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          account_id: accountId
        }
      });
      return data;
    } catch (e) {
      throw e;
    }
  }

  static async getBalance(accessToken, accountId) {
    try {
      const data = await request.get({
        url: "https://api.monzo.com/balance",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        qs: { account_id: accountId },
        json: true
      });
      return data;
    } catch (e) {
      throw e;
    }
  }

  static async authorize(code) {
    try {
      const formData = {
        grant_type: "authorization_code",
        client_id: process.env.MONZO_CLIENT_ID,
        client_secret: process.env.MONZO_CLIENT_SECRET,
        redirect_uri: `${process.env.HOST}/authorize`,
        code
      };

      let account = await request.post({
        url: "https://api.monzo.com/oauth2/token",
        form: formData,
        json: true
      });

      let { accounts } = await request.get({
        uri: "https://api.monzo.com/accounts",
        headers: {
          Authorization: `Bearer ${account.access_token}`
        },
        body: {
          account_type: "uk_retail"
        },
        json: true
      });
      account.accountId = accounts[1].id;
      return account;
    } catch (e) {
      throw e;
    }
  }

  static async setUpNotifications(accountId, accessToken, uid) {
    try {
      const formData = {
        account_id: accountId,
        url: `https://izzy-monzo.herokuapp.com/api/webhooks/${uid}`
      };
      const data = await request.post({
        url: "https://api.monzo.com/webhooks",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        qs: { account_id: accountId },
        form: formData,
        json: true
      });
      return data;
    } catch (e) {
      throw e;
    }
  }

  static async getNotifications(accessToken, accountId) {
    try {
      let data = await request.get({
        uri: "https://api.monzo.com/webhooks",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        qs: { account_id: accountId },
        json: true
      });
      return data;
    } catch (e) {
      throw e;
    }
  }

  static async sendPercentage(accessToken, accountId, percentage) {
    try {
      const formData = {
        type: "basic",
        params: {
          title: "Budget Alert",
          image_url: "http://www.nyan.cat/cats/original.gif",
          background_color: "#FCF1EE",
          body_color: "#FCF1EE",
          title_color: "#333",
          body: `Your remaining budget is now ${percentage}%`
        }
      };
      await request.post({
        url: "https://api.monzo.com/feed",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        qs: { account_id: accountId },
        form: formData,
        json: true
      });
    } catch (e) {
      throw e;
    }
  }

  static async stopNotifications(accountId, accessToken, uid) {
    try {
      let { webhooks } = await request.get({
        uri: "https://api.monzo.com/webhooks",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        qs: { account_id: accountId },
        json: true
      });
      const userWebhooks = webhooks.filter(webhook => {
        webhook.url.endsWith(uid);
      });
      userWebhooks.forEach(async userWebhook => {
        await request.delete({
          uri: `https://api.monzo.com/webhooks/${userWebhook.id}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          json: true
        });
      });
    } catch (e) {
      throw e;
    }
  }

  static async sendBalance(accessToken, accountId, message) {
    try {
      const { balance, currency } = await request.get({
        url: "https://api.monzo.com/balance",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        qs: { account_id: accountId },
        json: true
      });
      const formData = {
        type: "basic",
        params: {
          title: "Budget Alert",
          image_url: "http://www.nyan.cat/cats/original.gif",
          background_color: "#FCF1EE",
          body_color: "#FCF1EE",
          title_color: "#333",
          body: `${message} ${formatAmount(balance / 100, currency)}`
        }
      };
      await request.post({
        url: "https://api.monzo.com/feed",
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        qs: { account_id: accountId },
        form: formData,
        json: true
      });
    } catch (e) {
      throw e;
    }
  }
}
