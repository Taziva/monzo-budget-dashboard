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
  async sendMessage() {
    let app = await firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        return Api().post(
          "/feed/new",
          {
            message: "We have lift off"
          },
          {
            headers: { Authorization: `${idToken}` }
          }
        );
      });
    return app;
  }
};
