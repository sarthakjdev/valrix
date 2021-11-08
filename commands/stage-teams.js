const valorantAPI = require('../models/valorantAPI')
const Components = require('../struct/components')

module.exports = {
    name: 'stage-teams',
    async exec(interaction) {
        const { client, user } = interaction
        await interaction.deferReply()
        // checking if the user is admin or not.
        if (process.env.ADMINS.split(',').includes(user.id)) {
            const embed = Components.errorEmbed('You are not an admin in this server to use this command')

            return interaction.editReply({ embeds: [embed] })
        }

        const teams = await client.factory.getRegisteredTeams()
        const teamsToStage = teams.filter((team) => team.players.length >= 5 && team.rating === 0)

        return interaction.editReply(teamsToStage.map((t) => t.name).join(' | '))
    },
}
