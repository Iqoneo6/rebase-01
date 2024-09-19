
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const mongoose = require("mongoose");

const twilio = require("twilio");

const app = express();
app.use(express.json());

const path = require("path");
const fs = require("fs");

app.use(
  cors({
    origin: ["https://wizmoney.wizinoa.com"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const port = process.env.PORT || 3005;
const url = process.env.MONGODB_URL;

const mail = process.env.AUTH_MAIL;

const client = twilio(atob(process.env.T_SID), atob(process.env.T_TOKEN));

const { sendReceipt } = require("./emailService");

app.use(express.json());

// Example endpoint to send receipt
app.post("/send-receipt", async (req, res) => {
  const { toEmail, subject, text, htmlContent, receiptFileName } = req.body;

  // Receipt files are stored in a 'receipts' directory
  const receiptPath = path.join(__dirname, "receipts", receiptFileName);

  try {
    console.log("testing");
    await sendReceipt(toEmail, subject, text, htmlContent, receiptPath);
    res
      .status(200)
      .json({ success: true, message: "Receipt sent successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send receipt",
      error: error.message,
    });
  }
});

const emailReceipt = require("./emailService");

const ContributeForm = require("./Router/ContributeForm");
const SignUp = require("./Router/SignUpRouter");
const Mail = require("nodemailer/lib/mailer");
const sendOtp = require("./Controller/ResetPassword");

const MessageRouter = require("./Router/MessageRouter");

app.use("/api/ContributeForm", ContributeForm);

app.use("/api/send-email", emailReceipt);
app.use("/api/send-otp", sendOtp);
app.use("/api", SignUp);

app.use("/api/messager", MessageRouter);

mongoose
  .connect(url)
  .then(() => {
    app.listen(port, () => {
      console.log("Server started");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// app.post('/api/contributeform/normalsms', (req, res) => {
//   const { to, body } = req.body;

//   if (!to || !body) {
//     return res.status(400).send('Missing "to" or "body" parameter.');
//   }

//   let bodyText;

//     const bodyObject = body;
//     bodyText = ` \n\nOrganizer Name: ${bodyObject.organizerName },
//      Date:  ${bodyObject.date },
//      Place:  ${bodyObject.place },
//      FunctionType:  ${bodyObject.functionType },
//      Firstname:  ${bodyObject.fname },
//      Lastname:  ${bodyObject.fname },
//      Number:  ${bodyObject.number },
//      PaymentType:  ${bodyObject.paymentType },
//      Address:  ${bodyObject.address },
//      Place:  ${bodyObject.place },
//       Total:  ${bodyObject.total} ,
//       Visit Our site \n  https://www.wizinoa.com/ \n\n
//       Thank You!
//       `

//       ;

//   client.messages.create({
//     // body: [bodyText,"Thank You","https://www.wizinoa.com/"],
//     body: bodyText,
//     to: to,
//     from: process.env.TWILIO_PHONE_NUMBER
//   })
//   .then((message) => {
//     console.log('Message sent:', message.sid);
//     res.status(200).send(`Message sent: ${message.sid}`);
//   })
//   .catch((error) => {
//     console.error('Error sending message:', error);
//     res.status(500).send('Failed to send SMS.');
//   });
// });

// app.post('/api/contributeform/whatsappmessage', (req, res) => {
//   const { to, body } = req.body;

//   if (!to || !body) {
//     return res.status(400).send('Missing "to" or "body" parameter.');
//   }

//   let bodyText;

//   const bodyObject = body;
//   bodyText = `Organizer Name: ${bodyObject.organizerName}
// Date: ${bodyObject.date}
// Place: ${bodyObject.place}
// Function Type: ${bodyObject.functionType}
// First Name: ${bodyObject.fname}
// Last Name: ${bodyObject.lname}
// Number: ${bodyObject.number}
// Payment Type: ${bodyObject.paymentType}
// Address: ${bodyObject.address}
// Total: ${bodyObject.total}

// Visit Our Site: https://www.wizinoa.com/

// Thank You!`;

//   client.messages.create({
//     body: bodyText,
//     to: `whatsapp:${to}`,
//     from: process.env.TWILIO_WHATSAPP_NUMBER
//   })
//   .then((message) => {
//     console.log('Message sent:', message);
//     res.status(200).send(`Message sent: ${message}`);
//   })
//   .catch((error) => {
//     console.error('Error sending message:', error);
//     res.status(500).send('Failed to send WhatsApp message.');
//   });
// });

// app.post('/api/contributeform/whatsappmessage', async (req, res) => {
//   const { phoneNumber } = req.body;

//   try {
//     const receiver = new Receiver({ phoneNumber });
//     await receiver.save();
//     res.status(200).send('Receiver added successfully');
//   } catch (error) {
//     console.error('Error adding receiver:', error);
//     res.status(500).send(`Error adding receiver: ${error.message}`);
//   }
// });
