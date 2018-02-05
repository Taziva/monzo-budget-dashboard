import Api from "@/services/Api";
import firebase from "firebase";

export default {
  async fetchTransactions() {
    let app = await firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        return Api().get("/transactions", {
          headers: { Authorization: `${idToken}` }
        });
      });
    return app;
  },
  async sendMessage(message) {
    let app = await firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        return Api().post(
          "/feed/new",
          {
            message
          },
          {
            headers: { Authorization: `${idToken}` }
          }
        );
      });
    return app;
  }
};
