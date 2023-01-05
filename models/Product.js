const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        minLength: [5, 'Name can not be less than 5 characters'],
        maxlength: [75, 'Name can not be more than 75 characters'],
        match: [/^[a-zA-Z0-9]+$/, 'Name can only contain alphanumeric characters'],
        uppercase: true

    },


    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    photo: {
        type: String,
        default: 'no-photo.jpg'
    },

    brand: {
        type: String,
        required: true
    },

    brandCountry: {
        // Array of strings
        type: String,
        required: true,
        enum: [
            "Spain",
            "France"

        ]
    },

    ingredients: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: [true, 'Please add a description'],
        unique: true,
        trim: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [500, 'Description can not be more than 500 characters'],
        lowercase: true
    },

    likes: {
        type: Number,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Product', ProductSchema)