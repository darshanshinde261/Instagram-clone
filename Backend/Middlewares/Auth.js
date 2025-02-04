const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.isauth = async(req,res,next) => {
    try{
        const token = req.cookies.token ;
        if(!token){
            return res.status(400).json({
                message:"User Not authenticated",
                success:false,
            });
        };
        
        const decode = await jwt.verify(token,process.env.SECRETE_KEY);
        if(!decode){
            return res.status(401).json({
                message:"invalid token",
                success:false,
            });
        };
        req.id = decode.userId;
        next();
    }catch(error){
        console.log(error);
    }
}