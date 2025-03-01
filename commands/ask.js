const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask Zenith a question')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('Your question')
                .setRequired(true)),
    
    async execute(interaction, client) {
        const question = interaction.options.getString('question');
        await interaction.deferReply();
        
        try {
            const answer = await client.ai.chatWithAI(question);
            
            // Split long messages if needed
            const chunks = client.utils.splitMessage(answer);
            await interaction.editReply(chunks[0]);
            
            // Send additional chunks as follow-ups
            for (let i = 1; i < chunks.length; i++) {
                await interaction.followUp(chunks[i]);
            }
        } catch (error) {
            console.error("Error in ask command:", error);
            await interaction.editReply("Sorry, I encountered an error processing your question.");
        }
    }
};