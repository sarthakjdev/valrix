const Components = require('../struct/components')

module.exports = {
    name: 'team-info',
    exec: async (interaction) => {
        const { client, user } = interaction
        await interaction.deferReply()

        // Check if player is already added to any team
        const player = await client.factory.getPlayerById(user.id)
        if (!player.team) return interaction.editReply(`You don't have any team`)
        const teamInfoComponent = Components.teamComponents(player.team)

        return interaction.editReply({ embeds: [teamInfoComponent], ephemeral: true })
    },
}
