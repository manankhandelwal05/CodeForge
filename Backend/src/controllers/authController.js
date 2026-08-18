const { generateOTP } = require( "../utils/generateOTP.js");
const redisClient = require ("../config/redis.js");
const { sendOTPEmail } = require( "../services/sendOTP.js");

const jwt = require( "jsonwebtoken");
const User = require( "../models/user.js");
const bcrypt = require("bcrypt");
const validate = require("../utils/validator.js");

const verifyOTPController = async (req, res) => {

    try {

        const { emailId, otp } = req.body;

        const data = await redisClient.get(`signup:${emailId}`);

        if (!data) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or invalid."
            });
        }

        const signupData = JSON.parse(data);

        if (signupData.otp !== otp) {

            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });

        }

        const user = await User.create({

            firstName: signupData.firstName,
            lastName: signupData.lastName,
            emailId: signupData.emailId,
            password: signupData.password, // Pre-hashed password from Redis
            role: "user"

        });

        await redisClient.del(`signup:${emailId}`);

        const token = jwt.sign(
            {
                _id: user._id,
                emailId: user.emailId,
                role: user.role
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            }
        );

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 60 * 60 * 1000
        });

        return res.status(201).json({

            success: true,

            user: {
                _id: user._id,
                firstName: user.firstName,
                emailId: user.emailId,
                role: user.role
            },
            token, // Return token so frontend can set Authorization header/localStorage

            message: "Registration Successful"

        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        });

    }

};

const sendOTPController = async (req, res) => {
    try {

        const {
            firstName,
            lastName,
            emailId,
            password
        } = req.body;

        // 1. Validate data schema and strength
        validate(req.body);

        // 2. Check if user already exists
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email address."
            });
        }

        // 3. Hash password for security before storing in Redis
        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOTP();

        await redisClient.set(
            `signup:${emailId}`,
            JSON.stringify({
                firstName,
                lastName,
                emailId,
                password: hashedPassword,
                otp
            }),
            {
                EX: 300
            }
        );

        await sendOTPEmail(emailId, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully."
        });

    } catch (err) {
        console.error(err);

        return res.status(400).json({
            success: false,
            message: err.message || "Failed to send OTP."
        });
    }
};

module.exports = {
    verifyOTPController,
    sendOTPController
};

