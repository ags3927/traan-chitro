let mongoose = require('mongoose');

let Schema = mongoose.Schema

let activitySchema = new Schema({
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

})

activitySchema.indexes({location: '2dsphere'});

let Activity = mongoose.model('Activity', activitySchema);

module.exports = {Activity};