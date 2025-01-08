const nodemailer = require("nodemailer");

const sendEmaiForVerfication = async (to, subject, verificationCode) => {
  try {
    // Create a transporter using Gmail as the service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // HTML email content with styles
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f7fc;
                color: #333;
                padding: 20px;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #4CAF50;
                text-align: center;
              }
              p {
                font-size: 16px;
                line-height: 1.6;
              }
              .verification-code {
                font-size: 24px;
                font-weight: bold;
                color: #e91e63;
                background-color: #fce4ec;
                padding: 12px;
                border-radius: 5px;
                text-align: center;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 14px;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Email Verification</h1>
              <p>Hello,</p>
              <p>Thank you for signing up with us! To complete your registration, please verify your email by using the verification code below:</p>
              <div class="verification-code">${verificationCode}</div>
              <p>This code is valid for the next 15 minutes.</p>
              <div class="footer">
                <p>If you did not request this, please ignore this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};
const sendVerificationSuccessEmail = async (to) => {
  try {
    console.log("Sending verification success email to:", to);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // HTML email content for successful verification
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject: "Your Email Has Been Verified Successfully",
      html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f7fc;
                  color: #333;
                  padding: 20px;
                }
                .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 30px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #4CAF50;
                  text-align: center;
                }
                p {
                  font-size: 16px;
                  line-height: 1.6;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  font-size: 14px;
                  color: #777;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Email Verification Successful</h1>
                <p>Hello,</p>
                <p>Your email has been successfully verified! Your account is now active and ready to use.</p>
                <p>You can now log in and explore all the features of our platform.</p>
                <div class="footer">
                  <p>If you have any questions, feel free to reach out to us!</p>
                </div>
              </div>
            </body>
          </html>
        `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Verification success email sent successfully.");
  } catch (error) {
    console.log("Error sending verification success email: ", error);
  }
};

module.exports = { sendEmaiForVerfication, sendVerificationSuccessEmail };
