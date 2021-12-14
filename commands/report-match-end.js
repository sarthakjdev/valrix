
/*
/report-match-end command of gls bot to report the score after a match ends: to be used straight after the match ends otherwise it will not work
*/

/* eslint-disable no-restricted-syntax,no-await-in-loop */
const valorantAPI = require('../models/valorantAPI')
const Components = require('../struct/components')

module.exports = {
    name: 'report-match-end',
    calcRating(team1Elo, team2Elo, team1Score, team2Score) {
        return 50 * ((team2Score > team1Score)
        - 1 / (10 ** ((team1Elo - team2Elo) / 2000) + 1))
        * ((Math.log(2 * Math.abs(team1Score - team2Score) + 1) * 2.2)
        / ((team1Score > team2Score ? team1Elo - team2Elo : team2Elo - team1Elo) * 0.001 + 2.2))
    },

    async deleteChannels(interaction) {
        // deleting respective game channels
        const category = await interaction.channel.parent
        const channels = await category.children
        await Promise.all(channels.map((c) => c.delete()))
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

        // check if the user's team is winning team or not :
        const userPlayerData = await match.players.all_players.find((p) => p.puuid === userPlayer.valorantId)
        const team = userPlayerData.team.toLowerCase()
        const winningTeam = await match.teams.red.has_won === true ? 'red' : 'blue'

        if (winningTeam !== team) {
            const embed = Components.errorEmbed('You are not allowed to use this command')

            return interaction.editReply({ embeds: [embed] })
        }

        const redTeamScore = match.teams.red.rounds_won
        const blueTeamScore = match.teams.blue.rounds_won

        const team2 = team === 'red' ? match.players.blue : match.players.red

        let team2Cap
        for (const player of team2) {
            const dbPlayer = await interaction.client.factory.getPlayerByValorantId(player.puuid)
            if (dbPlayer.status === 'OWNER') {
                team2Cap = dbPlayer
                break
            }
        }
        if (!team2Cap) {
            const embed = await Components.errorEmbed('Your match was not with the team that has ')

            return interaction.editReply({ embeds: [embed] })
        }

        const team1Score = winningTeam === 'red' ? redTeamScore : blueTeamScore
        const team2Score = winningTeam === 'red' ? blueTeamScore : redTeamScore
        const team1Elo = userPlayer.team.rating
        const team2Elo = team2Cap.team.rating

        const diff = await this.calcRating(team1Elo, team2Elo, team1Score, team2Score)

        await client.factory.updateTeamRating(userPlayer.team, team1Elo - diff)
        await client.factory.updateTeamRating(team2Cap.team, team1Elo + diff)

        // updating adding match to the match history table in db:-
        const { matchid: matchId } = match.metadata
        const { map } = match.metadata
        const totalRounds = match.rounds.length
        const score = `${match.teams.red.rounds_won}-${match.teams.red.rounds_lost}`
        await client.factory.createMatch(matchId, map, userPlayer.team.name, team2Cap.team.name, totalRounds, -score, -diff) // calling db update function to update match history

        // Updating players stats:
        await match.players.all_players.map(async (p) => {
            const player = await client.factory.getPlayerByValorantId(p.uuid)
            const kills = player.kills + p.stats.kills
            const deaths = player.deaths + p.stats.deaths
            const assists = player.assists + p.stats.assists
            const averageScore = player.averageCombatScore
            await client.factory.updatePlayerStats(player.id, kills, deaths, assists, averageScore)
        })

        return this.deleteChannels(interaction)
    },
}
