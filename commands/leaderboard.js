
const Components = require('../struct/components')

module.exports = {
    name: 'leaderboard',
    exec: async (interaction) => {
        const { client } = interaction
        await interaction.deferReply()
        // extracting teams in desc order of their rating:
        const teams = await client.factory.getLeaderboard()

        const leaderboardComponent = Components.leaderboard(teams)

        await interaction.editReply(leaderboardComponent)
    },
}
