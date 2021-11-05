
const Components = require('../struct/components')

module.exports = {
    name: 'player',
    async playerInfo(interaction, playerForInfo) {
        const { client } = interaction
        const infoPlayer = await client.factory.getPlayerById(playerForInfo)

        const playerInfoComponent = await Components.playerInfo(infoPlayer)
        await interaction.editReply(playerInfoComponent)
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

