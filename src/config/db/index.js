const mongoose = require('mongoose');

async function connect() {
    try {
        mongoose.set('strictQuery', false);

        const url = 'mongodb+srv://hangocluc2001_db_user:Luc2001@cluster0.nzd2jsk.mongodb.net/myDatabase';

        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Connect to db success');
    } catch (e) {
        console.log('❌ Connect to db failed:', e.message);
    }
}

module.exports = { connect }