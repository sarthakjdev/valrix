module.exports = {
    name: 'team-add-player',
    exec: async (interaction) => {
        const player = interaction.options.get('player').value
        const playerign = interaction.options.get('playerign').value
        await interaction.reply({
            content: `<@${player}> has been added to your team`,
            ephemeral: true,
        })
    },
}
