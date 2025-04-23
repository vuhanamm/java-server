const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QA = new Schema({
    userId: {type: String, default: ''},
    user: {type: String, default: ''},
    title: {type: String, default: ''},
    content: {type: String, default: ''},
    idQuestionId: {type: String, default: ''},
    status: {type: Boolean, default: false},
    type: {type: Boolean, default: false}
}, {
    versionKey: false
})

module.exports = mongoose.model('QA', QA)
