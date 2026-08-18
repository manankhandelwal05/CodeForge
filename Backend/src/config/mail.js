// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// module.exports = { transporter };

const emailjs = require("@emailjs/nodejs");

const sendEmail = async (templateParams) => {
    return await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        templateParams,
        {
            publicKey: process.env.EMAILJS_PUBLIC_KEY,
            privateKey: process.env.EMAILJS_PRIVATE_KEY
        }
    );
};

module.exports = { sendEmail };