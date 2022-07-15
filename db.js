const Mongoose = require("mongoose");
const nodemon = require("nodemon");

const localDB = `mongodb+srv://root:root@cluster0.ii7aa.mongodb.net/blog?retryWrites=true&w=majority`;

const connectDB = async () => {
  await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB;


