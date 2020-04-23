const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 1,
        trim: true
    },
    orgName: {
        type: String,
        unique: true,
        required: true,
        minlength: 1,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        _id: false,
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')){
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(user.password, salt,(err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
});


const User = new mongoose.model('User', userSchema);

module.exports = {User};

