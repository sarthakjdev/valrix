/* eslint-disable no-restricted-syntax,no-await-in-loop */
const valorantAPI = require('../models/valorantAPI')
const Components = require('../struct/components')

module.exports = {
    name: 'stage-teams',
    adminOnly: true,
    async exec(interaction) {
        const { client } = interaction
        await interaction.deferReply()

        const teams = await client.factory.getRegisteredTeams()
        const teamsToStage = teams.filter((team) => team.players.length >= 5 && team.rating === 0)

        if (!teamsToStage.length) {
            const embed = Components.errorEmbed('No teams to stage')

            return interaction.editReply({ embeds: [embed] })
        }

        for (const team of teamsToStage) {
            const playerRatings = await Promise.all(team.players.map((p) => valorantAPI.getPlayerRating(p.name, p.tag)))
            const rating = playerRatings.reduce((sum, player) => sum + player.elo, 0) / playerRatings.length

            await client.factory.updateTeamRating(team, rating)
        }

        const stagedTeamComponent = Components.teamsStaged(teamsToStage)

        return interaction.editReply(stagedTeamComponent)
    },
}
