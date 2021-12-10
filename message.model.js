const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Message = new Schema({
    message_title: {
        type: String
    },
    message_content: {
        type: String
    },
    message_author: {
        type: String
    }
})

module.exports = mongoose.model('Message', Message);