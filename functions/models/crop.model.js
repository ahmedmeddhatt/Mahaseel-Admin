const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CropSchema = new Schema({
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
    color: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    varieties : [
        {
            _id: Schema.Types.ObjectId,
            name_ar: String,
            name_en: String,
        }
    ]
}, { timestamps: true,});

const Crop = mongoose.model('crop', CropSchema);

module.exports = Crop;