const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Common language options
const languageOptions = [
    { name: 'English', value: 'English' },
    { name: 'Spanish', value: 'Spanish' },
    { name: 'French', value: 'French' },
    { name: 'German', value: 'German' },
    { name: 'Italian', value: 'Italian' },
    { name: 'Portuguese', value: 'Portuguese' },
    { name: 'Russian', value: 'Russian' },
    { name: 'Japanese', value: 'Japanese' },
    { name: 'Chinese', value: 'Chinese' },
    { name: 'Arabic', value: 'Arabic' },
    { name: 'Hindi', value: 'Hindi' },
    { name: 'Korean', value: 'Korean' }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate text to another language')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text to translate')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('target')
                .setDescription('Target language')
                .setRequired(true)
                .addChoices(...languageOptions))
        .addStringOption(option =>
            option.setName('source')
                .setDescription('Source language (auto-detect if not specified)')
                .addChoices(...languageOptions)),

    async execute(interaction, client) {
        const text = interaction.options.getString('text');
        const targetLang = interaction.options.getString('target');
        const sourceLang = interaction.options.getString('source');

        await interaction.deferReply();

        try {
            const translatedText = await client.ai.translateText(text, sourceLang, targetLang);

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Translation')
                .addFields(
                    { name: 'Original Text', value: text },
                    { name: `Translated to ${targetLang}`, value: translatedText }
                )
                .setFooter({ text: sourceLang ? `From ${sourceLang} to ${targetLang}` : `Auto-detected to ${targetLang}` });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Translation command error:", error);
            await interaction.editReply("Sorry, I encountered an error while translating.");
        }
    }
};
