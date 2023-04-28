const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    imageURL: {
        type: String,
    },
    user_id: {
        type: String,
    },
    email_verified: {
        type: Boolean,
    },
    role: {
        type: String,
    },
    id_refund: {
        type: String,
    },
    payer_id: {
        type: String,
    },
    favourites: [
        {
          song_id: String,
        },
    ],
    auth_time: {
        type: String,
    }
}, {timestamps: true});

module.exports = mongoose.model("user",UserSchema);