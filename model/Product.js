const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [75, 'Name can not be more than 75 characters']
    },


    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    image: {
        type: String,
        require: true,
    },

    cloudinaryId: {
        type: String,
        require: true,
    },
    typeOfProduct: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
            "Facial",
            "Limpiador"
        ]
    },
    brand: {
        type: String,
        require: true
    },

    brandCountry: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
            "Spain",
            "France"

        ]
    },

    ingredientList: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
            "Water",
            "Caprylic/Capric Triglyceride",
            "Isohexadecane",
            "Glycerin",
            "Cetyl Alcohol",
            "Propylene Glycol",
            "Glyceryl Stearate",
            "Peg-100 Sterate",
            "Butyrospermum Parkii Butter Extract",
            "Aloe Barbadensis Leaf Juice",
            "Bisabolol",
            "Tocopheryl Acetate",
            "Retinyl Propionate",
            " Cyclopentasiloxane",
            "Triethanolamine",
            "Carbomer",
            "Dimethiconol",
            "Disodium EDTA",
            "Centella Asiatica Extract",
            "Helianthus Annuus Seed Oil"
        ]
    },

    description: {
        type: String,
        required: [true, 'Please add a description'],
        unique: true,
        trim: true,
        maxlength: [500, 'Name can not be more than 500 characters']
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