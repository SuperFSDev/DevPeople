const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoDbURI');
 

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const connectDB = async () => {
    try{
        await mongoose.connect(db);
        console.log("MongoDb connected...");
    }
    catch(error){
        console.error('error', error);
        //exit with failure
        process.exit(1);
    }
}
 
module.exports = connectDB;
