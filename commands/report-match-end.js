const valorantAPI = require('../models/valorantAPI')
const Components = require('../struct/components')


module.exports = {
    name: 'report-match-end',
    async getTeamRating(interaction, player) {
        const { client } = interaction
        const dbPlayer = await client.factory.getPlayerById(player.id)
        const dbTeam = await client.factory.getTeamByName(dbPlayer.name)

        return dbTeam.rating
    },
    // function to be used for calculating rating after a match ends :
    // async calcRating(team1Elo, team2Elo, team1Score, team2Score) {
    //     /*
    //         A function for outputting the change in a team1's ELO score.
    //         team1_elo: The ELO of team 1.
    //         team2_elo: The ELO of team 2.
    //         team1_score: The score of team 1.
    //         team2_score: The score of team 2.
    //          */
    //     return 30 * (team1Score > team2Score)
    // - ((1 / 10) * (((team - team2Elo) / 400) + 1)
    // * (Math.log(2 * Math.abs(team1Score - team2Score) + 1) * 2.2) / (team1Score > team2Score ? team - team2Elo : ((team2Elo - team) * 0.001 + 2.2)))
    // },
    async exec(interaction) {
        const { client, user } = interaction
        const userPlayer = await client.factory.getPlayerById(user.id)
        await interaction.deferReply()

        // check if the user is owner or not
        if (!userPlayer || !userPlayer.team || userPlayer.team.ownerId !== userPlayer.id) {
            const embed = Components.errorEmbed('You must be a owner of a team to report the match')

            return interaction.editReply({ embeds: [embed] })
        }

        const matches = await valorantAPI.getPlayerLastMatch(userPlayer.name, userPlayer.tag)
        if (!matches) {
            const embed = Components.errorEmbed('You haven\'t played any custom match recently.')

            return interaction.editReply({ embeds: [embed] })
        }
        const requiredMatch = matches[0]
        // finding userplayer team colour
        const userPlayerTeamColour = await requiredMatch.players.all_players.find((p) => p.tag === userPlayer.tag).team.toLowerCase()
        const opponentTeamColour = await userPlayerTeamColour === 'red' ? 'blue' : 'red'

        const team1DbRating = await userPlayer.team.rating
        const team2DbRating = await requiredMatch.players.blue[0]

        // finding both teams players scores arrays
        const redTeamPlayerScores = await requiredMatch.players.red.map((p) => p.stats.score)
        const blueTeamPlayerScores = await requiredMatch.players.blue.map((p) => p.stats.score)

        // findng avaerage of both the team to be used as team scores :
        const redTeamAvg = redTeamPlayerScores.reduce((sum, player) => sum + player.elo, 0) / redTeamPlayerScores.length
        const blueTeamAvg = blueTeamPlayerScores.reduce((sum, player) => sum + player.elo, 0) / blueTeamPlayerScores.length

        const team1Score = userPlayerTeamColour === 'red' ? redTeamAvg : blueTeamAvg
        const team2Score = opponentTeamColour === 'blue' ? blueTeamAvg : redTeamAvg

        const ratingCalculated = await this.calcRating(team1Score, team2Score, team1DbRating, team2DbRating)
        const updatedTeamRating = await team1DbRating + ratingCalculated
        await client.factory.updateTeamRating(userPlayer.team)
        const reportMatchComponent = Components.reportMatch(ratingCalculated, updatedTeamRating)

        return interaction.editReply(reportMatchComponent)
    },
}
