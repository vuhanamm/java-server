const mongoose = require('mongoose');

async function connect() {
    try {
        const url = 'mongodb+srv://java:9WBNRj9kxfT2qSqo@cluster0.ha1jjuf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
        var a = await mongoose.connect(url);
        console.log('Connect to db success '+url)
    } catch (e) {
        console.log('Connect to db failed '+e)
    }
}

module.exports = {connect}