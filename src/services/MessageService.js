import Api from "./Api";
import firebase from "firebase";

export default {
  async setUpNotifications() {
    await firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        return Api().post(
          "/webhooks/new",
          {},
          {
            headers: { Authorization: `${idToken}` }
          }
        );
      });
  },
  async getNotifications() {
    await firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        return Api().get("/webhooks", {
          headers: { Authorization: `${idToken}` }
        });
      });
  },
  async getNotificationsStatus() {
    let { data } = await firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        return Api().get("/notifications", {
          headers: { Authorization: `${idToken}` }
        });
      });
    return data;
  },
  async stopNotifications() {
    await firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        return Api().delete("/webhooks", {
          headers: { Authorization: `${idToken}` }
        });
      });
  }
};
