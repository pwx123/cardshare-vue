let mongoose = require('mongoose')
let Schema = mongoose.Schema

let eventSchema = new Schema({
  'newEventId': String,
  'eventList': [{
    'phoneNum': String,
    'event': {
      'time': String,
      'title': String,
      'detail': String
    }
  }]
})

module.exports = mongoose.model('Event', eventSchema)
