require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
const JSON_SECRET_KEY= process.env.JSON_SECRET_KEY
const EMAIL_USERNAME= process.env.EMAIL_USERNAME
const EMAIL_PASSWORD= process.env.EMAIL_PASSWORD
const CLIENT_ID= process.env.CLIENT_ID
const CLIENT_SECRET= process.env.CLIENT_SECRET
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

module.exports = {
  MONGODB_URI,
  JSON_SECRET_KEY,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN
}