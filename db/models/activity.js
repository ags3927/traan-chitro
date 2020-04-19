const mongoose = require('mongoose');

const Schema = mongoose.Schema;

function validatePoint(coordinates) {

    // must have 2 points
    if (coordinates.length !== 2) {
        throw new mongoose.Error('Point ' + coordinates + ' must contain two coordinates');
    }

    // longitude must be within bounds
    if (coordinates[0] > 180 || coordinates[0] < -180) {
        throw new mongoose.Error('invalid longitude');
    }
    // latitude must be within bounds
    if (coordinates[1] > 90 || coordinates[1] < -90) {
        throw new mongoose.Error('invalid latitude');
    }
}

const activitySchema = new Schema({
    orgName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    typeOfRelief: {
        type: String,
        enum: ['FOOD','PPE','SANITIZER','MASK','GLOVES'],
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: validatePoint
            }
        }
    },
    supplyDate: {
        type: Date
    },
    contents: [{
        _id: false,
        item: {
            type: String,
            minlength:1,
            trim: true
        },
        quantity: {
            type: String,
            trim: true
        },
        comment: {
            type: String,
            trim: true
        }
    }],
    redundant: {
        type: Boolean,
        default: false
    }
});

activitySchema.indexes({location: '2dsphere'});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = {Activity};