let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let organizationSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    }
})

let Organization = mongoose.model('Organization', organizationSchema);

module.exports = {Organization};