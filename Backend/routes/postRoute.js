const express = require('express');
const router = express.Router();
const upload = require('../Middlewares/multer');
const {isauth} = require('../Middlewares/Auth');
const {addNewPost,getAllPost,getUserPost,likePost,disLikePost,addComment,getCommentOfPost,deletePost,bookMarkPost} = require("../controllers/Post");


router.route("/addpost").post(isauth,upload.single('image'),addNewPost);
router.route("/all").get(isauth,getAllPost);
router.route("/userpost/all").get(isauth,getUserPost);
router.route("/:id/like").post(isauth,likePost);
router.route("/:id/dislike").post(isauth,disLikePost);
router.route("/:id/comment").post(isauth,addComment);
router.route("/:id/comment/all").post(isauth,getCommentOfPost);
router.route("/delete/:id").delete(isauth,deletePost);
router.route("/:id/bookmark").get(isauth,bookMarkPost);


module.exports = router;