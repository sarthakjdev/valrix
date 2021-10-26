module.exports = {
    name: 'team-remove-player',
    exec: async (interaction) => {
        const player = interaction.options.get('playert').value
        await interaction.reply({
            content: `<@${player}> has been removed from your team`,
            ephemeral: true,
        })
    },
}
