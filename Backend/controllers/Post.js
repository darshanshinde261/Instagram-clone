const sharp = require("sharp");
const post = require("../models/postModel");
const user = require("../models/userModel");
const {getReceiverSocketId} = require('../Socket/socket')
const {io} = require('../Socket/socket')
const cloudinary = require("../Utils/cloudConnect");
const comment = require("../models/commentModel");

exports.addNewPost = async(req,res)=>{
    try{
        const {caption} = req.body;
        const image = req.file;
        const autherId = req.id;
        if(!image){
            return res.status(401).json({
                success:false,
                message:"image not receive",
            });
        };
        // image upload
        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width:800,height:800,fit:'inside'})
        .toFormat('jpeg',{quality:80})
        .toBuffer();
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const Post = await post.create({
            caption,
            image:cloudResponse.secure_url,
            author:autherId,
        });
        const User = await user.findById(autherId);
        if(User){
            User.posts.push(Post._id);
            await User.save();
        };

        await Post.populate({path:'author',select:'-password'});

        return res.status(200).json({
            success:true,
            message:"added new posted",
            Post,
        });
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"problem in addpost",
        });
    };
};

exports.getAllPost = async(req,res) => {
    try{
        const posts = await post.find().sort({createdAt:-1})
        .populate({path:'author',select:'username profilePicture'})
        .populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username profilePicture',
            }
        });
        return res.status(200).json({
            posts,
            success:true,
            message:"get All post Success"
        });
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"problem in addpost",
        });
    };
};

exports.getUserPost = async(req,res) => {
    try{
        const authorId = req.id;
        const posts = await post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username,profilePicture',
        }).populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username,profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success:true,
            message:"get user post Success",
        });
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"problem in addpost",
        });
    }
};

exports.likePost = async(req,res) =>{
    try{
        const likeKarneValeUserKiId = req.id;
        const postId = req.params.id;
        const Post = await post.findById(postId);
        if(!Post){
            return res.status(401).json({
                success:false,
                message:"post to like not found",
            });
        };
        // like logic started
        await Post.updateOne({$addToSet:{likes:likeKarneValeUserKiId}});
        await Post.save();
        // implement socketio
        const User = await user.findById(likeKarneValeUserKiId).select('username profilePicture');
        const postOwnerId = Post.author.toString();
        if(postOwnerId !== likeKarneValeUserKiId){
            const notification ={
                type:"like",
                userId : likeKarneValeUserKiId,
                userDetails:User,
                postId,
                message:"your post was liked",
                text:"liked your post",
            }
            
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }
        return res.status(200).json({
            message:'post liked',
            success:true,
        })

    }catch(error){
        return res.status(401).json({
            success:false,
            message:"problem in addpost",
            error:error,
        });
    }
};

exports.disLikePost = async(req,res) =>{
    try{
        const likeKarneValeUserKiId = req.id;
        const postId = req.params.id;
        const Post = await post.findById(postId);
        if(!Post){
            return res.status(401).json({
                success:false,
                message:"post to dislike not found",
            });
        };
        // like logic started
        await Post.updateOne({$pull:{likes:likeKarneValeUserKiId}});
        await Post.save();
        // implement socketio
        const User = await user.findById(likeKarneValeUserKiId).select('username profilePicture');
        const postOwnerId = Post.author.toString();
        if(postOwnerId !== likeKarneValeUserKiId){
            const notification = {
                type:"dislike",
                userId : likeKarneValeUserKiId,
                userDetails:User,
                postId,
                message:"your post was disliked",
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification)
        }
        return res.status(200).json({
            message:'post disLiked',
            success:true,
        });

    }catch(error){
        return res.status(401).json({
            success:false,
            message:"problem in addpost",
        });
    }
};

exports.addComment = async (req,res) => {
    try{
        const postId = req.params.id;
        const userId = req.id;
        const {text} = req.body;
        const Post = await post.findById(postId);
        
        if(!text){
            return res.status(401).json({
                success:false,
                message:'Something went wrong',
            })
        }
        const Comment = await comment.create({
            text,
            author:userId,
            post:postId,
        })
        await Comment.populate({
            path:'author',
            select:"username profilePicture"
        });
        Post.comments.push(Comment._id);
        
        const User = await user.findById(userId).select('username profilePicture');
        const postOwnerId = Post.author.toString();
        if(postOwnerId !== User){
            
            const notification = {
                type:"comment",
                userId : User._id,
                userDetails:User,
                postId,
                message:"your post has new comment",
                text:"Commented on post",
            }
            
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }
        
        await Post.save();
        return res.status(201).json({
            success:true,
            message:"comment Added",
            Comment,
        });
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"problem in addComment",
        });
    };
};

exports.getCommentOfPost = async(req,res) =>{
    try{
        const {postId} = req.params.id;
        const comments = await comment.find({post:postId}).populate('author','username','profilePicture');
        if(!comments){
            return res.status(404).json({message:'No comments found for this post',success:false});
        }
        return res.status(200).json({
            success:true,
            message:"commments fetch",
            comments,
        });
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"problem in getAllComments",
        });
    }
};

exports.deletePost = async(req,res) =>{
    try{
        const postId = req.params.id;
        const authorId = req.id;
        const Post = await post.findById(postId);
        if(!Post){
            return res.status(404).json({message:'post not found to delete',success:false});
        };
        // if(post.author.toString() !== authorId){
        //     return res.status(403).json({message:"unathorized"});
        // };

        await post.findByIdAndDelete(postId);
        let User = await user.findById(authorId);
        User.posts = User.posts.filter((id)=> id.toString !== postId);
        await User.save();
        await comment.deleteMany({post:postId});
        return res.status(201).json({
            success:true,
            message:"all clear post delete",
        });
    }catch(error){
        return res.status(404).json({message:'error post deleting',success:false,errormessage:error.message});
    }
};

exports.bookMarkPost = async(req,res) =>{
    try{
        const postId = req.params.id;
        const authorId = req.id;
        const Post = await post.findById(postId);
        if(!Post){
            return res.status(404).json({message:'No post found',success:false});
        };
        const User = await user.findById(authorId);
        if(!User){
            return res.status(404).json({message:'No comments found for this post',success:false});
        };
        
        if(User.bookmarks.includes(Post._id)){
            
            // already saved
            await User.updateOne({$pull:{bookmarks:Post._id}});
            
            
            return res.status(201).json({
                success:true,
                message:"Post removed from saved",
                type:"unsaved",
            });
        }
        else{
            
            await User.updateOne({$push:{bookmarks:Post._id}});
            
            
            
            return res.status(201).json({
                success:true,
                message:"Post Added saved",
                type:"saved",
            });
        }
    }catch(error){
        return res.status(404).json({message:'No comments found for this post',success:false});
    }
};