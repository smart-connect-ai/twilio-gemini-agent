# Twilio + Gemini Call Answering Agent

A call answering agent using Twilio's voice API and Google's Gemini 2.0 Flash for natural language processing.

## Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your credentials (see `.env.example`)
4. Start the server: `npm start`

## Configuration

1. Get your Twilio credentials and phone number
2. Obtain a Gemini API key
3. Run ngrok: `ngrok http 3000`
4. Configure Twilio webhook to your ngrok URL + `/voice`

## Features

- Natural language call answering
- Conversation history maintained per call
- Simple to deploy and extend

## Railway.app Deployment

1. Install the Railway CLI:
   ```bash
   npm install -g @railway/cli

2. Login to Railway:
      railway login

3. Link your project:   
      railway link

4. Set environment variables:
      railway env set TWILIO_ACCOUNT_SID=your_account_sid
      railway env set TWILIO_AUTH_TOKEN=your_auth_token
      railway env set GEMINI_API_KEY=your_gemini_api_key
      railway env set PORT=3000

5. Deploy to Railway:
      railway up

6. After deployment, get your Railway app URL and configure it in Twilio:
      railway domain


## How to Deploy to Railway

1. Create your ZIP file with all the updated files
2. Unzip it in your development environment
3. Follow the Railway deployment instructions in the README
4. Remember to:
   - Set all required environment variables in Railway
   - Update your Twilio webhook with the Railway-provided URL
   - The URL will be something like: `https://your-app-name.up.railway.app/voice`

## Important Notes for Railway Deployment

1. Railway will automatically:
   - Detect your Node.js application
   - Install dependencies
   - Run your start script
   - Provide HTTPS endpoint

2. For production use:
   - Consider adding a custom domain
   - Set up monitoring in Railway dashboard
   - Configure automatic deployments from GitHub if needed

Would you like me to make any adjustments to the Railway configuration or add any other platform-specific deployment files (like for Render or Heroku)?
