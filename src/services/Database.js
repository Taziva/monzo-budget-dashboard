import firebase from "firebase-admin";
import encryption from "./Encryption.js";

export const saveAccountInfo = async (data, uid) => {
  const encryptedAccessToken = encryption.encryptData(data.access_token);
  await firebase
    .database()
    .ref(`/users/${uid}/monzoAccount`)
    .update({
      accountId: data.accountId,
      accessToken: encryptedAccessToken
    });
};
export const getAccountInfo = async uid => {
  let accountInfo = await firebase
    .database()
    .ref(`/users/${uid}/monzoAccount`)
    .once("value")
    .then(snapshot => {
      return snapshot.val();
    });
  accountInfo.accessToken = encryption.decryptData(
    accountInfo.accessToken.toString()
  );
  return accountInfo;
};
export const saveTotalBudgetInfo = async (totalBudget, uid) => {
  await firebase
    .database()
    .ref(`/users/${uid}/monzoAccount`)
    .update({
      totalBudget
    });
};
export const getBudgetInfo = async uid => {
  let totalBudget = await firebase
    .database()
    .ref(`/users/${uid}/monzoAccount`)
    .once("value")
    .then(snapshot => {
      return snapshot.val().totalBudget;
    });
  return totalBudget;
};
export const saveRemainingBudgetInfo = async (remainingBudget, uid) => {
  await firebase
    .database()
    .ref(`/users/${uid}/monzoAccount`)
    .update({
      remainingBudget
    });
};
export const getRemainingBudgetInfo = async uid => {
  let remainingBudget = await firebase
    .database()
    .ref(`/users/${uid}/monzoAccount`)
    .once("value")
    .then(snapshot => {
      return snapshot.val().remainingBudget;
    });
  return remainingBudget;
};
export const getAllBudgetInfo = async uid => {
  let info = await firebase
    .database()
    .ref(`/users/${uid}/monzoAccount`)
    .once("value")
    .then(snapshot => {
      return snapshot.val();
    });
  const budgetInfo = {
    totalBudget: info.totalBudget,
    remainingBudget: info.remainingBudget
  };
  return budgetInfo;
};

export const setNotificationsStatus = async (notificationsStatus, uid) => {
  await firebase
    .database()
    .ref(`/users/${uid}/monzoAccount`)
    .update({
      notificationsStatus
    });
};

export const getNotificationsStatus = async uid => {
  let notificationsStatus = await firebase
    .database()
    .ref(`/users/${uid}/monzoAccount`)
    .once("value")
    .then(snapshot => {
      return snapshot.val().notificationsStatus;
    });
  return notificationsStatus;
};
