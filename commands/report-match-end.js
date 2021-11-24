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

    async calcRating(team1Elo, team2Elo, team1Score, team2Score) {
        return 30 * (team1Score > team2Score)
    - ((1 / 10) * (((team1Elo - team2Elo) / 400) + 1)
    // eslint-disable-next-line no-mixed-operators
    * (Math.log(2 * Math.abs(team1Score - team2Score) + 1) * 2.2) / (team1Score > team2Score ? team1Elo - team2Elo : ((team2Elo - team1Elo) * 0.001 + 2.2)))
    },
    async deletechannels(interaction) {
        // deleting respective game channels
        const category = await interaction.channel.parent
        const channels = await category.children
        await channels.map((ch) => ch.delete())
        await category.delete()
    },

    async exec(interaction) {
        const { client, user } = interaction
        const userPlayer = await client.factory.getPlayerById(user.id)
        await interaction.deferReply()

        // check if the user is owner or not
        if (!userPlayer || !userPlayer.team || userPlayer.team.ownerId !== userPlayer.id) {
            const embed = Components.errorEmbed('You must be a owner of a team to report the match')

            return interaction.editReply({ embeds: [embed] })
        }

        const match = await valorantAPI.getPlayerLastMatch(userPlayer.name, userPlayer.tag)
        if (!match) {
            const embed = Components.errorEmbed('You haven\'t played any custom match recently.')

            return interaction.editReply({ embeds: [embed] })
        }

        const userTeam = match.players.red.find((p) => p.puuid === userPlayer.valorantId) ? 'red' : 'blue'

        // finding userplayer team colour
        const userPlayerTeamColour = match.players.all_players.find((p) => p.tag === userPlayer.tag).team.toLowerCase()
        const opponentTeamColour = userPlayerTeamColour === 'red' ? 'blue' : 'red'

        const team1DbRating = userPlayer.team.rating
        const team2DbRating = match.players.blue[0]

        // finding both teams players scores arrays
        const redTeamPlayerScores = match.players.red.map((p) => p.stats.score)
        const blueTeamPlayerScores = match.players.blue.map((p) => p.stats.score)

        // finding average of both the team to be used as team scores :
        const redTeamAvg = redTeamPlayerScores.reduce((sum, player) => sum + player.elo, 0) / redTeamPlayerScores.length
        const blueTeamAvg = blueTeamPlayerScores.reduce((sum, player) => sum + player.elo, 0) / blueTeamPlayerScores.length

        const team1Score = userPlayerTeamColour === 'red' ? redTeamAvg : blueTeamAvg
        const team2Score = opponentTeamColour === 'blue' ? blueTeamAvg : redTeamAvg

        const ratingCalculated = await this.calcRating(team1Score, team2Score, team1DbRating, team2DbRating)
        const updatedTeamRating = team1DbRating + ratingCalculated
        await client.factory.updateTeamRating(userPlayer.team)

        const reportMatchComponent = Components.reportMatch(ratingCalculated, updatedTeamRating)

        await interaction.editReply(reportMatchComponent)

        return this.deletechannels(interaction)
    },
}
