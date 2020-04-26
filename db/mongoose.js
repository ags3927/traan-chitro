const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://tran-chitro:bhallagenamarajabo113141@tranchitro-yyxz5.gcp.mongodb.net/tran-chitro?retryWrites=true&w=majority", {
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
