const valorantAPI = require('../models/valorantAPI')

module.exports = {
    name: 'register-team',
    exec: async (interaction) => {
        const { client, user } = interaction
        await interaction.deferReply()
        const teamName = interaction.options.get('name').value
        const valorantName = interaction.options.get('valorant-name').value
        const valorantTag = interaction.options.get('valorant-tag').value

        // Check if valorant user exist
        const valorantPlayer = await valorantAPI.getPlayerByIGN(valorantName, valorantTag)
        if (!valorantPlayer) return interaction.editReply(`Valorant Player not found for ${valorantName}#${valorantTag}`)

        // Check if user already belongs to any team
        const player = await client.factory.getPlayerById(interaction.user.id)
        if (player && player.team) return interaction.editReply(`Player already exist for team ${player.team.name}`)

        // Check for team name
        let team = await client.factory.getTeamByName(teamName)
        if (team) return interaction.editReply(`Team already exist with same name`)

        // Create new team
        const teamOwner = {
            id: user.id, valorantName, valorantTag, valorantId: valorantPlayer.puuid,
        }
        team = await client.factory.createTeam(teamName, teamOwner, player)
        const owner = await interaction.client.users.fetch(team.owner.id)
        console.log(team)

        return interaction.editReply(`Team created with name ${team.name} for owner ${owner}`)
    },
}

// Testing
// Create team with invalid player tag/name
// Create non-existing team
// Create team with already existing name
// Create team while being already in one team
