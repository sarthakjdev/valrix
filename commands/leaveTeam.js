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

// Testing
// Check if user is owner -> owner can only delete team, can't leave team
// Check if user exist and belong to any team
