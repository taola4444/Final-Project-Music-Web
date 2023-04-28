const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    imageURL: {
        type: String,
        require: true
    },
    songURL: {
        type: String,
        require: true
    },
    album: {
        type: String,
    },
    artist: {
        type: String,
    },
    language: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    }
},{timestamps: true});

module.exports = mongoose.model("song",songSchema);