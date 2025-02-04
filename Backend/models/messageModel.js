const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    textMessage:{
        type:String,
        require:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    }
});

module.exports = mongoose.model('message',messageSchema);