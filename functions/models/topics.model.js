const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicsSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    active: {
        type: Boolean,
        default: true,
    }
},
{timestamps : true});



const topics = mongoose.model('topic', topicsSchema);

module.exports = topics;