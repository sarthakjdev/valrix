
/*
    /register command of gls bot for the user to link their valorant account with our system
*/

const Components = require('../struct/components')
const valorantAPI = require('../models/valorantAPI')

module.exports = {
    name: 'register',
    exec: async (interaction) => {
        const { client, user } = interaction
        await interaction.deferReply()
        // Extract valorant player data
        const inGameName = interaction.options.get('valorant-id').value
        const valorantCreds = inGameName.split('#')
        const valorantName = valorantCreds[0]
        const valorantTag = valorantCreds[1]
        // check if the user is a valid player or not
        const valorantPlayer = await valorantAPI.getPlayerByIGN(valorantName, valorantTag)
        if (!valorantPlayer) {
            const embed = Components.errorEmbed(`Valorant Player not found for ${valorantName}#${valorantTag}. Check your valorant credentials again.`)

            return interaction.editReply({ embeds: [embed] })
        }
        const playerRating = await valorantAPI.getPlayerRating(valorantName, valorantTag)
        // check if the user has elo info available
        if (!playerRating.elo) {
            const embed = Components.errorEmbed(`No competitive rating information found. Invalid registeration`)

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
