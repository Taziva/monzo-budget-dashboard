import Api from "@/services/Api";
import firebase from "firebase";

export default {
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
