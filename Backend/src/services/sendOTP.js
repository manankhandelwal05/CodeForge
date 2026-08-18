const { transporter } = require("../config/mail.js");

const sendOTP = async(email,otp)=>{

    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:"CodeForge OTP Verification",
        html:`
            <h2>CodeForge Verification</h2>
            <p>Your OTP is</p>
            <h1>${otp}</h1>
            <p>Expires in 5 minutes.</p>
        `
    });

}

module.exports = { sendOTP, sendOTPEmail: sendOTP };