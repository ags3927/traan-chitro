const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
    //autoIndex: false
}).then(() => {
    console.log('You are connected to database.')
}).catch((err) => {
    console.log(err.message);
    process.exit();
});

module.exports = {mongoose};
