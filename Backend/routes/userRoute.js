const express = require('express');
const router = express.Router();
const upload = require('../Middlewares/multer');
const {register,login,logout, editProfile,getProfile, getSuggestedUser, followOrUnnfollow} = require("../controllers/User");
const {isauth} = require('../Middlewares/Auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isauth,getProfile);
router.route('/profile/edit').post(isauth,upload.single('profilePicture'),editProfile);
router.route('/suggested').get(isauth,getSuggestedUser);
router.route('/followorunfollow/:id').post(isauth,followOrUnnfollow);

module.exports = router;