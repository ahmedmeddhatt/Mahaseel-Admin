const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FarmSchema = new Schema({
    user: {
        type: mongoose.ObjectId,
        ref: "users",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    location : {
        governorate : {
                type: mongoose.ObjectId,
                ref: "location",
                required: true,
        },
        center : {
                type: mongoose.ObjectId,
                ref: "location",
                required: true,
        },
        hamlet : { 

                type: mongoose.ObjectId,
                ref: "location",
                required: true,
        }, 
        address : { type : Object , required: true },
    },
    color: {
        type: String
    },
    active: {
        type: Boolean,
        default: true,
    },
    
}, { timestamps: true,});

const Farm = mongoose.model('farm', FarmSchema);

module.exports = Farm;