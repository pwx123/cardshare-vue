var mongoose = require('mongoose');
const DB_URL = "mongodb://admin:980101@localhost:27017/cardshareNew";

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
