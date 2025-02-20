require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const HF_API_KEY = process.env.HF_API_KEY;

async function chatWithAI(userMessage) {
    try {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B`,
            { inputs: userMessage },
            { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
        );

        let botReply = "";
        // Check if the response contains an array or an object with generated_text
        if (Array.isArray(response.data)) {
            botReply = response.data[0]?.generated_text || "I didn't understand that.";
        } else if (response.data.generated_text) {
            botReply = response.data.generated_text;
        } else {
            botReply = "I didn't understand that.";
        }

        // If the reply contains '</think>', use only the text after it.
        if (botReply.includes('</think>')) {
            botReply = botReply.split('</think>').pop();
        }

        // Replace any mention of "deepseek" (case-insensitive) with "zenith"
        botReply = botReply.replace(/deepseek/gi, "zenith");

        return botReply;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        return "Error: Unable to fetch response from AI.";
    }
}

client.once("ready", () => {
    console.log("Bot is online!");
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return; // Ignore bot messages

    const reply = await chatWithAI(message.content);
    message.reply(reply);
});

client.login(process.env.DISCORD_TOKEN);
