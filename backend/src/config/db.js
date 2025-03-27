const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to database.");
    }
    catch(err){
        console.log("Connection to db failed: ",err.message);
        process.exit(1);
    }
}

module.exports = connectDB;