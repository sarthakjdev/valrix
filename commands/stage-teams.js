
const valorantAPI = require('../models/valorantAPI')
const Components = require('../struct/components')

module.exports = {
    name: 'stage-teams',
    // check if user was admin, then set the teams arrays accordingly
    async setTeams(interaction, userPlayer) {
        const { client } = interaction
        let teams
        if (process.env.ADMINS.split(',').includes(userPlayer.id)) teams = await client.factory.getRegisteredTeams()
        else teams = [userPlayer.team]

        return this.stageTeams(interaction, teams)
    },
    // team staging process here
    async stageTeams(interaction, teams) {
        const { client } = interaction
        // const teams = await client.factory.getRegisteredTeams()
        const teamPlayers = await Promise.all(teams.map((team) => client.factory.getTeamPlayers(team)))
        await teamPlayers.forEach((playersOfTeam) => {
            if (playersOfTeam.length === 4) {
                // this promise is not getting resolved
                const playerRatings = Promise.all(playersOfTeam.map((p) => valorantAPI.getPlayerRating(process.env.REGION, p.valorantName, p.valorantTag)))
                console.log('playerRatings ', playerRatings)

                // Calculating team rating to rank on leaderboard
                playerRatings.forEach((teamPlayersRatings) => {
                    const avg = teamPlayersRatings.reduce((sum, player) => player.elo + sum, 0) / teamPlayersRatings.length
                    const aggregateTeamRating = 1700 - (400 * (1 - (avg / 105)))
                    console.log(playerRatings)
                    client.factory.updateTeamRating(playersOfTeam[0].team, aggregateTeamRating)
                    interaction.editReply(':white_check_mark: Team has been staged to rank')
                })
            }
        })
        console.log('reached end of file')
    },
    async exec(interaction) {
        const { client, user } = interaction
        await interaction.deferReply()
        const ownerInput = interaction.options.get('owner')?.value
        const owner = ownerInput || user.id
        console.log(`user input or not ${owner}`)
        const userPlayer = await client.factory.getPlayerById(owner)

        // checking if the user is admin or not.
        if (process.env.ADMINS.split(',').includes(user.id)) return this.checkTeam(interaction, userPlayer)

        const embed = Components.errorEmbed('You are not an admin in this server to use this command')

        return interaction.editReply({ embeds: [embed] })
    },
}
