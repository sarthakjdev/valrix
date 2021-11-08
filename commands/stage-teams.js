const valorantAPI = require('../models/valorantAPI')

module.exports = {
    name: 'stage-teams',
    adminOnly: true,
    async exec(interaction) {
        const { client } = interaction
        await interaction.deferReply()

        const teams = await client.factory.getRegisteredTeams()
        const teamsToStage = teams.filter((team) => team.players.length >= 5 && team.rating === 0)

        return interaction.editReply(teamsToStage.map((t) => t.name).join(' | '))
    },
}
