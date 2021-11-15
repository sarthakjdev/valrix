const Components = require('../struct/components')
const valorantAPI = require('../models/valorantAPI')

module.exports = {
    name: 'register',
    exec: async (interaction) => {
        const { client, user } = interaction
        await interaction.deferReply()
        // Extract valorant player data
        const valorantName = interaction.options.get('valorant-name')?.value
        const valorantTag = interaction.options.get('valorant-tag')?.value
        let valorantPlayer

        // If valorant player inputs are given, make sure user exist
        if (valorantName && valorantTag) {
            valorantPlayer = await valorantAPI.getPlayerByIGN(valorantName, valorantTag)
            if (!valorantPlayer) {
                const embed = Components.errorEmbed(`Valorant Player not found for ${valorantName}#${valorantTag}. Checck your valorant credentials again.`)

                return interaction.editReply({ embeds: [embed] })
            }
        }

        await client.factory.createPlayer(user.id, valorantPlayer.puuid, valorantPlayer.name, valorantPlayer.tag, 'REGISTERED', 'no-team')

        // addding verifies role
        const guild = await interaction.client.guilds.fetch(process.env.HOME_GUILD_ID)
        const member = await guild.members.fetch(interaction.user.id)
        await member.roles.add(process.env.VERIFIED_ROLE)

        const successEmbed = Components.successEmbed('**You have succcessfully registered your valorant account**')

        return interaction.editReply({ embeds: [successEmbed] })
    },
}
