const valorantAPI = require('../models/valorantAPI')

module.exports = {
    name: 'team-remove-player',
    exec: async (interaction) => {
        const { client, user } = interaction
        const playerToRemove = interaction.options.get('playert').value

        await interaction.deferReply()
        // Check if user is owner
        const owner = await client.factory.getPlayerById(user.id)
        if (!owner.team || owner.team.owner.id !== user.id) return interaction.editReply(`You must be owner of team to add player`)

        // Check if player is already added to any team
        const player = await client.factory.getPlayerById(playerToRemove.id)
        if (player && player.team !== owner.team) return interaction.editReply(`Player ${playerToRemove} doesn't belongs to ${owner.team.name}`)
    },
}

// Testing
// Check if user is owner
// Check if user exist and belong to owner's team

