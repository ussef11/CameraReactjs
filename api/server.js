const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();

const port = process.env.port || 5000;

var corsOptions = {
  origin: "https://www.iptv-store.one",
 
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.json());




const nodemailer = require('nodemailer');

// Replace these with your Gmail credentials
const gmailEmail = 'ussefbelkhiraoui@gmail.com';
const gmailPassword = 'youssef@123AB';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const sendEmail = (toEmail, subject, text) => {
  const mailOptions = {
    from: gmailEmail,
    to: toEmail,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Example usage:



const sendemail = (req, res) => {
    try {
      sendEmail('youssefkhiraoui15@gmail.com', 'Test Email', 'This is a test email sent from Node.js using Gmail SMTP.', (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ message: 'Failed to send email' });
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Email sent successfully' });
        }
      });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email' });
    }
  };
  
      
     


app.use("/", sendemail);






app.listen(port, () => {
    console.log(`Server is running in Port :${port}`);
  });
  