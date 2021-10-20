module.exports = {
    name: 'team-add-player',
    exec: async (interaction) => {
        const playerDiscordTag = interaction.options.get('playertag').value
        const playerInGameName = interaction.options.get('playergamename').value
        const playertagline = interaction.options.get('playertagline').value
        await interaction.reply({
            content: `<@${playerDiscordTag}> has been added to your team`,
            ephemeral: true,
        })
    },
}
