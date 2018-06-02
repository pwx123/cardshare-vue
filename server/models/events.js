let mongoose = require('mongoose')
let Schema = mongoose.Schema

let eventSchema = new Schema({
  "newEventId": String,
  "eventList": [{
    "phoneNum": String,
    "event": String
  }]
})

module.exports = mongoose.model('Event', eventSchema);
