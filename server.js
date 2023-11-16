import express from "express";
const app = express();

import * as dotenv from "dotenv";
dotenv.config();

import { StatusCodes } from "http-status-codes";
import { createNewDoc } from "./controllers/gController.js";

// middlewares
app.use(express.json());

// Google OAuth setups and routes
import { google } from "googleapis";
const SCOPE = ["https://www.googleapis.com/auth/documents"];
const oAuth2Client = new google.auth.OAuth2(
    process.env.G_CLIENT_ID, // Client ID
    process.env.G_CLIENT_SECRET, // Client Secret
    process.env.G_REDIRECT_URL // Redirect URL after authentication
);

app.get("/getAuthURL", (req, res) => {
    const authURL = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPE,
    });
    console.log(authURL);
    res.status(StatusCodes.OK).json({ authURL });
});

app.post("/getToken", (req, res) => {
    if (req.body.code == null)
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid Request");
    oAuth2Client.getToken(req.body.code, (err, token) => {
        if (err) {
            console.error("Error retrieving access token", err);
            return res.status(StatusCodes.BAD_REQUEST);
        }
        oAuth2Client.setCredentials(token);
        console.log(token);
        res.status(StatusCodes.OK).json();
    });
});

app.post("/createNewDoc", createNewDoc);

// Notion OAuth routes

// Translation routes

const port = process.env.PORT || 5000;
const start = async () => {
    app.listen(port, () => {
        console.log(`Hello there! I'm running on port ${port}!`);
    });
};

start();
