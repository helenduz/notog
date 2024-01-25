import { StatusCodes } from "http-status-codes";
import { Client } from "@notionhq/client";
import { google } from "googleapis";
import { translatorMap } from "../translation/translatorMap.js";
import { unsupportedHanlder } from "../translation/unsupported.js";

// @@ should have notionToken and googleToken in req body (checked by checkAuth middleware)
const transfer = async (req, res) => {
    if (req.body.pageId == null)
        return res.status(StatusCodes.BAD_REQUEST).send("Invalid Request");

    // create notion client with provided token
    const notionClient = new Client({ auth: req.body.notionToken });

    // retrive blocks from notion page
    const pageId = req.body.pageId;
    const notionResponse = await notionClient.blocks.children.list({
        block_id: pageId,
        page_size: 50,
    });
    console.log(notionResponse);

    // create google client with provided token
    const googleClient = getGoogleClient();
    googleClient.setCredentials(req.body.googleToken);
    const docs = google.docs({ version: "v1", auth: googleClient });

    // create new google doc
    const title = await getNotionPageTitle({
        pageId,
        notionClient,
    });
    const createResponse = await docs.documents.create({
        requestBody: {
            title: title,
        },
    });
    console.log(createResponse.data);
    const documentId = createResponse.data.documentId;

    // form batch requests for google API
    const batchRequests = await formGoogleBatchUpdateRequest(
        notionResponse.results
    );

    // call google API for building doc
    // @@ handle failure and retries
    const batchUpdateResponse = await docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: {
            requests: batchRequests,
        },
    });
    console.log(batchUpdateResponse);

    // return document url
    res.status(StatusCodes.OK).json({
        docURL: `https://docs.google.com/document/d/${documentId}/edit`,
    });
};

// returns request object
const formGoogleBatchUpdateRequest = async (pageBlocks) => {
    const reversedPageBlocks = pageBlocks.slice().reverse();
    var requests = [];
    for (let i = 0; i < reversedPageBlocks.length; i++) {
        // identify type and call corresponding translator and get requests for this block
        const block = reversedPageBlocks[i];
        const blockType = block.type;
        const translator = translatorMap[blockType];
        if (translator) {
            // note: one block will have multiple requests (separating insert plain text & styling text, as well as seperating text with different styles)
            const requestsForBlock = await translator(block);
            requests.push(...requestsForBlock);
        } else {
            const requestsForBlock = unsupportedHanlder(block);
            requests.push(...requestsForBlock);
        }
    }
    return requests;
};

const getGoogleClient = () => {
    const googleOAuth2Client = new google.auth.OAuth2(
        process.env.G_CLIENT_ID, // Client ID
        process.env.G_CLIENT_SECRET, // Client Secret
        process.env.G_REDIRECT_URL // Redirect URL after authentication
    );
    return googleOAuth2Client;
};

const getNotionPageTitle = async ({ pageId, notionClient }) => {
    // @@ handle case where parent object is a database
    const response = await notionClient.pages.retrieve({ page_id: pageId });
    // not sure why title is a rich text array (1. user cannot add style there 2. there is always just one span)
    const richTextArray = response.properties.title.title;
    return richTextArray[0].plain_text;
};

export { transfer };
