const mongoose = require('mongoose');

const server = process.env.MONGO_DB_URL;
const database = process.env.MONGO_DB_NAME;
const username = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

class DatabaseConnection {

    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(`mongodb://${username}:${password}@${server}/${database}`)
                .then(() => {
                    console.log('Database connection successful.');
                })
                .catch(err => {
                    console.error(`Database connection error: ${err}`);
                });
    }

}

module.exports = new DatabaseConnection();