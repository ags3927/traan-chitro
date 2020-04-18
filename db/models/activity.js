const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activitySchema = new Schema({
    orgName: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

});

activitySchema.indexes({location: '2dsphere'});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = {Activity};