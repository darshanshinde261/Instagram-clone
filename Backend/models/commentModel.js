const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
    text:{
        type:String,
        require:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        require:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post',
        require:true,
    }
});

module.exports = mongoose.model("comment",commentSchema);