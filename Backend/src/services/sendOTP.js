// const { transporter } = require("../config/mail.js");
const { sendEmail } = require("../config/mail.js");

const sendOTP = async (email, otp) => {
    try {
        const response = await sendEmail({
            to_email: email,
            otp: otp
        });

        console.log("OTP email sent successfully:", response);
    } catch (error) {
        console.error("EmailJS error:", error);
        throw new Error("Failed to send OTP");
    }
};

module.exports = {
    sendOTP,
    sendOTPEmail: sendOTP
};