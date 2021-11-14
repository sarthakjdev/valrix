
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

        playingCollector.on('collect', async (buttonInteraction) => {
            // check whether the user is owner of a team or not.
            const owners = await client.factory.getOwners()
            const ownerIds = owners.map((o) => o.id)
            if (!ownerIds.includes(buttonInteraction.user.id)) {
                // TODO: Throw better error
                const embed = Components.errorEmbed('You are not a captain of a team to search for queue.')

                return buttonInteraction.reply({ embeds: [embed] })
            }

            // Check if owner's team have enough players
            const userPlayer = await client.factory.getPlayerById(buttonInteraction.user.id)
            if (!userPlayer.team.qualified) {
                const embed = Components.errorEmbed('Your team doesn\'t have enough players to search for queue.')

                return buttonInteraction.reply({ embeds: [embed] })
            }

            if (interaction.client.queueManager.isQueued(buttonInteraction.user.id)) {
                return buttonInteraction.reply({
                    content: `You're already queued`,
                    ephemeral: true,
                })
            }

            return buttonInteraction.reply({
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
