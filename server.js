"use strict";
require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const axios = require("axios");
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(express.static("public"));

var PORT = process.env.PORT || 8080;
var ID = process.env.CLIENT_ID;
var SECRET = process.env.CLIENT_SECRET;
var REFRESH_TOKEN = process.env.REFRESH_TOKEN;
// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require("./routes/htmlRoutes")(app);

app.post("/contact", function(req, res) {
  console.log("data from the contact form: ", req.body);
  console.log("clientid:", ID);
  const sendthemail = async () => {
    const oauth2Client = new OAuth2(
      ID,
      SECRET,
      "https://http://localhost:8080/" // Redirect URL
    );

    oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN
    });
    //const tokens = oauth2Client.refreshAccessToken();

    const tokens = await oauth2Client.getAccessToken();

    console.log("token :  ", tokens.token);
    const accessToken = tokens.token;

    let mailOpts, smtpTrans;
    smtpTrans = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "arjunalapsapkota@gmail.com",
        clientId: ID,
        clientSecret: SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,

        expires: 1484314697598
      },
      TLS: {
        rejectUnauthorized: false
      }
    });
    //
    // verify connection configuration
    smtpTrans.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });
    mailOpts = {
      from: req.body.name + " &lt;" + req.body.email + "&gt;",
      to: "arjunalapsapkota@gmail.com",
      subject: "Someone at Nodemailer-Test",
      text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    };
    smtpTrans.sendMail(mailOpts, function(error, response) {
      if (error) {
        res.send("contact-failure");
      } else {
        res.sendStatus(200);
      }
    });
  };
  sendthemail();
});

app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
