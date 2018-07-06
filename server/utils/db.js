var mongoose = require('mongoose');
const DB_URL = "mongodb://127.0.0.1:27017/cardshareNew";

mongoose.connect(DB_URL);
mongoose.connection.on('connected', () => {
  console.log("Mongoose connection open to " + DB_URL);
})
mongoose.connection.on("error", () => {
  console.log("MongoDB connected error.");
});

mongoose.connection.on("disconnectioned", () => {
  console.log("MongoDB connected disconnected.");
});

module.exports = mongoose;
