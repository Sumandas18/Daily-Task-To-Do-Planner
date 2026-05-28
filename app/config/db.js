

require('dotenv').config()
const mongoose = require('mongoose')

const MongodbUrl = process.env.MONGODB_URL

const dataConnection = async () => {
    try {
        const connection = await mongoose.connect(MongodbUrl)
        if(connection){
            console.log('DB Connect ');
        } else {
            console.log('DB connection failed');
        }
    } catch (error) {
        console.log('DB error :', error);
    }
}

module.exports = dataConnection