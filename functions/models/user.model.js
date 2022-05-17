const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    accessToken: {
        type: String
    },
    fcm: {
        type: String
    },
    device: {
        type: Object
    }
}, { timestamps: true,});

const User = mongoose.model('user', UserSchema);

module.exports = User;