const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Bot is online! Logged in as ${client.user.tag}`);
        
        // Load command data for registration
        const commands = [];
        const commandsPath = path.join(__dirname, '..', 'commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            commands.push(command.data.toJSON());
        }
        
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        const TEST_GUILD_ID = process.env.TEST_GUILD_ID;
        
        try {
            console.log('Registering slash commands...');
            
            if (TEST_GUILD_ID) {
                // Clear and register guild commands
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, TEST_GUILD_ID),
                    { body: [] }
                );
                
                await rest.put(
                    Routes.applicationCommands(client.user.id),
                    { body: [] }
                );
                
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, TEST_GUILD_ID),
                    { body: commands }
                );
                // Removed the log message that displayed the guild ID
            } else {
                // Register global commands
                await rest.put(
                    Routes.applicationCommands(client.user.id),
                    { body: commands }
                );
                console.log('Slash commands registered globally!');
            }
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    }
};