let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
  "loginUserEmail": String,
  "userPwd": String,
  "userName": String,
  "newEventId": String
})

module.exports = mongoose.model('User', userSchema);
