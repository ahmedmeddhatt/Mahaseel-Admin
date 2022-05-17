const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://source.unsplash.com/1220x700/?agriculture'
    },
    views: { 
        type: Number,
        default : 1
    },
    active: {
        type: Boolean,
        default : true
    },
    topicId : {
        type: mongoose.Schema.Types.ObjectId ,
        ref: "topic" 
        }
}, { timestamps: true });

const post = mongoose.model('post', postsSchema);

module.exports = post;