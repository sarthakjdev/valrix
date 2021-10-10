
const channelsForDeletion = ['Valorant', 'Check-In', 'game-settings', 'Team A', 'Team B']
module.exports = {
    name: 'clean',
    exec: async (interaction) => {
        await interaction.reply({
            content: 'Channels have been deleted',
            ephemeral: true,
        })
        const guildChannelList = await interaction.guild.channels.fetch()
        // await console.log(guildChannelList)
        await console.log(`There are ${guildChannelList.size} channels.`)
        guildChannelList.map((ch) => {
            channelsForDeletion.forEach((element) => {
                if (ch.name === element) {
                    ch.delete()
                }
            })
        })
    },
}
