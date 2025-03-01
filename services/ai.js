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
            // Auto-detect source language if not provided
            const sourcePrefix = sourceLang ? `${sourceLang} to ` : 'Translate to ';
            const translationPrompt = `${sourcePrefix}${targetLang}: ${text}`;
            
            // Use the existing AI model for translation to leverage its multilingual capabilities
            const response = await axios.post(
                process.env.HF_API_ENDPOINT,
                { 
                    inputs: translationPrompt,
                    parameters: {
                        max_new_tokens: 512,
                        temperature: 0.3, // Lower temperature for more accurate translations
                        do_sample: true
                    }
                },
                { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
            );
            
            let translatedText = "";
            if (Array.isArray(response.data)) {
                translatedText = response.data[0]?.generated_text || "Translation failed.";
            } else if (response.data.generated_text) {
                translatedText = response.data.generated_text;
            } else {
                translatedText = "Translation failed.";
            }
            
            // Extract just the translation from the response
            // First try to remove the prompt from the beginning
            if (translatedText.includes(translationPrompt)) {
                translatedText = translatedText.substring(translationPrompt.length).trim();
            }
            
            // Then try to extract just what's after language labels like "English: " or "[English]"
            const languagePrefixMatch = translatedText.match(/^(\[.*?\]|\w+:)\s*/);
            if (languagePrefixMatch) {
                translatedText = translatedText.substring(languagePrefixMatch[0].length).trim();
            }
            
            return translatedText;
        } catch (error) {
            console.error("Translation Error:", error.response?.data || error.message);
            throw error;
        }
    }
};