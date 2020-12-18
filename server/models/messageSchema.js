const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    room: String,
    message: String,
    sender: String,
    createdAt: String,
});

exports.message = messageSchema;
