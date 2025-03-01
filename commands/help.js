const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows help information about Zenith'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Zenith Bot Help')
            .setDescription('I\'m Zenith, your AI assistant. Here are my commands:')
            .addFields(
                { name: '/ask', value: 'Ask me a question' },
                { name: '/image', value: 'Generate images from text descriptions' }
            )
            .setFooter({ text: 'Powered by AI' });
        
        await interaction.reply({ embeds: [embed] });
    }
};