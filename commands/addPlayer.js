const valorantAPI = require('../models/valorantAPI')
const Components = require('../struct/components')

module.exports = {
    name: 'team-add-player',
    exec: async (interaction) => {
        const { client, user } = interaction
        const playerToAdd = interaction.options.getUser('user', true)
        const playerValorantName = interaction.options.get('valorant-name', true).value
        const playerValorantTag = interaction.options.get('valorant-tag', true).value
        const playerType = interaction.options.get('player-type', true).value

        await interaction.deferReply()

        // Check if user is owner
        const owner = await client.factory.getPlayerById(user.id)
        if (!owner.team || owner.team.owner.id !== user.id) return interaction.editReply(`You must be owner of team to add player`)

        // Check if player is already added to any team
        const player = await client.factory.getPlayerById(playerToAdd.id)
        if (player && player.team) return interaction.editReply(`Player ${playerToAdd} already belongs to ${player.team.name}`)

        // Check max subs and player numbers
        if (playerType === 'SUB' && owner.team.sub.length >= 3) return interaction.editReply(`Team ${owner.team.name} already have 3 subs`)
        if (playerType === 'PLAYER' && owner.team.players.length >= 5) return interaction.editReply(`Team ${owner.team.name} already have 5 players`)

        // Check if player has correct valorant id
        const valorantData = await valorantAPI.getPlayerByIGN(playerValorantName, playerValorantTag)
        if (!valorantData) return interaction.editReply(`Valorant player not found for ${playerValorantName}#${playerValorantTag}`)

        if (player) await client.factory.updatePlayerTeam(player.id, player.team)
        await client.factory.createPlayer(playerToAdd.id, valorantData.puuid, playerValorantName, playerValorantTag, playerType, owner.team)

        const playerAddedComponents = Components.teamPlayerComponent(playerToAdd, owner.team, 'added', user)

        return interaction.editReply(playerAddedComponents)

        // return interaction.editReply(`${playerToAdd} has been added to team ${owner.team.name}`)
    },
}

// Testing
// If player is team owner -> get team of user -> check if user is owner
// Check if player already exist and have team or not?
//
