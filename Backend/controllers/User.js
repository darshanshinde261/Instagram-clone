const user = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const post = require("../models/postModel")
const mongoose = require('mongoose');
require("dotenv").config();
const cloudinary = require("../Utils/cloudConnect");
const getDataUri = require('../Utils/getUri');


exports.register = async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(401).json({
                message:"all fiels are required",
                success:false,
            });
        };
        
        const User = await user.findOne({email});
        if(User){
            return res.status(401).json({
                message:"user already registered",
                success:false,
            });
        };
        const hashedPassword = await bcrypt.hash(password,10)

        await user.create({
            username,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            message:"user registered successfully",
            success:true,
        });
    }catch(error){
        return res.status(401).json({
            message:"problem in registration",
            error:error,
            errorMessage:error.message,
            success:false,
        });
    };
};

exports.login = async(req,res) =>{
    try{
        
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                message:"all fiels are required",
                success:false,
            });
        };
        
        let User = await user.findOne({email})
        if(!User){
            return res.status(401).json({
                message:"no user found",
                success:false,
            })
        };
        
        const isPasswordMatch = await bcrypt.compare(password,User.password);
        if(!isPasswordMatch){
            return res.status(401).json({
                message:"password incorrect",
                success:false,
            });
        };
        
        const token = await jwt.sign(
        {
            userId:User._id,
            useremail:email,
        },
        process.env.SECRETE_KEY,
        {expiresIn:'1d'});
        
        const populatedPost = await Promise.all(
            User.posts.map(async(postId)=>{
                const posst = await post.findById(postId);
                if(posst?.author?.equals(User._id)){
                    return posst;
                }
                return null;
            })
        )
        User.token = token;
        User.password = undefined;
        User.posts = populatedPost;
        return res.cookie('token',token,{
            httpOnly:true,
            sameSite: "strict",
            maxAge: 1*24*60*60*1000,
        }).json({
            success:true,
            message:"all fine login",
            User,
            populatedPost,
        });
    }catch(error){
        return res.status(401).json({
            message:"problem in login",
            error:error,
            errorMessage:error.message,
        });
    }
};

exports.logout = async(req,res) =>{
    try{
        return res.cookie("token","",{maxAge:0}).json({
            message:'logged out successfully',
            success:true,
        });
    }catch(error){
        return res.status(401).json({
            message:"problem in login out",
            error:error,
            success:false,
            errorMessage:error.message,
        });
    }
};

exports.getProfile = async(req,res) =>{
    try{
        const userId = req.params.id;
        let User = await user.findById(userId).populate({path:"posts",createdAt:-1}).populate('bookmarks').select('-password');
        return res.status(200).json({
            success:true,
            User,
        });
    }catch(error){
        return res.status(401).json({
            message:"problem getProfile",
            error:error,
            success:false,
            errorMessage:error.message,
        });
    }
};

exports.editProfile = async(req,res) =>{
    try{
        const UserId = req.id;
        const {bio,gender} = req.body;
        const profilePicture = req.file;

        let cloudResponse;
        if(profilePicture){
            const fileuri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileuri);
        }
        const User = await user.findById(UserId).select('-password');
        if(!User){
            return res.status(401).json({
                message:"user not found",
                success:false,
            });
        };
        if(bio) User.bio = bio;
        if(gender) User.gender = gender;
        if(profilePicture) User.profilePicture = cloudResponse.secure_url;
        await User.save();
        return res.status(200).json({
            success:true,
            message:"profile updated",
            User,
        });
    }catch(error){
        return res.status(401).json({
            message:"problem in editProfile",
            error:error,
            success:false,
            errorMessage:error.message,
        });
    }
};

exports.getSuggestedUser = async(req,res) =>{
    try{
        const suggestedUsers = await user.find({_id:{$ne:req.id}}).select("-passward");
        if(!suggestedUsers){
            if(!user){
                return res.status(401).json({
                    message:"not another users found",
                    success:false,
                });
            };
        }
        return res.status(200).json({
            success:true,
            message:"profiles found",
            users:suggestedUsers,
        }); 
    }catch(error){
        return res.status(401).json({
            message:"problem in getsuggestion",
            error:error,
            success:false,
            errorMessage:error.message,
        });
    }
};

exports.followOrUnnfollow = async(req,res) =>{
    try{
        const followKarneWala = req.id;
        const jiskoFollowKarunga = req.params.id;
        if(followKarneWala === jiskoFollowKarunga){
            return res.status(401).json({
                message:"you cannot follow yourself",
                success:false,
            });
        };
        if (!mongoose.Types.ObjectId.isValid(jiskoFollowKarunga)) {
            return res.status(400).json({
                message: "Invalid user ID format",
                success: false,
            });
        }

        const User = await user.findById(followKarneWala);
        const targetUser = await user.findById(jiskoFollowKarunga);
        if(!User || !targetUser){
            return res.status(401).json({
                message:"user not found",
                success:false,
            });
        };
        const isfollowing = User.following.includes(jiskoFollowKarunga);
        if(isfollowing){
            // unfollow
            await Promise.all(
                [
                user.updateOne({_id:followKarneWala},{$pull:{following:jiskoFollowKarunga}}),
                user.updateOne({_id:jiskoFollowKarunga},{$pull:{followers:followKarneWala}})]
            );
            return res.status(200).json({
                message:"unfollow success",
            });
        }else{
            // follow
            await Promise.all(
                [user.updateOne({_id:followKarneWala},{$push:{following:jiskoFollowKarunga}}),
                user.updateOne({_id:jiskoFollowKarunga},{$push:{followers:followKarneWala}})]
            );
            return res.status(200).json({
                message:"follow success",
            });
        }
    }catch(error){
        return res.status(401).json({
            message:"problem in followunfollow",
            error:error,
            success:false,
            errorMessage:error.message,
        });
    }
};
