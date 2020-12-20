const mongoose = require("mongoose");
const login = require("../config/config");
const uri = `mongodb+srv://${login.user}:${login.pw}@david-sandbox.chqmq.mongodb.net/sockreact?retryWrites=true&w=majority`;

const schema = require("./messageSchema");

connectToDatabase = () => {
    mongoose
        .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("Connected to mongo db..."))
        .catch((err) => console.log("Could not connect to DB", err));
    mongoose.pluralize(null);
    return mongoose;
};

const collections = {
    public: mongoose.model("publics", schema.message),
    general: mongoose.model("generals", schema.message),
    global: mongoose.model("globals", schema.message),
};

exports.connectToDatabase = connectToDatabase;
exports.collections = collections;
