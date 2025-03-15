const axios = require('axios');
const aiService = require('./ai.js');

module.exports = {
    async translateText(text, targetLang, sourceLang = 'auto') {
        // Define Lingva instances to try
        const instances = [
            'https://translate.reflectify.net',
            'https://lingva.ml',
            'https://translate.rivershy.net',
            'https://translate.ast-t.de',
            'https://translate.tiekoetter.com'
        ];
        
        let lastError = null;
        
        // Try different instances if one fails
        for (const baseUrl of instances) {
            try {
                // Use the correct REST API v1 endpoint format
                const url = `${baseUrl}/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(text)}`;
                
                const response = await axios.get(url, {
                    timeout: 8000 // 8 second timeout
                });
                
                // Success! Check for translation field in response per API docs
                if (response.data && response.data.translation) {
                    return {
                        text: response.data.translation,
                        from: { 
                            language: { 
                                // Use the detected language if available, fallback to source
                                iso: response.data.info?.detectedSource || sourceLang 
                            } 
                        }
                    };
                } else if (response.data && response.data.error) {
                    throw new Error(`Lingva API error: ${response.data.error}`);
                } else {
                    throw new Error("Invalid response structure");
                }
            } catch (error) {
                lastError = error;
                console.error(`Lingva error with ${baseUrl}:`, error.message);
                // Continue to next instance
            }
        }
        
        // Try LibreTranslate instances if Lingva fails
        const libreInstances = [
            'https://libretranslate.de',
            'https://translate.terraprint.co',
            'https://lt.vern.cc'
        ];

        for (const baseUrl of libreInstances) {
            try {
                console.log(`Trying LibreTranslate instance: ${baseUrl}`);
                const response = await axios.post(`${baseUrl}/translate`, {
                    q: text,
                    source: sourceLang === 'auto' ? 'auto' : sourceLang,
                    target: targetLang
                }, {
                    timeout: 8000
                });
                
                if (response.data && response.data.translatedText) {
                    return {
                        text: response.data.translatedText,
                        from: { 
                            language: { 
                                iso: response.data.detectedLanguage?.language || sourceLang 
                            } 
                        }
                    };
                }
            } catch (error) {
                console.error(`LibreTranslate error with ${baseUrl}:`, error.message);
                // Continue to next instance
            }
        }
        
        // If all instances failed, try using the AI model as fallback
        try {
            console.log("All Lingva instances failed, falling back to AI translation");
            const aiTranslation = await aiService.translateText(text, sourceLang, targetLang);
            
            return {
                text: aiTranslation,
                from: {
                    language: {
                        iso: sourceLang === 'auto' ? 'detected' : sourceLang
                    }
                }
            };
        } catch (aiError) {
            console.error("AI fallback translation error:", aiError);
            throw lastError || new Error('All translation services failed');
        }
    }
};