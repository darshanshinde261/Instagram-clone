const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        trim:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    profilePicture:{
        type:String,
        default:'',
    },
    bio:{
        type:String,
        default:'',
    },
    gender:{
        type:String,
        enum:['male','female'],
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }],
    bookmarks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }],
});

module.exports = mongoose.model('user',userSchema);