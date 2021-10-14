
module.exports = {
    name: 'team',
    exec: async (interaction) => {
        await interaction.reply({
            content: 'Your team has been registered.',
            ephemeral: true,
        })
    },
}
