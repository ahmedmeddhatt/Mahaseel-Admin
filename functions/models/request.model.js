const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    code : { type : String , required : true , unique : true} ,
    user: {
        type: mongoose.ObjectId,
        ref: "user",
        required: true,
    },
    createdBy: {
        type: mongoose.ObjectId,
        ref: "user",
        required: true,
    },
    certificate : {
        type: String,
        default : null
    },
    cancelled : {
        type: Boolean,
        default : false
    },
    status : {
        type: String,
        required: true,
        enum: ["inprogress", "accept", "reject"]
    },
    farm: {
        type: Object,
        required: true,
    },
    crop : {
        type: mongoose.ObjectId,
        ref: "crop",
        required: true,
    },
    varieties : 
        {
            type : Array,
            name : {type : String , required: true},
            parts : {type : Number , required: true},
            area : {type : Object , required: true},
            quantity : {type : Object , required: true},
            picking : {type : Object , required: true},
    },
    quality : Array,
    
}, { timestamps: true,});

const Request = mongoose.model('request', RequestSchema);

module.exports = Request;