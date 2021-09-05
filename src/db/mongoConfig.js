require("dotenv").config()
const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.stuos.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("DB connected!!! ");
  })
  .catch(err => {
    console.log(err);
  });

module.exports = mongoose;
