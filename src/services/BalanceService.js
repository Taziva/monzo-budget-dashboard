import Api from "@/services/Api";
import firebase from "firebase";

export const fetchBalance = async code => {
  let { data } = await firebase
    .auth()
    .currentUser.getIdToken(true)
    .then(idToken => {
      return Api().get("/balance", {
        headers: { Authorization: `${idToken}` }
      });
    });
  return data;
};
