
const channelsForDeletion = ['Valorant', 'Check-In', 'game-settings', 'Team A', 'Team B']

module.exports = {
    name: 'deletechannels',
    exec: async (interaction) => {
        const subCommand = await interaction.options.getSubcommand()
        if (subCommand === 'all') {
            await interaction.reply({
                content: 'Channels have been deleted',
                ephemeral: true,
            })
            const guildChannelList = await interaction.guild.channels.fetch()
            guildChannelList.map((ch) => {
                channelsForDeletion.forEach((element) => {
                    if (ch.name === element) {
                        ch.delete()
                    }
                })
            })
        }

        if (subCommand === 'specific-channel') {
            const channelSelected = await interaction.options.get('channelname').value
            await interaction.reply({
                content: 'Channels have been deleted',
                ephemeral: true,
            })
            const guildChannelList = await interaction.guild.channels.fetch()
            const selectedChannelName = await interaction.guild.channels.fetch(`${channelSelected}`)
            guildChannelList.forEach((ch) => {
                if (ch.name === selectedChannelName.name) {
                    ch.delete()
                }
            })
        }
    },
}
