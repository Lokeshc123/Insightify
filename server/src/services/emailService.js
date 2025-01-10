const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    // Create a transporter using Gmail as the service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Generic mail options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      html: htmlContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};

// Predefined email templates
const emailTemplates = {
  verificationEmail: (verificationCode) => `
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
  verificationSuccessEmail: () => `
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
  passwordResetTokenEmail: (resetToken) => `
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
        .reset-token {
          font-size: 24px;
          font-weight: bold;
          color: #e91e63;
          background-color: #fce4ec;
          padding: 12px;
          border-radius: 5px;
          text-align: center;
          margin: 20px 0;
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
        <h1>Password Reset Request</h1>
        <p>Hello,</p>
        <p>We received a request to reset your password. Please use the token below to reset your password:</p>
        <div class="reset-token">${resetToken}</div>
        <p>This token is valid for the next 15 minutes. If you did not request this, please ignore this email.</p>
        <div class="footer">
          <p>If you have any questions, feel free to contact our support team.</p>
        </div>
      </div>
    </body>
  </html>
`,
  passwordResetSuccessfulEmail: () => `
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
          .action-button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
            text-align: center;
          }
          .action-button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Password Reset Successful</h1>
          <p>Hello,</p>
          <p>Your password has been successfully reset. You can now log in to your account with your new password.</p>
          <p>If you did not perform this action, please contact our support team immediately.</p>
         
          <div class="footer">
            <p>Thank you for using our services. If you have any questions, feel free to reach out to us.</p>
          </div>
        </div>
      </body>
    </html>
  `,
  passwordChangeSuccessfulEmail: () => `
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
          .action-button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
            text-align: center;
          }
          .action-button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Password Reset Successful</h1>
          <p>Hello,</p>
          <p>Your password has been successfully changed. You can now log in to your account with your new password.</p>
          <p>If you did not perform this action, please contact our support team immediately.</p>
      
          <div class="footer">
            <p>Thank you for using our services. If you have any questions, feel free to reach out to us.</p>
          </div>
        </div>
      </body>
    </html>
  `,
};

module.exports = { sendEmail, emailTemplates };
