const axios = require('axios');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const sendEmailAlert = require('./mailer/sendMail');
const statusContents = require('./mailer/statusContents')

dotenv.config();

const DOCUMENT_NUMBER = process.env.DOCUMENT_NUMBER || ''
const BASE_URL = process.env.BASE_URL  || ''
const LANG = process.env.LANG || ''
const MIME = process.env.MIME || ''
const INVIA = process.env.INVIA || ''

if (!DOCUMENT_NUMBER || !BASE_URL || !LANG  || !INVIA) {
  console.error('Please provide all required environment variables.');
  process.exit(1);
}

const url = `${BASE_URL}?lang=${LANG}&mime=${MIME}&pratica=${DOCUMENT_NUMBER}&invia=${INVIA}`;

async function checkDocumentStatus() {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Look for specific elements that indicate the document status
    const statusElement = $('.m-ok strong');

    
    if (statusElement.length > 0) {
      const statusText = statusElement.text().trim();
      console.log('Document status:', statusText);
      
      // You can add more specific checks here based on the actual content
      if (statusText.includes('pronto')) {
        console.log('Your document is ready!');
        sendEmailAlert(statusContents.ready.subject, statusContents.ready.text, { documentNumber: DOCUMENT_NUMBER, link: url, botArmy: '🤖🤖🤖' });
      } else if (statusText.includes('trattazione')) {
        console.log('Your document is still in process.');
        sendEmailAlert(statusContents.inProcess.subject, statusContents.inProcess.text, { documentNumber: DOCUMENT_NUMBER, link: url, botArmy: '🤖🤖🤖' });
      } else {
        console.log('Unable to determine the status.');
        sendEmailAlert(statusContents.unknown.subject, statusContents.unknown.text, { documentNumber: DOCUMENT_NUMBER, link: url, botArmy: '🤖🤖🤖' });
      }
    } else {
      console.log('Unable to determine the status.');
      sendEmailAlert(statusContents.unknown.subject, statusContents.unknown.text, { documentNumber: DOCUMENT_NUMBER, link: url, botArmy: '🤖🤖🤖' });
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    sendEmailAlert(statusContents.unknown.subject, statusContents.unknown.text, { documentNumber: DOCUMENT_NUMBER, link: url, botArmy: '🤖🤖🤖' });
  }
}

checkDocumentStatus();