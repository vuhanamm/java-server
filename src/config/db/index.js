const mongoose = require('mongoose');

async function connect() {
    try {
        const url = 'mongodb://localhost:27017/test'
        var a = await mongoose.connect(url);
        console.log('Connect to db success')
    } catch (e) {
        console.log('Connect to db failed')
    }
}

module.exports = {connect}