let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
  "userName": String,
  "userPwd": String
})

module.exports = mongoose.model('User', userSchema);
