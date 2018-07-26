let mongoose = require('mongoose')
let Schema = mongoose.Schema
let cardSchema = new Schema({
  'loginUserEmail': String,
  'cardList': [{
    'cardid': String,
    'key': String,
    'email': String,
    'userName': String,
    'phoneNum': String,
    'address': String
  }]
})

module.exports = mongoose.model('Card', cardSchema)
