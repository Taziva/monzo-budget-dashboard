import CryptoJS from "crypto-js";

export default {
  encryptData: data => {
    var encrypted = CryptoJS.AES.encrypt(data, process.env.CRYPT_KEY);
    return encrypted.toString();
  },
  decryptData: data => {
    var decryptedBytes = CryptoJS.AES.decrypt(data, process.env.CRYPT_KEY);
    var decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
};
