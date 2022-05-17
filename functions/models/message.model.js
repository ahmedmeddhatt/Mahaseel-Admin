const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    user: {
        type: mongoose.ObjectId,
        ref: "users",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        trim: true,
    },
    sender: {
        type: String,
        default: 'Mahaseel',
    },
    
}, { timestamps: true,});

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;