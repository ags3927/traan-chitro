const mongoose = require('mongoose');
const urlRegex = require('url-regex')

const {isEmail} = require('validator');
const Schema = mongoose.Schema;

let validatePhone = (phones) => {
    if (phones.length === 0) {
        throw new mongoose.Error('Phones array cannot be empty');
    }
    console.log("PHONES ARRAY = ", phones);
    phones.forEach((phone) => {
        console.log("PHONE = ", phone);
        if (phone.length !== 14) {
            throw new mongoose.Error('Phone number has to be 14 digits long');
        }
    });
}

let validateURL = (url) => {
    if (!urlRegex({exact: true}).test(url)) {
        throw new mongoose.Error('Invalid url');
    }
}

let validateEmail = (email) => {
    if (!isEmail(email)) {
        throw new mongoose.Error('Invalid email');
    }
}

const organizationSchema = new Schema({
    orgName: {
        type: String,
        unique: true,
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
        phones: {
            type: [String],
            validate: [validatePhone]
        },
        email: {
            type: String,
            trim: true,
            validate: {
                validator: validateEmail
            }
        },
        facebook: {
            type: String,
            trim: true,
            validate: {
                validator: validateURL
            }
        },
        website: {
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
    },
    activityLocations: {
        type: String,
        trim: true,
        minlength: 1
    }
});

const Organization = mongoose.model('Organization', organizationSchema);

const ToBeRegisteredOrganization = mongoose.model('ToBeRegisteredOrganization', organizationSchema);

module.exports = {
    Organization,
    ToBeRegisteredOrganization
};