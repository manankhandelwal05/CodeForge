const redisClient = require("../config/redis");
const User =  require("../models/user")
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {OAuth2Client}=require("google-auth-library");

const client =new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const register = async (req,res)=>{
    
    try{
         console.log(req.body);  // Log the request body for debugging
        // validate the data;
      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
      req.body.role = 'user'
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:'user'},process.env.JWT_KEY,{expiresIn: 60*60});
     const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 60 * 60 * 1000
});
     res.status(201).json({
    user: {
        _id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
        role: user.role
    },
    message: "User Registered Successfully"
});
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}


const login = async (req,res)=>{

    try{
        const {emailId, password} = req.body;

        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailId});
        
        if (!user) {
    throw new Error("Invalid Credentials");
}
        if (user.authProvider === "google") {
    return res.status(400).json({
        message: "This account uses Google Sign-In. Please continue with Google."
    });
}
        const match = await bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Invalid Credentials");

        const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 60 * 60 * 1000
});
        res.status(200).json({
    user: {
        _id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
        role: user.role
    },
    token,
    message: "Logged In Successfully"
});
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}


// logOut feature

const logout = async(req,res)=>{

    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);
    //    Token add kar dung Redis ke blockList
    //    Cookies ko clear kar dena.....

    const isProduction = process.env.NODE_ENV === "production";

res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax"
});

res.send("Logged Out Successfully");
    res.send("Logged Out Succesfully");

    }
    catch(err){
       res.status(503).send("Error: "+err);
    }
}


const adminRegister = async(req,res)=>{
    try{
        // validate the data;
    //   if(req.result.role!='admin')
    //     throw new Error("Invalid Credentials");  
      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
     const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 60 * 60 * 1000
});
    res.status(201).json({ message: "User Registered Successfully", token });
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const deleteProfile = async(req,res)=>{
  try{
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);

    await submission.deleteMany(userId);
    res.status(200).send("User and Submissions deleted successfully");
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
});

        const payload = ticket.getPayload();

if (!payload.email_verified) {
    return res.status(401).json({
        message: "Google email is not verified."
    });
}
        let user = await User.findOne({
    emailId: payload.email
});

if (!user) {
    const names = payload.name.trim().split(" ");

const firstName = names[0];
const lastName = names.slice(1).join(" ");
    user = await User.create({
        firstName: firstName,
        lastName: lastName,
        emailId: payload.email,
        authProvider: "google",
        profilePicture: payload.picture
    });

}
const token = jwt.sign(
    {
        _id: user._id,
        emailId: user.emailId,
        role: user.role
    },
    process.env.JWT_KEY,
    { expiresIn: 60 * 60 }
);

res.cookie("token", token, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
});

res.status(200).json({
    user: {
        _id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
        role: user.role
    },
    token,
    message: "Logged In Successfully"
});
    } catch (err) {
        res.status(401).send("Error: " + err);
    }
}

module.exports = {register, login,logout,adminRegister,deleteProfile, googleLogin};