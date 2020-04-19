let mongoose = require('mongoose');
let urlRegex = require('url-regex')

let {isEmail} = require('validator');
let Schema = mongoose.Schema;

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

module.exports = {Organization};