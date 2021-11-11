
const Components = require('../struct/components')

const startMsgComponents = Components.startPlaying()
const queueComponents = Components.getQueue()

module.exports = {
    name: 'gsq',
    adminOnly: true,
    exec: async (interaction) => {
        const { client } = interaction

        await interaction.reply({
            embeds: [startMsgComponents.startPlayingEmbed],
            components: [startMsgComponents.startPlayingRow],
        })
        const filterPlayingButton = (buttonInteraction) => buttonInteraction.customId === 'startPlaying'
        const playingCollector = interaction.channel.createMessageComponentCollector({
            componentType: 'BUTTON',
            filter: filterPlayingButton,
        })

        playingCollector.on('collect', async (buuttonInteraction) => {
            // check whether the user is owner of a team or not.
            const owners = await client.factory.getOwners()
            const ownerIds = owners.map((o) => o.id)
            if (!ownerIds.includes(buuttonInteraction.user.id)) {
                // TODO: Throw better error
                return buuttonInteraction.reply(`You're not ziggy's friend`)
            }

            // Check if owner's team have enough players
            const userPlayer = await client.factory.getPlayerById(buuttonInteraction.user.id)
            if (!userPlayer.team.qualified) {
                return buuttonInteraction.reply('Not enough players or your team is not staged')
            }

            if (interaction.client.queueManager.isQueued(buuttonInteraction.user.id)) {
                return buuttonInteraction.reply({
                    content: `You're already queued`,
                    ephemeral: true,
                })
            }

            return buuttonInteraction.reply({
                components: [queueComponents.queuePlayingRow],
                embeds: [queueComponents.queuePlayingEmbed],
                ephemeral: true,
            })
        })

        // Start main collector
        const queueCollector = interaction.channel.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 900000,
        })

        queueCollector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.customId === 'startQueue') {
                const searchingQueueComponents = Components.searchingQueue(interaction.client.queueManager.size)
                await buttonInteraction.update(searchingQueueComponents)
                interaction.client.queueManager.addToQueue(buttonInteraction)
            }

            if (buttonInteraction.customId === 'leaveQueue') {
                if (interaction.client.queueManager.isQueued(buttonInteraction.user.id)) {
                    interaction.client.queueManager.removeFromQueue(buttonInteraction)
                    await buttonInteraction.reply({
                        content: `You have been removed from the queue. Dismiss the message and click start playing again, to join a queue again`,
                        ephemeral: true,
                    })
                } else {
                    await buttonInteraction.reply({
                        content: `You already been removed from the queue.`,
                        ephemeral: true,
                    })
                }
            }
        })
    },
}
