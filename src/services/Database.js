const firebase = require("firebase-admin");
const encryption = require("./Encryption.js");

module.exports = {
  saveAccountInfo: async (data, uid) => {
    const encryptedAccessToken = encryption.encryptData(data.access_token);
    await firebase
      .database()
      .ref(`/users/${uid}/monzoAccount`)
      .set({
        accountId: data.accountId,
        accessToken: encryptedAccessToken
      });
  },
  getAccountInfo: async uid => {
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
  }
};
