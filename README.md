# HeyGen Interactive Avatar NextJS Demo

![HeyGen Interactive Avatar NextJS Demo Screenshot](./public/demo.png)

This is a sample project and was bootstrapped using [NextJS](https://nextjs.org/).
Feel free to play around with the existing code and please leave any feedback for the SDK [here](https://github.com/HeyGen-Official/StreamingAvatarSDK/discussions).

## Getting Started FAQ

### Setting up the demo

1. Clone this repo

2. Navigate to the repo folder in your terminal

3. Run `npm install` (assuming you have npm installed. If not, please follow these instructions: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)

4. Create a `.env` file in the root directory with the following content:
   ```
   HEYGEN_API_KEY=your_heygen_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Enter your HeyGen Enterprise API Token in the `.env` file. Replace `HEYGEN_API_KEY` with your API key. This will allow the Client app to generate secure Access Tokens with which to create interactive sessions.

   You can retrieve either the API Key by logging in to HeyGen and navigating to this page in your settings: [https://app.heygen.com/settings?from=&nav=Subscriptions%20%26%20API]. 

6. **Required for RAG functionality**: Enter your OpenAI API Key in the `.env` file. Replace `OPENAI_API_KEY` with your API key. This is required for the PDF upload and RAG (Retrieval-Augmented Generation) features using `text-embedding-3-small` embeddings.

7. Run `npm run dev`

### Starting sessions

NOTE: Make sure you have enter your token into the `.env` file and run `npm run dev`.

To start your 'session' with a Interactive Avatar, first click the 'start' button. If your HeyGen API key is entered into the Server's .env file, then you should see our demo Interactive Avatar appear.

If you want to see a different Avatar or try a different voice, you can close the session and enter the IDs and then 'start' the session again. Please see below for information on where to retrieve different Avatar and voice IDs that you can use.

### Which Avatars can I use with this project?

By default, there are several Public Avatars that can be used in Interactive Avatar. (AKA Interactive Avatars.) You can find the Avatar IDs for these Public Avatars by navigating to [labs.heygen.com/interactive-avatar](https://labs.heygen.com/interactive-avatar) and clicking 'Select Avatar' and copying the avatar id.

You can create your own custom Interactive Avatars at labs.heygen.com/interactive-avatar by clicking 'create interactive avatar' on the top-left of the screen.

### Where can I read more about enterprise-level usage of the Interactive Avatar API?

Please read our Interactive Avatar 101 article for more information on pricing: https://help.heygen.com/en/articles/9182113-interactive-avatar-101-your-ultimate-guide

## PDF Knowledge Base Feature

This demo allows you to upload PDF documents and have the Interactive Avatar answer questions based on the content using **HeyGen's Knowledge Base API**.

### How it works:

1. **Upload a PDF**: Click "Upload PDF Knowledge Base" and select your PDF file

2. **Text Extraction**: OpenAI's Assistants API extracts all text from the PDF

3. **Knowledge Base Creation**: The extracted text is sent to HeyGen's Knowledge Base API, which creates a knowledge base

4. **Avatar Configuration**: The Knowledge Base ID is automatically added to your avatar configuration

5. **Intelligent Responses**: The avatar uses HeyGen's built-in RAG system to answer questions about your PDF!

### Using the Feature:

1. Make sure you have set both `HEYGEN_API_KEY` and `OPENAI_API_KEY` in the `.env` file
2. Start the development server with `npm run dev`
3. In the Avatar Configuration panel, click "Upload PDF Knowledge Base"
4. Select a PDF file from your computer
5. Wait for the processing to complete (you'll see a success message)
6. Start a voice or text chat session
7. Ask questions related to the content of your PDF!

### Technical Details:

- **PDF Processing**: OpenAI Assistants API with file_search
- **Knowledge Base**: HeyGen's native Knowledge Base API
- **Works with**: Both voice chat and text chat
- **Persistence**: Knowledge bases persist in HeyGen (not lost on restart)

### Benefits:

✅ Works perfectly with voice chat (no timing issues)
✅ Simple and reliable
✅ Uses HeyGen's optimized infrastructure
✅ Knowledge bases persist across server restarts
✅ Minimal code and maintenance
