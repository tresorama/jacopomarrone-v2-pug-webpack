require('dotenv').config();
const mailjet = require('node-mailjet');

const API_PUBLIC_KEY = process.env.MAILJET_API_KEY || 'no dev/staging key';
const API_SECRET_KEY = process.env.MAILJET_API_SECRET || 'no dev/staging key';

const email_mailjet_client = mailjet.connect(
  API_PUBLIC_KEY,
  API_SECRET_KEY
);
module.exports = email_mailjet_client;