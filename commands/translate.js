const { SlashCommandBuilder } = require('discord.js');
const translationService = require('../services/translation.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate text to another language')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to translate')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('target')
                .setDescription('Target language')
                .setRequired(true)
                .addChoices(
                    { name: 'English', value: 'en' },
                    { name: 'Spanish', value: 'es' },
                    { name: 'French', value: 'fr' },
                    { name: 'German', value: 'de' },
                    { name: 'Japanese', value: 'ja' },
                    { name: 'Russian', value: 'ru' },
                    { name: 'Hindi', value: 'hi' },
                    { name: 'Chinese', value: 'zh' },
                    { name: 'Arabic', value: 'ar' },
                    { name: 'Portuguese', value: 'pt' }
                ))
        .addStringOption(option =>
            option.setName('source')
                .setDescription('Source language (auto-detect if not specified)')
                .setRequired(false)
                .addChoices(
                    { name: 'Auto-detect', value: 'auto' },
                    { name: 'English', value: 'en' },
                    { name: 'Spanish', value: 'es' },
                    { name: 'French', value: 'fr' },
                    { name: 'German', value: 'de' },
                    { name: 'Japanese', value: 'ja' },
                    { name: 'Russian', value: 'ru' },
                    { name: 'Hindi', value: 'hi' }
                )),

    async execute(interaction) {
        await interaction.deferReply();

        const text = interaction.options.getString('text');
        const targetLang = interaction.options.getString('target');
        const sourceLang = interaction.options.getString('source') || 'auto';

        try {
            const result = await translationService.translateText(text, targetLang, sourceLang);

            await interaction.editReply({
                embeds: [{
                    color: 0x0099ff,
                    title: 'Translation',
                    fields: [
                        { name: `Original (${result.from.language.iso})`, value: text },
                        { name: `Translation (${targetLang})`, value: result.text }
                    ],
                    footer: { text: 'Translation Service' }
                }]
            });
        } catch (error) {
            console.error('Translation error details:', {
                message: error.message,
                stack: error.stack,
                response: error.response?.data
            });
            await interaction.editReply('Sorry, I encountered an error while translating. Please try again later.');
        }
    },
};