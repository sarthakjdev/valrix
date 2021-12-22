
/*
    /leaderboard command of gls bot to get the leaderboard
*/

const Components = require('../struct/components')

module.exports = {
    name: 'leaderboard',
    exec: async (interaction) => {
        const { client } = interaction
        await interaction.deferReply()
        // extracting teams in desc order of their rating:
        const teams = await client.factory.getLeaderboard()
        if (!teams) {
            const errorEmbed = await Components.errorEmbed('No team to be ranked in the leaderboard')

            return interaction.editReply(errorEmbed)
        }
        const leaderboardComponent = Components.leaderboard(teams)

        return interaction.editReply(leaderboardComponent)
    },
}
