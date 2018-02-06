import firebase from "firebase-admin";
import encryption from "./Encryption.js";

export const saveAccountInfo = async (data, uid) => {
  const encryptedAccessToken = encryption.encryptData(data.access_token);
  await firebase
    .database()
    .ref(`/users/${uid}/monzoAccount`)
    .set({
      accountId: data.accountId,
      accessToken: encryptedAccessToken,
      totalBudget: 0
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
export const saveRemainingBudgetInfo = async (remainingBudget, uid) => {
  await firebase
    .database()
    .ref(`/users/${uid}/monzoAccount`)
    .update({
      remainingBudget
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
