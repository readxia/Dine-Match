const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname:{
        type: String,
    },
    lastname:{
        type: String,
    },
    email:{
        type: String,
        unique: true,
        match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
    },
    username:{
        type: String,
        unique: true,
    },
    password:{
        type: String,
    },
    city:{
        type: String,
    },
    state:{
        type: String,
        minLength: 2, 
        maxLength: 2,
    },
    zip:{
        type: Number,
        minLength: 5,
        maxLength: 5,
    },
    selectedOptions:{
        type: [String],
        default: "Add your preferences",
    },
    priceRange:{
        type: String,
        default: "Add your price range",
    },
    favoriteRestaurants: [{ 
        _id: false, // Prevents Mongoose from creating an _id field for sub-documents
        id: { type: String },
        name: { type: String},
        image: { type: String },
        url: { type: String},
        rating: { type: Number},
        phone: { type: String},
        address: [{ type: String}],
        category: [{ type: String }]
    }],
});



exports.userModel = mongoose.model('Users', userSchema);