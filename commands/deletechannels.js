
const channelsForDeletion = ['Valorant', 'Check-In', 'game-settings', 'Team A', 'Team B']

module.exports = {
    name: 'deletechannels',
    exec: async (interaction) => {
        const subCommand = interaction.options.getSubcommand()
        if (subCommand === 'all') {
            await interaction.reply({
                content: 'Channels have been deleted',
                ephemeral: true,
            })
            let guildChannelList = await interaction.guild.channels.fetch()
            guildChannelList = guildChannelList.filter((ch) => channelsForDeletion.includes(ch.name))
            await new Promise(guildChannelList.map((ch) => ch.delete()))
        }

        if (subCommand === 'specific-channel') {
            const channelSelected = await interaction.options.get('channelname').value
            await interaction.reply({
                content: 'Channels have been deleted',
                ephemeral: true,
            })
            const selectedChannel = await interaction.guild.channels.fetch(`${channelSelected}`)
            if (channelsForDeletion.includes(selectedChannel.name)) await selectedChannel.delete()
        }
    },
}
