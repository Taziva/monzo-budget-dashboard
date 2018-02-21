'use strict'
require("dotenv").config();

module.exports = {
  NODE_ENV: '"production"',
  FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
  FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
  FIREBASE_DATABASE_URL: JSON.stringify(process.env.FIREBASE_DATABASE_URL),
  FIREBASE_PROJECT_ID: JSON.stringify(process.env.FIREBASE_PROJECT_ID),
  FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
  FIREBASE_MESSAGING_SENDER_ID:JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
  CRYPT_KEY: JSON.stringify(process.env.CRYPT_KEY),
  MONZO_CLIENT:JSON.stringify(process.env.MONZO_CLIENT_ID),
  HOST: JSON.stringify(process.env.HOST)
}
