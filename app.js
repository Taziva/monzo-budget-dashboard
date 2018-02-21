import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import admin from "firebase-admin";
import request from "request-promise";
import axios from "axios";

import MonzoClient from "./src/clients/monzo";
import { decodeUser } from "./src/services/DecodeUser";
import {
  getAccountInfo,
  saveAccountInfo,
  saveTotalBudgetInfo,
  getBudgetInfo,
  saveRemainingBudgetInfo,
  getRemainingBudgetInfo,
  getAllBudgetInfo,
  setNotificationsStatus,
  getNotificationsStatus
} from "./src/services/Database";
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
    let uid = await decodeUser(auth);
    const { accessToken, accountId } = await getAccountInfo(uid);
    const data = await MonzoClient.getTransactions(accessToken, accountId);
    res.send(data.transactions);
  } catch (error) {
    res.send({ error: error.response.data });
  }
});

app.get("/api/balance", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await decodeUser(auth);
    const { accessToken, accountId } = await getAccountInfo(uid);
    const balance = await MonzoClient.getBalance(accessToken, accountId);
    res.json(balance);
  } catch (error) {
    res.status(422).send(error.message);
  }
});

app.post("/api/feed/new", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await decodeUser(auth);
    const { accessToken, accountId } = await getAccountInfo(uid);
    await MonzoClient.sendBalance(accessToken, accountId, req.body.message);
    res.sendStatus(200);
  } catch (error) {
    res.status(422).send(error.message);
  }
});

app.get("/api/authorize", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await decodeUser(auth);
    let account = await MonzoClient.authorize(req.query.code);
    await saveAccountInfo(account, uid);
    res.sendStatus(200);
  } catch (error) {
    res.status(422).send(error.message);
  }
});

app.post("/api/budget/new", async (req, res) => {
  try {
    const totalBudget = req.body.totalBudget;
    let auth = req.get("authorization");
    let uid = await decodeUser(auth);

    await saveTotalBudgetInfo(totalBudget, uid);
    res.sendStatus(200);
  } catch (error) {
    res.status(422).send(error.message);
  }
});

app.get("/api/budget", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await decodeUser(auth);
    const totalBudget = await getBudgetInfo(uid);
    res.json(totalBudget);
  } catch (error) {
    res.sendStatus(422);
  }
});

app.get("/api/remaining-budget", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await decodeUser(auth);
    const remainingBudget = await getRemainingBudgetInfo(uid);
    res.json(remainingBudget);
  } catch (error) {
    res.sendStatus(422);
  }
});

app.post("/api/remaining-budget/new", async (req, res) => {
  try {
    const remainingBudget = req.body.remainingBudget;
    let auth = req.get("authorization");
    let uid = await decodeUser(auth);
    await saveRemainingBudgetInfo(remainingBudget, uid);
    res.sendStatus(200);
  } catch (error) {
    res.status(422).send(error.message);
  }
});

app.post("/api/webhooks/new", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await decodeUser(auth);
    const { accessToken, accountId } = await getAccountInfo(uid);
    await MonzoClient.setUpNotifications(accessToken, accountId, uid);
    setNotificationsStatus(true, uid);
    res.sendStatus(200);
  } catch (error) {
    res.status(422).send(error.message);
  }
});

app.get("/api/webhooks", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await decodeUser(auth);
    const { accessToken, accountId } = await getAccountInfo(uid);
    let { webhooks } = await MonzoClient.getNotifications(
      accessToken,
      accountId
    );
    const userWebhooks = webhooks.filter(webhook => {
      webhook.url.endsWith(uid);
    });
    return userWebhooks;
  } catch (error) {
    res.sendStatus(422);
  }
});

app.post("/api/webhooks/:uid", async (req, res) => {
  try {
    let uid = req.params.uid;
    const { accessToken, accountId } = await getAccountInfo(uid);
    const { remainingBudget, totalBudget } = await getAllBudgetInfo(uid);
    const transaction = req.body.data;
    const newBudget = remainingBudget + transaction.amount / 100;
    const percentage = (newBudget / totalBudget * 100).toFixed(2);
    saveRemainingBudgetInfo(newBudget, uid);
    await MonzoClient.sendPercentage(accessToken, accountId, percentage);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(422);
  }
});

app.delete("/api/webhooks", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await decodeUser(auth);
    const { accessToken, accountId } = await getAccountInfo(uid);
    await MonzoClient.stopNotifications(accountId, accessToken, uid);
    setNotificationsStatus(false, uid);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(422);
  }
});

app.get("/api/notifications", async (req, res) => {
  try {
    let auth = req.get("authorization");
    let uid = await decodeUser(auth);
    const notificationsStatus = await getNotificationsStatus(uid);
    res.json(notificationsStatus);
  } catch (error) {
    res.sendStatus(422);
  }
});

app.get("*", function(req, res) {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    console.log(`Listening on port: ${port}`);
  }
  else {
    console.log(`Listening on port http://localhost:${port}`);
  }
});
