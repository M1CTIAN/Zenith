require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const express = require("express"); // Add Express
const app = express(); // Create Express app
const PORT = process.env.PORT || 3000; // Default port 3000

// Set up Express server
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const HF_API_KEY = process.env.HF_API_KEY;
const HF_API_ENDPOINT = process.env.HF_API_ENDPOINT;

async function chatWithAI(userMessage) {
    try {
        const response = await axios.post(
            HF_API_ENDPOINT,
            { inputs: userMessage },
            { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
        );

        let botReply = "";
        if (Array.isArray(response.data)) {
            botReply = response.data[0]?.generated_text || "I didn't understand that.";
        } else if (response.data.generated_text) {
            botReply = response.data.generated_text;
        } else {
            botReply = "I didn't understand that.";
        }

        // If the reply contains '</think>', use only the text after it
        if (botReply.includes('</think>')) {
            botReply = botReply.split('</think>').pop();
        }

        // Replace any mention of "deepseek" (case-insensitive) with "zenith"
        botReply = botReply.replace(/deepseek/gi, "zenith");

        return botReply;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        return "Sorry busy learning new things, can't chat right now.";
    }
}

client.once("ready", () => {
    console.log("Bot is online!");
});

// Add this helper function to split messages
function splitMessage(text, maxLength = 2000) {
    const chunks = [];
    let currentChunk = "";

    // Split by newlines first to keep formatting intact where possible
    const lines = text.split("\n");

    for (const line of lines) {
        if (currentChunk.length + line.length + 1 > maxLength) {
            chunks.push(currentChunk);
            currentChunk = line;
        } else {
            currentChunk += (currentChunk ? "\n" : "") + line;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk);
    }

    // If any chunk is still too long, split it by characters
    return chunks.flatMap(chunk => {
        if (chunk.length <= maxLength) return [chunk];
        const result = [];
        for (let i = 0; i < chunk.length; i += maxLength) {
            result.push(chunk.slice(i, i + maxLength));
        }
        return result;
    });
}

client.on("messageCreate", async (message) => {
    // Ignore bot messages and messages that don't mention the bot
    if (message.author.bot || !message.mentions.has(client.user.id)) return;

    // Remove the bot mention from the message
    const userMessage = message.content.replace(/<@!?${client.user.id}>/g, '').trim();

    // If message is empty after removing mention, ignore it
    if (!userMessage) return;

    try {
        // Start typing indicator
        const typingInterval = setInterval(() => {
            message.channel.sendTyping();
        }, 5000);

        // Get AI response
        const reply = await chatWithAI(userMessage);

        // Clear typing indicator
        clearInterval(typingInterval);

        // Send the response
        await message.reply(reply);
    } catch (error) {
        console.error("Error in message handling:", error);
        await message.reply("Sorry, I encountered an error while processing your message.");
    }
});

client.login(process.env.DISCORD_TOKEN);
