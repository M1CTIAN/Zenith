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
    },

    
    async translateText(text, sourceLang, targetLang) {
        try {
            console.log(`AI translation attempt: ${sourceLang} -> ${targetLang}`);
            
            // Create a more explicit prompt for the AI
            const translationPrompt = `Translate this text from ${sourceLang !== 'auto' ? sourceLang : 'the detected language'} to ${targetLang}. Only respond with the translated text, no additional comments:\n\n"${text}"`;
            
            // Use the existing AI model for translation
            const response = await axios.post(
                process.env.HF_API_ENDPOINT,
                { 
                    inputs: translationPrompt,
                    parameters: {
                        max_new_tokens: 512,
                        temperature: 0.1,
                        do_sample: false,
                        top_p: 0.95,
                    }
                },
                { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
            );
            
            // Extract and clean the response text
            let translatedText = "";
            if (Array.isArray(response.data)) {
                translatedText = response.data[0]?.generated_text || "";
            } else if (response.data.generated_text) {
                translatedText = response.data.generated_text;
            }
            
            if (!translatedText) {
                throw new Error("Empty AI translation response");
            }
            
            // Remove the prompt from the response
            if (translatedText.includes(translationPrompt)) {
                translatedText = translatedText.substring(translatedText.indexOf(translationPrompt) + translationPrompt.length).trim();
            }
            
            // Clean up the response
            translatedText = translatedText
                .replace(/^["""''']|["""''']$/g, '') // Remove quotes
                .replace(/^Translation:/i, '') // Remove translation prefix
                .replace(/^\s*\n+/, '') // Remove leading newlines
                .trim();
            
            console.log("AI translation successful");
            return translatedText;
        } catch (error) {
            console.error("AI Translation Error:", error);
            throw error;
        }
    }
};