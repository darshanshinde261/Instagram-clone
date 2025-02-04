const express = require('express');
const { sendMessage, getMessage, deleteMessages } = require('../controllers/Message');
const router = express.Router();
const {isauth} = require("../Middlewares/Auth");


router.route('/send/:id').post(isauth,sendMessage);
router.route('/all/:id').get(isauth,getMessage);
router.route('/deleteall/:id').delete(isauth,deleteMessages);

module.exports = router;