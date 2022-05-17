const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    describtion: {
        type: String,
        required: true,
    },
    source: 'https://www.albawabhnews.com/search/term?w=%D8%A7%D9%84%D8%B5%D8%A7%D8%AF%D8%B1%D8%A7%D8%AA+%D8%A7%D9%84%D8%B2%D8%B1%D8%A7%D8%B9%D9%8A%D8%A9'
    ,
    active: {
        type: Boolean,
        default: true,
    },
    
}, { timestamps: true,});

const News = mongoose.model('news', newsSchema);

module.exports = News;