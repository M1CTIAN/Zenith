const axios = require('axios');

module.exports = {
    async chatWithAI(userMessage) {
        try {
            const response = await axios.post(
                process.env.HF_API_ENDPOINT,
                { inputs: userMessage },
                { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
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

            // Replace any mention of "deepseek" with "zenith"
            botReply = botReply.replace(/deepseek/gi, "zenith");

            return botReply;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return "Sorry busy learning new things, can't chat right now.";
        }
    },

    async generateImage(prompt) {
        try {
            // Use environment variable for image model endpoint
            const response = await axios.post(
                process.env.HF_IMAGE_API_ENDPOINT, // Add this to your .env file
                { inputs: prompt },
                {
                    headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
                    responseType: 'arraybuffer'
                }
            );
            return response.data;
        } catch (error) {
            console.error("Image generation error:", error.message);
            throw error;
        }
    }
};