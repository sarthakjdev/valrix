
const Components = require('../struct/components')

const startMsgComponents = Components.startPlaying()
const queueComponents = Components.getQueue()

module.exports = {
    name: 'gsq',
    exec: async (interaction) => {
        const { client } = interaction
        // check whether the command user is admin or not
        if (!process.env.ADMINS.split(',').includes(interaction.user.id)) {
            const embed = Components.errorEmbed('You are not admin of this server to use this command')

            return interaction.reply({ embeds: [embed] })
        }

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
            // check whethere the user is owner of a team or not.
            const owners = await client.factory.getOwners()
            console.log(!owners.map((o) => Number(o.id) === Number(playingButtonInteraction.user.id)))
            console.log(playingButtonInteraction.user.id)
            if (owners.map((o) => o.id === playingButtonInteraction.user.id)) {
                const embed = Components.errorEmbed('You are not a captain of a team to search for a queue')

                return playingButtonInteraction.reply({ embeds: [embed] })
            }
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
            const searchingQueueComponents = Components.searchingQueue(interaction.client.queueManager.size)
            await buttonInteraction.update(searchingQueueComponents)
            interaction.client.queueManager.addToQueue(buttonInteraction)
            await interaction.client.queueManager.updateQueueSizeEmbed()
        })

        const leaveQueueFilter = (buttonInteraction) => buttonInteraction.customId === 'leaveQueue'
        const leaveQueueCollector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', filter: leaveQueueFilter })
        leaveQueueCollector.on('collect', async (playingButtonInteraction) => {
            if (interaction.client.queueManager.isQueued(playingButtonInteraction.user.id)) {
                interaction.client.queueManager.removeFromQueue(playingButtonInteraction)
                await interaction.client.queueManager.updateQueueSizeEmbed()
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
