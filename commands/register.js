
module.exports = {
    name: 'register',
    exec: async (interaction) => {
        await interaction.reply({
            content: 'Your team has been registered.',
            ephemeral: true,
        })
    },
}
