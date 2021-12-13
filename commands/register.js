const Components = require('../struct/components')
const valorantAPI = require('../models/valorantAPI')

module.exports = {
    name: 'register',
    exec: async (interaction) => {
        const { client, user } = interaction
        await interaction.deferReply()
        // Extract valorant player data
        const valorantName = interaction.options.get('valorant-name')?.value
        const valorantTagInput = interaction.options.get('valorant-tag')?.value
        const valorantTag = valorantTagInput.trim().split('#')[1]
        const valorantPlayer = await valorantAPI.getPlayerByIGN(valorantName, valorantTag)
        if (!valorantPlayer) {
            const embed = Components.errorEmbed(`Valorant Player not found for ${valorantName}#${valorantTag}. Check your valorant credentials again.`)

            return interaction.editReply({ embeds: [embed] })
        }

        const player = await client.factory.getPlayerById(user.id)
        if (player) {
            const embed = Components.errorEmbed(`You have already registered you account with us`)

            return interaction.editReply({ embeds: [embed] })
        }

        await client.factory.createPlayer(user.id, valorantPlayer.puuid, valorantPlayer.name, valorantPlayer.tag)

        // addding verifies role
        const guild = await interaction.client.guilds.fetch(process.env.HOME_GUILD_ID)
        const member = await guild.members.fetch(interaction.user.id)
        await member.roles.add(process.env.VERIFIED_ROLE)

        const successEmbed = Components.successEmbed('You have succcessfully registered your valorant account')

        return interaction.editReply({ embeds: [successEmbed] })
    },
}
