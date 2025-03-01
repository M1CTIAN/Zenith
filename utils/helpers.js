const { EmbedBuilder } = require('discord.js');

module.exports = {
    // Split long messages into multiple chunks
    splitMessage(text, maxLength = 2000) {
        const chunks = [];
        let currentChunk = "";
        const lines = text.split("\n");

        for (const line of lines) {
            if (currentChunk.length + line.length + 1 > maxLength) {
                chunks.push(currentChunk);
                currentChunk = line;
            } else {
                currentChunk += (currentChunk ? "\n" : "") + line;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk);
        }

        return chunks.flatMap(chunk => {
            if (chunk.length <= maxLength) return [chunk];
            const result = [];
            for (let i = 0; i < chunk.length; i += maxLength) {
                result.push(chunk.slice(i, i + maxLength));
            }
            return result;
        });
    },

    // Format replies with embeds and code blocks
    async sendFormattedReply(message, content) {
        const codeBlockRegex = /```([a-z]*)\n([\s\S]*?)```/g;
        const hasCodeBlocks = codeBlockRegex.test(content);
        
        if (hasCodeBlocks) {
            codeBlockRegex.lastIndex = 0;
            
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setAuthor({ name: 'Zenith', iconURL: message.client.user.displayAvatarURL() })
                .setDescription(content.replace(codeBlockRegex, '(See code block below)'))
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
            
            let match;
            while ((match = codeBlockRegex.exec(content)) !== null) {
                const language = match[1] || '';
                const code = match[2];
                await message.channel.send(`\`\`\`${language}\n${code}\`\`\``);
            }
        } else {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setDescription(content)
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
        }
    }
};