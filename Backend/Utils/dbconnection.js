const mongoose = require("mongoose");

const dbconnect =async()=>{
    try{
        await mongoose.connect(process.env.URI);
        console.log("dbconnected")
    }catch(error){
        console.log(error);
        console.log(error.message)
    }
} ;

module.exports = dbconnect