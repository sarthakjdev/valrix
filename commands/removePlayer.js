module.exports = {
    name: 'team-remove-player',
    exec: async (interaction) => {
        const playerDiscordTag = interaction.options.get('playertag').value
        await interaction.reply({
            content: `<@${playerDiscordTag}> has been removed from your team`,
            ephemeral: true,
        })
    },
}
