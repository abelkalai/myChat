require('dotenv').config()

let MONGODB_URI = process.env.MONGODB_URI
let JSON_SECRET_KEY= process.env.JSON_SECRET_KEY
let EMAIL_USERNAME= process.env.EMAIL_USERNAME
let EMAIL_PASSWORD= process.env.EMAIL_PASSWORD

module.exports = {
  MONGODB_URI,
  JSON_SECRET_KEY,
  EMAIL_USERNAME,
  EMAIL_PASSWORD
}