const mongoose = require("mongoose");
const login = require("../config/config");
const uri = `mongodb+srv://${login.user}:${login.pw}@david-sandbox.chqmq.mongodb.net/sockreact?retryWrites=true&w=majority`;

const schema = require("./messageSchema");

connectToDatabase = () => {
    mongoose
        .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("Connected to mongo db..."))
        .catch((err) => console.log("Could not connect to DB", err));

    return mongoose;
};

// const messageSchema = new mongoose.Schema({
//     room: String,
//     message: String,
//     sender: String,
//     createdAt: String,
// });

const collections = {
    "Public-1": mongoose.model("public-1", schema.message),
    "Public-2": mongoose.model("public-2", schema.message),
    "Public-3": mongoose.model("public-3", schema.message),
};

exports.connectToDatabase = connectToDatabase;
exports.collections = collections;
