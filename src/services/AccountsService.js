import Api from "@/services/Api";
import firebase from "firebase";

export default {
  async authorizeUser(code) {
    let app = await firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        return Api().get("/authorize", {
          headers: { Authorization: `${idToken}` },
          params: { code: code }
        });
      });
    return app;
  }
};
