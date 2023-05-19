const jwt = require("jsonwebtoken");
const users = require("../models/User List/userSchema");

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;    //authorization a should be small
        
        const verifytoken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await users.findOne({_id:verifytoken._id});

        if(!rootUser) {throw new Error("user not found")}

        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id

        next();
    } catch (error) {
        return res.status(401).json({status:401,message:"Unauthorized no token provided"})
    }
}

module.exports = authenticate