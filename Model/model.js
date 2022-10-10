const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        required:true,
        type: String
    },

    city: {
        required:true,
        type: String
    },

    imageOne: {
        required:true,
        type: String
    },

    imageTwo: {
        required:true,
        type: String
    },

    imageThree: {
        required:true,
        type: String
    },

    cost: {
        required:true,
        type: Number
    },

    heritage: {
        required:true,
        type: String
    },

    places: {
        required:true,
        type: String
    },

    information: {
        required:true,
        type: String
    } 
})

module.exports = mongoose.model('Data', dataSchema)
