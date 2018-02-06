import Api from "@/services/Api";
import firebase from "firebase";

export const authorizeUser = async code => {
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
};
