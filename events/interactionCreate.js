module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);

            const replyMethod = interaction.replied || interaction.deferred ?
                'followUp' : 'reply';

            try {
                await interaction[replyMethod]({
                    content: 'There was an error executing this command!',
                    ephemeral: true
                });
            } catch (e) {
                console.error('Could not respond to interaction', e);
            }
        }
    },
};