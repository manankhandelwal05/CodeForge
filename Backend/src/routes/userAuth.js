const express = require('express');

const authRouter =  express.Router();
const {login,logout, adminRegister,deleteProfile, googleLogin} = require('../controllers/userAuthent')
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');
const {
    sendOTPController,
    verifyOTPController
} = require( "../controllers/authController.js");

// Register
authRouter.post('/register', verifyOTPController);
authRouter.post('/login', login);
authRouter.post("/google-login", googleLogin); 
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware ,adminRegister);
// authRouter.get('/getProfile',getProfile);
authRouter.delete('/deleteProfile',userMiddleware, deleteProfile);
authRouter.get('/check',userMiddleware,(req,res)=>{
    const reply ={
        firstName:req.user.firstName,
        emailId:req.user.emailId,
        _id:req.user._id,
        role:req.user.role
    }
    res.status(200).json({
        user:reply,
        message:"Valid user"
    })
})
authRouter.post("/send-otp", sendOTPController);

authRouter.post("/verify-otp", verifyOTPController);


module.exports = authRouter;

// login
// logout
// GetProfile

