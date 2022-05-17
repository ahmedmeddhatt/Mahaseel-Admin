const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QualitySchema = new Schema({
    name_ar: {
        type: String,
        required: true,
    },
    name_en: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
 
}, { timestamps: true,});

const Quality = mongoose.model('quality', QualitySchema);

module.exports = Quality;