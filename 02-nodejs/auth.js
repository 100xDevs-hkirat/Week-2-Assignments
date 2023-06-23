const Jwt = require("jsonwebtoken");

const path = require("path");

const dotenvAbsolutePath = path.join(__dirname, '.env');

const dotenv = require("dotenv").config({path: dotenvAbsolutePath});

const verifyToken = (req, res, next) =>{

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let jwtHeaderKey = process.env.TOKEN_HEADER_KEY;

    const token = req.headers[jwtHeaderKey];

    if(!token){
        return res.status(403).send("a token is required for authentication!!!");   
    }
    try{
        const decode = Jwt.verify(token,jwtSecretKey);
        req.user=decode;
    }catch(err){
        return res.status(401).send("invalid token");
    }
    return next();
};

module.exports = verifyToken;