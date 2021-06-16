const mongoose = require('mongoose');

const Schema = mongoose.Schema;


var passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    admin: {
        type: Boolean,
        default: false

    },
    city: {
        type: String,
        required: true

    },
    state: {
        type: String,
        required: true

    },
    address: {
        type: String,
        required: true

    },
    age: {
        type: Number,
        required: true

    },
    gender: {
        type: String,
        required: true

    },
    contact: {
        type: Number,
        required: true

    },
    mail: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

userSchema.plugin(passportLocalMongoose);


var User = mongoose.model('User', userSchema);


module.exports = User;