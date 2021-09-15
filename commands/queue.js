
const Components = require('../struct/components')

const startMsgComponents = Components.startPlaying()
const queueComponents = Components.getQueue()

module.exports = {
    name: 'que',
    exec: async (interaction) => {
        // Send Initial reply
        await interaction.reply({
            embeds: [startMsgComponents.startPlayingEmbed],
            components: [startMsgComponents.startPlayingRow],
        })
        const filterPlayingButton = (buttonInteraction) => buttonInteraction.customId === 'startPlaying'
        const playingCollector = interaction.channel.createMessageComponentCollector({
            componentType: 'BUTTON',
            filter: filterPlayingButton,
        })

        playingCollector.on('collect', async (playingButtonInteraction) => {
            if (interaction.client.queueManager.isQueued(playingButtonInteraction.user.id)) {
                await playingButtonInteraction.reply({
                    content: `You're already queued`,
                    ephemeral: true,
                })
            } else {
                await playingButtonInteraction.reply({
                    components: [queueComponents.queuePlayingRow],
                    embeds: [queueComponents.queuePlayingEmbed],
                    ephemeral: true,
                })
            }
        })

        const filterQueueButton = (buttonInteraction) => buttonInteraction.customId === 'startQueue'
        // Start main collector
        const startQueueButtonInteraction = interaction.channel.createMessageComponentCollector({
            componentType: 'BUTTON',
            filter: filterQueueButton,
        })
        startQueueButtonInteraction.on('collect', async (buttonInteraction) => {
            const searchingQueueComponents = Components.searchingQueue()
            await buttonInteraction.update(searchingQueueComponents)
            interaction.client.queueManager.addToQueue(buttonInteraction)
        })

        const leaveQueueFilter = (buttonInteraction) => buttonInteraction.customId === 'leaveQueue'
        const leaveQueueCollector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', filter: leaveQueueFilter })
        leaveQueueCollector.on('collect', async (playingButtonInteraction) => {
            if (interaction.client.queueManager.isQueued(playingButtonInteraction.user.id)) {
                interaction.client.queueManager.removeFromQueue(playingButtonInteraction)
                await playingButtonInteraction.reply({
                    content: `You have been removed from the queue. Dismiss the message and click start playing again, to join a queue again`,
                    ephemeral: true,
                })
            } else {
                await playingButtonInteraction.reply({
                    content: `You already been removed from the queue.`,
                    ephemeral: true,
                })
            }
        })
    },
}
