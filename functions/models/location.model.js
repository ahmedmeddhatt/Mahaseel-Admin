const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    name_ar: {
        type: String,
        required: true,
    },
    name_en: {
        type: String,
        required: true,
    },
    code: { 
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default : true
    },
    type: {
        type: String,
        required: true,
        enum: ["governorate", "center", "hamlet"]
    },
    parent : {
        type: mongoose.ObjectId,
        ref: "locations",
        default : null
    },
    coordinates: {
        type: [Number],
        required: false
    }
}, { timestamps: true });

const Location = mongoose.model('location', LocationSchema);

module.exports = Location;