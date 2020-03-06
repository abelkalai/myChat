require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI
let JSON_SECRET_KEY= process.env.JSON_SECRET_KEY
module.exports = {
  MONGODB_URI,
  JSON_SECRET_KEY,
  PORT
}