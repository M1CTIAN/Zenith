const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Generate an image based on your description')
        .addStringOption(option => 
            option.setName('prompt')
                .setDescription('Description of the image to generate')
                .setRequired(true)),
    
    async execute(interaction, client) {
        const prompt = interaction.options.getString('prompt');
        await interaction.deferReply();
        
        try {
            // Generate image using the AI service
            const imageBuffer = await client.ai.generateImage(prompt);
            
            const attachment = new AttachmentBuilder(imageBuffer, { name: 'generated-image.png' });
            await interaction.editReply({ 
                content: `Generated image for: "${prompt}"`, 
                files: [attachment] 
            });
        } catch (error) {
            console.error("Image generation error:", error);
            await interaction.editReply("Sorry, I couldn't generate that image.");
        }
    }
};