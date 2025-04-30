require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const twilio = require('twilio');

const app = express();
app.use(express.urlencoded({ extended: false }));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Twilio
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Store conversation history
const conversations = {};

// Twilio webhook handler
app.post('/voice', async (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  const callSid = req.body.CallSid;
  
  // Initialize conversation if new call
  if (!conversations[callSid]) {
    conversations[callSid] = {
      history: [],
      context: "You are a helpful call center agent. Respond concisely and professionally."
    };
  }

  if (req.body.SpeechResult) {
    try {
      const userInput = req.body.SpeechResult;
      conversations[callSid].history.push({ role: 'user', parts: userInput });
      
      // Build prompt with conversation history
      const prompt = buildPrompt(conversations[callSid]);
      const result = await processWithGemini(prompt);
      
      // Store response in history
      conversations[callSid].history.push({ role: 'model', parts: result });
      
      // Respond to caller
      twiml.say({ voice: 'woman' }, result);
      twiml.pause({ length: 1 });
      twiml.say({ voice: 'woman' }, 'Can I help with anything else?');
      twiml.redirect('/voice');
    } catch (error) {
      console.error('Error:', error);
      twiml.say({ voice: 'woman' }, 'Sorry, I encountered an error processing your request.');
    }
  } else {
    // Initial greeting
    twiml.gather({
      input: 'speech',
      action: '/voice',
      speechTimeout: 'auto',
      speechModel: 'experimental_conversations'
    }).say({ voice: 'woman' }, 'Hello! This is your AI assistant. How can I help you today?');
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

// Build prompt with conversation history
function buildPrompt(conversation) {
  let prompt = conversation.context + '\n\n';
  conversation.history.forEach(msg => {
    prompt += `${msg.role}: ${msg.parts}\n`;
  });
  return prompt;
}

// Process input with Gemini
async function processWithGemini(prompt) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Configure your Twilio webhook to: http://your-ngrok-url/voice`);
});