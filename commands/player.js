
/*
    /player command of gls bot to get a player profile
*/

const Components = require('../struct/components')

module.exports = {
    name: 'player',
    async playerInfo(interaction, playerForInfo) {
        const { client, user } = interaction
        const infoPlayer = await client.factory.getPlayerById(playerForInfo)

        if (!infoPlayer) {
            const embed = Components.errorEmbed(`No player has been registered for the user mentioned`)

            return interaction.editReply({ embeds: [embed] })
        }

        const playerInfoComponent = await Components.playerInfo(infoPlayer, user)

        return interaction.editReply(playerInfoComponent)
    },
    async exec(interaction) {
        await interaction.deferReply()
        let playerForInfo
        const player = interaction.options.get('user')?.value
        if (player) playerForInfo = player
        else playerForInfo = interaction.user.id

        return this.playerInfo(interaction, playerForInfo)
    },
}

