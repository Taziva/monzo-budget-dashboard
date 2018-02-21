import admin from "firebase-admin";

export const decodeUser = async auth => {
  return admin
    .auth()
    .verifyIdToken(auth)
    .then(decodedToken => {
      return decodedToken.uid;
    });
};
