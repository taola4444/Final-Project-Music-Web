const mongoose = require("mongoose");

const AccountSchema = mongoose.Schema({
    displayName: {
        type: String,
    },
    email: {
        type: String,
        require: true
    },
    photoURL: {
        type: String,
    },
    uid: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    }
}, {timestamps: true});

module.exports = mongoose.model("RegiterEmail",AccountSchema);