const Components = require('../struct/components')

module.exports = {
    name: 'team-remove-player',
    exec: async (interaction) => {
        const { client, user } = interaction
        const leavingPlayer = interaction.user

        await interaction.deferReply()
        // Check if user is owner
        const owner = await client.factory.getPlayerById(user.id)
        if (owner.team || owner.team.owner.id === user.id) return interaction.editReply(`You are the captain of the team, you can't leave.`)

        // Check if player exist in a team:
        const player = await client.factory.getPlayerById(leavingPlayer.id)
        if (!player && !player.team) return interaction.editReply(`Player ${leavingPlayer} doesn't  belongs to ${player.team.name}`)

        const playerRemovalComponents = Components.playerLeftComponent(leavingPlayer, owner.team)

        return interaction.editReply(playerRemovalComponents)
    },
}

// Testing
// Check if user is owner -> owner can only delete team, can't leave team
// Check if user exist and belong to any team
