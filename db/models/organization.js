const mongoose = require('mongoose');
const urlRegex = require('url-regex')

const {isEmail} = require('validator');
const Schema = mongoose.Schema;

let validateURL = (url) => {
    if (!urlRegex({exact: true}).test(url)){
        throw new mongoose.Error('Invalid url');
    }
}

let validateEmail = (email) => {
    if (!isEmail(email)){
        throw new mongoose.Error('Invalid email');
    }
}

const organizationSchema = new Schema({
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
            validate: {
                validator: validateEmail
            }
        },
        url: {
            type: String,
            trim: true,
            validate: {
                validator: validateURL
            }
        },
        donate: {
            type: String,
            trim: true,
            validate: {
                validator: validateURL
            }
        }
    }
});

const Organization = mongoose.model('Organization', organizationSchema);

const ToBeRegisteredOrganization = mongoose.model('ToBeRegisteredOrganization', organizationSchema);

module.exports = {
    Organization,
    ToBeRegisteredOrganization
};