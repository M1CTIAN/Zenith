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
        const REGISTER_GLOBAL = process.env.REGISTER_GLOBAL === 'true'; // New environment variable
        
        try {
            console.log('Starting slash command registration...');
            
            // Register commands globally if flag is set
            if (REGISTER_GLOBAL) {
                await rest.put(
                    Routes.applicationCommands(client.user.id),
                    { body: commands }
                );
                console.log('Slash commands registered globally for all servers!');
            }
            // Otherwise register to test guild only
            else if (TEST_GUILD_ID) {
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, TEST_GUILD_ID),
                    { body: commands }
                );
                console.log('Slash commands registered for development server only.');
            }
            
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    }
};