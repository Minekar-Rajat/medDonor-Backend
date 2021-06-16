const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const donorSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    donor: {
        type: String,
        required: true

    },
    availability: {
        type: String,
        required: true

    },
    quantity: {
        type: String,
        required: true

    },
    bloodgroup: {
        type: String,
        required: true

    },
    status: {
        type: Boolean,
        required: true,
        default: false

    },
    description: {
        type: String,
        required: true

    }
}, {
    timestamps: true
});

var Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;