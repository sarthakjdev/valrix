const valorantAPI = require('../models/valorantAPI')
const Components = require('../struct/components')

module.exports = {
    name: 'report-match-end',
    exec: async (interaction) => {
        const { client, user } = interaction
        const userPlayer = await client.factory.getPlayerById(user.id)
        console.log(userPlayer) // here userplayer doesnt return calo game and tag
        await interaction.deferReply()

        // check if the user is owner or not
        if (!userPlayer || !userPlayer.team || userPlayer.team.ownerId !== userPlayer.id) {
            const embed = Components.errorEmbed('You must be a owner of a team to report the match')

            return interaction.editReply({ embeds: [embed] })
        }
        // const playerMatches = await valorantAPI.getPlayerMatches(process.env.REGION, userPlayer.name, userPlayer.tag)

        const match = await valorantAPI.getPlayerLastMatch(userPlayer.name, userPlayer.tag)
        if (!match) {
            const embed = Components.errorEmbed('You haven\'t played any custom match recently.')

            return interaction.editReply({ embeds: [embed] })
        }
        const reportMatchComponent = Components.reportMatch()

        return interaction.editReply(reportMatchComponent)
    },
}
