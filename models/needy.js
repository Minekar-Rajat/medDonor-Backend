const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const needySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    patitent: {
        type: String,
        required: true

    },
    need: {
        type: String,
        required: true

    },
    quantity: {
        type: Number,
        required: true

    },
    description: {
        type: String,
        required: true

    },
    bloodgroup: {
        type: String,
        required: true

    },
    hospital: {
        type: String,
        required: true

    },
    condition: {
        type: String,
        required: true

    },
    status: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

var Needy = mongoose.model('Needy', needySchema);

module.exports = Needy;