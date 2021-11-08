/* eslint-disable no-restricted-syntax,no-await-in-loop */
const valorantAPI = require('../models/valorantAPI')

module.exports = {
    name: 'stage-teams',
    adminOnly: true,
    async exec(interaction) {
        const { client } = interaction
        await interaction.deferReply()

        const teams = await client.factory.getRegisteredTeams()
        const teamsToStage = teams.filter((team) => team.players.length >= 5 && team.rating === 0)

        if (!teamsToStage.length) {
            // TODO : Add embed here
            return interaction.editReply('No teams to stage')
        }

        for (const team of teamsToStage) {
            const playerRatings = await Promise.all(team.players.map((p) => valorantAPI.getPlayerRating(p.name, p.tag)))
            const avg = playerRatings.reduce((sum, player) => sum + player.elo, 0) / playerRatings.length
            const rating = 1700 - (400 * (1 - (avg / 105)))

            await client.factory.updateTeamRating(team, rating)
        }

        // TODO : Update embed here
        return interaction.editReply(teamsToStage.map((t) => t.name).join(' | '))
    },
}
