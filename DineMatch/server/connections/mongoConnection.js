const mongoose = require('mongoose');
const { URI, DB, DB_PASS, DB_USER } = process.env;
const URL = `${URI}/${DB}`;

const connectionObj = {
    authSource: 'admin',
    user: DB_USER,
    pass: DB_PASS,

};

mongoose
.connect(URL, connectionObj)
.then(() => console.log(`MongoDB connected successfully ${DB}`))
.catch((err) => console.log(`MongoDB connection error: ${err} on ${DB}`));