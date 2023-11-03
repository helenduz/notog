import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();

// set up static assets path
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

// Notion SDK for JavaScript
import { Client } from "@notionhq/client"
const notion = new Client({ auth: process.env.NOTION_KEY });

// <http://expressjs.com/en/starter/static-files.html>
app.use(express.static(path.resolve(__dirname, "./client/public")));

// <http://expressjs.com/en/starter/basic-routing.html>
app.get("/", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./client/views/client.html"));
});

app.post("/databases", async function (request, response) {
    const pageId = process.env.NOTION_PAGE_ID;
    const title = request.body.dbName;

    try {
        // Notion API request!
        const newDb = await notion.databases.create({
            parent: {
                type: "page_id",
                page_id: pageId,
            },
            title: [
                {
                    type: "text",
                    text: {
                        content: title,
                    },
                },
            ],
            properties: {
                Name: {
                    title: {},
                },
            },
        });
        response.json({ message: "success!", data: newDb });
    } catch (error) {
        response.json({ message: "error", error });
    }
});


// listen for requests
const listener = app.listen(process.env.PORT, function () {
    console.log("Your app is listening on port " + listener.address().port);
});