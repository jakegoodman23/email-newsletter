require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  var jsonData = JSON.stringify(data);

  const url = process.env.API_URL;

  const options = {
    method: "POST",
    auth: process.env.API_KEY,
  };
  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      const respStatus = response.statusCode;

      if (respStatus === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(3000, function () {
  console.log("Server is listening on port 3000");
});
