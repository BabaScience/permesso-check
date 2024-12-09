const nodemailer = require('nodemailer');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

// Read email configuration from environment variables
const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,
  // EMAIL_TO, // No longer needed as we'll read recipients from a JSON file
} = process.env;

// Path to the JSON file containing email addresses
const emailListPath = './mailer/emails.json';

// Initialize an array to hold email addresses
let recipants = [];

// Read and parse the JSON file
try {
  const data = fs.readFileSync(emailListPath, 'utf8');
  // Assuming the JSON file contains an array of email addresses
  // e.g., ["email1@example.com", "email2@example.com"]
  recipants = JSON.parse(data);

} catch (err) {
  console.error(`Error reading email addresses from ${emailListPath}: ${err.message}`);
}

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT == 465, // true for port 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Send an email alert to multiple recipients
 * @param {string} subject  The email subject
 * @param {string} text  The email body
 * @param {object} placeHolderObj  An object containing key-value pairs to replace placeholders in the email subject and body
 * @returns  A promise that resolves when the email is sent
 */
const sendEmailAlert = async (subject, text, placeHolderObj) => {
  for (const {name, email} of recipants) {
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: replaceBrackets(subject, {...placeHolderObj, name, email}),
      html: replaceBrackets(text, {...placeHolderObj, name, email}),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Alert email sent to ${email}: ${info.messageId}`);
    } catch (err) {
      console.error(`Failed to send alert email to ${email}: ${err.message}`);
    }
  }
 
};

/**
 * Replace placeholders in text with values from an object
 * @param {*} text  The text containing placeholders
 * @param {*} obj  The object containing key-value pairs to replace placeholders
 * @returns  The text with placeholders replaced by values
 */
function replaceBrackets(text, obj) { 
  // text can be: "Hello {{name}}, welcome to {{place}}"
  // obj can be: {name: "John", place: "Paris"}
  return text.replace(/{{([^}]+)}}/g, (_, key) => obj[key]);
}


// sendEmailAlert(
//   'Test From Hostinger VPS',
//   'Hello {{name}}, welcome to {{place}}',
//   { name: 'Bamba', place: 'Paris' }
// );

module.exports = sendEmailAlert;