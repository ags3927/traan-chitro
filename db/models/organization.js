const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    }
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = {Organization};