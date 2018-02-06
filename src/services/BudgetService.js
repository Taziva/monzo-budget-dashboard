import Api from "@/services/Api";
import firebase from "firebase";

export const setBudget = async totalBudget => {
  await firebase
    .auth()
    .currentUser.getIdToken(true)
    .then(idToken => {
      return Api().post(
        "/budget/new",
        {
          totalBudget
        },
        {
          headers: { Authorization: `${idToken}` }
        }
      );
    });
};

export const fetchBudget = async () => {
  let { data } = await firebase
    .auth()
    .currentUser.getIdToken(true)
    .then(idToken => {
      return Api().get("/budget", {
        headers: { Authorization: `${idToken}` }
      });
    });
  return data;
};
