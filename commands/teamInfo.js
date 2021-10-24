module.exports = {
    name: 'team-info',
    exec: async (interaction) => {
        await interaction.reply({
            content: 'Your team information is here',
            ephemeral: true,
        })
    },
}
