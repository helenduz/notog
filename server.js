import express from "express";
const app = express();

import * as dotenv from "dotenv";
dotenv.config();

import { StatusCodes } from "http-status-codes";

// middlewares
app.use(express.json());

// Google OAuth setups and routes
import { google } from "googleapis";
const SCOPE = ["https://www.googleapis.com/auth/documents"];
const googleOAuth2Client = new google.auth.OAuth2(
    process.env.G_CLIENT_ID, // Client ID
    process.env.G_CLIENT_SECRET, // Client Secret
    process.env.G_REDIRECT_URL // Redirect URL after authentication
);

app.get("/getGoogleAuthURL", (req, res) => {
    const authURL = googleOAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPE,
    });
    res.status(StatusCodes.OK).json({ authURL });
});

app.post("/getGoogleToken", (req, res) => {
    if (req.body.code == null)
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid Request");
    googleOAuth2Client.getToken(req.body.code, (err, token) => {
        if (err) {
            console.error("Error retrieving Google access token: ", err);
            return res.status(StatusCodes.BAD_REQUEST);
        }
        console.log(token);
        res.status(StatusCodes.OK).json({ token });
    });
});

// Notion OAuth routes
app.get("/getNotionAuthURL", (req, res) => {
    res.status(StatusCodes.OK).json({ authURL: process.env.N_AUTH_URL });
});

app.post("/getNotionToken", async (req, res) => {
    if (req.body.code == null)
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid Request");

    // encode client ID and secret in base 64
    const encoded = Buffer.from(
        `${process.env.N_CLIENT_ID}:${process.env.N_CLIENT_SECRET}`
    ).toString("base64");

    try {
        var response = await fetch("https://api.notion.com/v1/oauth/token", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Basic ${encoded}`,
            },
            body: JSON.stringify({
                grant_type: "authorization_code",
                code: req.body.code, // @@ need to be a string
                redirect_uri: process.env.N_REDIRECT_URL,
            }),
        });
        response = await response.json();
        console.log(response);

        // error when exchanging for token
        if (response.error != null) {
            console.log(
                "Error retrieving Notion access token: ",
                response.error
            );
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: response.error });
        }

        // success
        res.status(StatusCodes.OK).json({ token: response.access_token });
    } catch (error) {
        console.error("Error retrieving Notion access token: ", error);
        return res.status(StatusCodes.BAD_REQUEST).json({ error });
    }
});


// Translation routes

const port = process.env.PORT || 5000;
const start = async () => {
    app.listen(port, () => {
        console.log(`Hello there! I'm running on port ${port}!`);
    });
};

start();

export { googleOAuth2Client }; // note: should just change this to a parameter passed to functions that calls the APIs