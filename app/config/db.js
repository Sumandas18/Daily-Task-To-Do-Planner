

require('dotenv').config()
const mongoose = require('mongoose')

const MongodbUrl = process.env.MONGODB_URL

const dataConnection = async () => {
    try {
        // mongodb connection
        const connection = await mongoose.connect(MongodbUrl)
        if(connection){
            console.log('DB Connect hoye geche boss! ✅');
        } else {
            console.log('DB connection lagte parche na...');
        }
    } catch (error) {
        console.log('DB error asche:', error);
    }
}

module.exports = dataConnection