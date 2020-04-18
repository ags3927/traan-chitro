let mongoose = require('mongoose');

process.env.MONGODB_URI = 'mongodb://localhost:27017/tran-chitro';

let connectDB = async () => {
    try{
            await mongoose.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            //autoIndex: false
        });
    } catch (e) {
        console.log(e);
    }
}

let closeDB = () => {
    mongoose.connection.close();   // this function has some problems
}

module.exports = {connectDB,closeDB} ;
