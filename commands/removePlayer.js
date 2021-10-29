const valorantAPI = require('../models/valorantAPI')
const Components = require('../struct/components')

module.exports = {
    name: 'team-remove-player',
    exec: async (interaction) => {
        const { client, user } = interaction
        const playerToRemove = interaction.options.get('player').value
        console.log(playerToRemove)
        await interaction.deferReply()
        // Check if user is owner
        const owner = await client.factory.getPlayerById(user.id)
        if (!owner.team || owner.team.owner.id !== user.id) return interaction.editReply(`You must be owner of team to add player`)

        // Check if player is already added to any team
        const player = await client.factory.getPlayerById(playerToRemove.id)
        if (player && player.team !== owner.team) return interaction.editReply(`Player ${playerToRemove} doesn't belongs to ${owner.team.name}`)

        console.log(playerToRemove.id)
        // await client.factory.removePlayer(playerToRemove, playerToRemove.team)

        const playerRemovalComponents = Components.teamPlayerComponent(playerToRemove, owner.team, 'removed', user)

        return interaction.editReply(playerRemovalComponents)
    },
}

// Testing
// Check if user is owner
// Check if user exist and belong to owner's team

