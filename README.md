# notog 📚

✨ Automatically transfer your **Notion** pages into **Google Docs**! ✨

(notog = **No**tion **to** **G**oogle Docs)

You log into your Notion and Google accounts, and enter a Notion page ID. Then, notog grabs your notes from Notion using the Notion API, translates, and uploads your notes to a Google Doc using the Google Docs API.

_Let's support data portability!_ It's a [GDPR right](https://gdpr-info.eu/art-20-gdpr/) 👮‍♀️. We don't want to be stuck with one service just because it's too hard to switch. However, direct transfer is challenging. Services often have incompatible data scopes and models. Without close collaboration between the source and destination services, or the development of common frameworks/protocols, third-party apps like notog are here to be the temporary bridge. But we're inherently limited - notog is closely coupled with the Notion and Google Docs APIs, which means there will be incompatibilities, and the maintenance cost is also high 💸.

## Supported Notion Block Types
* Paragraph
* All headings
* Image

## Build and Run Guide
This is an ongoing project - at the moment, we have not yet deployed it anywhere. Before running the program, you will need to (1) create a public integration with your Notion account; (2) get Google APIs credentials for your app.

▶️ For (1), follow [Notion's guide](https://www.notion.so/help/create-integrations-with-the-notion-api#create-a-public-integration) on how to create public integrations. It's pretty straightforward!

▶️ For (2), follow [Google's guide](https://developers.google.com/identity/protocols/oauth2/web-server#prerequisites) and finish the steps in "Enable APIs for your project" and "Create authorization credentials" only.

If they asked for redirect URLs, you can use `http://localhost:3000`. After you have done both, add a `.env` file with the following fields, which you should have obtained from the two steps above.
```
G_CLIENT_ID=your_google_client_id
G_CLIENT_SECRET=your_google_client_secret
G_REDIRECT_URL=http://localhost:3000

N_CLIENT_ID=your_notion_client_id
N_CLIENT_SECRET=your_notion_client_secret
N_REDIRECT_URL=http://localhost:3000
N_AUTH_URL=your_notion_auth_url
```

1. Ensure you have npm and NodeJS installed. Currently, Notog uses NodeJS v21.
2. Run `npm install` in both the root directory and the /client directory.
3. In the root directory, run `npm run start`.
4. Navigate to `localhost:3000` to view the UI, log into your Notion and Google accounts, then enter a Notion page ID (the last part of the URL of a Notion page), and click "start transfer" to view the result!✨
