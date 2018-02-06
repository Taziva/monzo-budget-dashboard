// const axios = require("axios");
// const request = require("request-promise")
// const express = require("express");
// const bodyParser = require("body-parser");
// const morgan = require("morgan");
// const admin = require("firebase-admin");
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import admin from "firebase-admin";
import request from "request-promise";
import axios from "axios";
import {
  getAccountInfo,
  saveAccountInfo,
  saveTotalBudgetInfo,
  getBudgetInfo
} from "./src/services/Database";
import { formatAmount } from "./src/services/CurrencyService";
require("dotenv").config();

const serviceAccount = {
  type: process.env.ADMIN_TYPE,
  project_id: process.env.ADMIN_PROJECT_ID,
  private_key_id: process.env.ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.ADMIN_CLIENT_EMAIL,
  client_id: process.env.ADMIN_CLIENT_ID,
  auth_uri: process.env.ADMIN_AUTH_URI,
  token_uri: process.env.ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.ADMIN_AUTH_PROVIDER,
  client_x509_cert_url: process.env.ADMIN_CLIENT
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://monzo-api.firebaseio.com"
});

const app = express();
const port = process.env.PORT || 8081;
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/dist`));

app.get("/api/transactions", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await admin
      .auth()
      .verifyIdToken(auth)
      .then(decodedToken => {
        return decodedToken.uid;
      });
    const { accessToken, accountId } = await getAccountInfo(uid);
    let { data } = await axios.get("https://api.monzo.com/transactions", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        account_id: accountId
      }
    });
    res.send(data.transactions);
  } catch (error) {
    res.send({ error: error.response.data });
  }
});

app.post("/api/feed/new", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await admin
      .auth()
      .verifyIdToken(auth)
      .then(decodedToken => {
        return decodedToken.uid;
      });
    const { accessToken, accountId } = await getAccountInfo(uid);
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
        body: `${req.body.message} ${formatAmount(balance, currency)}`
      }
    };
    let data = await request.post({
      url: "https://api.monzo.com/feed",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      qs: { account_id: accountId },
      form: formData,
      json: true
    });
    res.send("OK");
  } catch (error) {
    res.status(422).send(error.message);
  }
});
app.get("/api/balance", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await admin
      .auth()
      .verifyIdToken(auth)
      .then(decodedToken => {
        return decodedToken.uid;
      });
    const { accessToken, accountId } = await getAccountInfo(uid);
    const balance = await request.get({
      url: "https://api.monzo.com/balance",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      qs: { account_id: accountId },
      json: true
    });
    res.send(balance);
  } catch (error) {
    res.status(422).send(error.message);
  }
});

app.get("/api/authorize", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await admin
      .auth()
      .verifyIdToken(auth)
      .then(decodedToken => {
        return decodedToken.uid;
      });
    const formData = {
      grant_type: "authorization_code",
      client_id: process.env.MONZO_CLIENT_ID,
      client_secret: process.env.MONZO_CLIENT_SECRET,
      redirect_uri: "http://localhost:8080/authorize",
      code: req.query.code
    };

    let data = await request.post({
      url: "https://api.monzo.com/oauth2/token",
      form: formData,
      json: true
    });
    let account = await request.get({
      uri: "https://api.monzo.com/accounts",
      headers: {
        Authorization: `Bearer ${data.access_token}`
      },
      body: {
        account_type: "uk_retail"
      },
      json: true
    });

    data.accountId = account.accounts[1].id;
    await saveAccountInfo(data, uid);
    res.send("Ok");
  } catch (error) {
    res.status(422).send(error.message);
  }
});

app.post("/api/budget/new", async (req, res) => {
  try {
    const totalBudget = req.body.totalBudget;
    let auth = req.get("authorization");
    let uid = await admin
      .auth()
      .verifyIdToken(auth)
      .then(decodedToken => {
        return decodedToken.uid;
      });

    await saveTotalBudgetInfo(totalBudget, uid);
    res.send("Ok");
  } catch (error) {
    res.status(422).send(error.message);
  }
});

app.get("/api/budget", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await admin
      .auth()
      .verifyIdToken(auth)
      .then(decodedToken => {
        return decodedToken.uid;
      });
    const totalBudget = await getBudgetInfo(uid);
    res.send(totalBudget);
  } catch (error) {
    res.status(422).send(error.message);
  }
});

app.get("*", function(req, res) {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.listen(port, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Listening on port http://localhost:${port}`);
  }
  console.log(`Listening on port: ${port}`);
});
