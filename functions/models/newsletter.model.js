const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsLetterSchema = new Schema({
    email: {
        type: String,
        trim: true,
    },
    active: {
        type: Boolean,
        default: true,
    }
},
{timestamps : true});

const newsLetter = mongoose.model('Newsletter', newsLetterSchema);

module.exports = newsLetter;