const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const sgMail = require('@sendgrid/mail');

const { adminEmail, adminPassword, sgAPIKey } = require('../../config');

// Create a Nodemailer transporter using your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: adminEmail, // Your email address
    pass: adminPassword, // Your email password or an App Password for Gmail
  },
});

// Function to send a verification email
async function sendVerificationEmail(toEmail, verificationLink) {
  try {
    // Render the email template using EJS
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, '../templates', 'verification.ejs'), // Adjust the template path
      { verificationLink }
    );

    // Define email options
    const mailOptions = {
      to: toEmail, // Recipient's email address
      from: adminEmail, // Sender's email address
      subject: 'Health Mark: One Plaftform for All',
      html: emailTemplate, // Email content in HTML format
    };

    sgMail.setApiKey(sgAPIKey);
    // send the mail to user
    await sgMail.send(mailOptions);
    return true
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

// Function to send a password reset email
async function sendPasswordResetEmail(toEmail, passwordResetLink) {
  try {
    // Render the email template using EJS
    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, '../templates', 'passwordReset.ejs'), // Adjust the template path
      { passwordResetLink }
    );

    // Define email options
    const mailOptions = {
      to: toEmail, // Recipient's email address
      from: adminEmail, // Sender's email address
      subject: 'Health Mark: One Plaftform for All',
      html: emailTemplate, // Email content in HTML format
    };

    sgMail.setApiKey(sgAPIKey);
    // send the mail to user
    await sgMail.send(mailOptions);
    return true
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
