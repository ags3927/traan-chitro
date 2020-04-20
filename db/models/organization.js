const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const Schema = mongoose.Schema;

const urlValidator = [
    validate({
        validator: 'isURL',
        passIfEmpty: false,
        message: 'Should be URL'
    })
];

let emailValidator = [
    validate({
        validator: 'isEmail',
        passIfEmpty: false,
        message: 'Should be Email'
    })
];

let organizationSchema = new Schema({
    orgName: {
        type: String,
        unique: true,
        index: 0,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    contact: {
        phone: {
            type: String,
            required: true,
            minlength: 14,
            maxlength:14
        },
        email: {
            type: String,
            trim: true,
            validate: emailValidator
        },
        url: {
            type: String,
            trim: true,
            validate: urlValidator
        },
        donate: {
            type: String,
            trim: true,
            validate: urlValidator
        }
    }
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = {Organization};