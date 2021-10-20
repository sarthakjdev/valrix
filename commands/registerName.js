
module.exports = {
    name: 'register-team-name',
    exec: async (interaction) => {
        const teamName = interaction.options.get('teamname').value
        await interaction.reply({
            content: `Congratulation! Your team "${teamName}" has been successfully registered.`,
            ephemeral: true,
        })
    },
}
