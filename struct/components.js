const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const _ = require('lodash')

const {
    THUMBNAIL, MATCH_FOUND_IMAGE, SELECT_MAP, SELECT_SIDE, ATTACKER, DEFENDER,
} = process.env

// defining all the components here in this class :
class Components {
    static startPlaying() {
        const startPlayingButton = new MessageButton()
            .setCustomId('startPlaying')
            .setLabel('Start Playing')
            .setStyle('SUCCESS')

        const startPlayingRow = new MessageActionRow()
            .addComponents(startPlayingButton)

        const startPlayingEmbed = new MessageEmbed()
            .setAuthor('QUE Bot', `${THUMBNAIL}`)
            .setDescription('Tap on the button below to initiate the queuing process .')
            .setThumbnail(`${THUMBNAIL}`)

        return {
            startPlayingEmbed,
            startPlayingRow,
        }
    }

    // component  generated for queue button
    static getQueue() {
        const queuePlayingButton = new MessageButton().setCustomId('startQueue')
            .setLabel('Queue')
            .setStyle('SUCCESS')
        const queuePlayingRow = new MessageActionRow().addComponents(queuePlayingButton)
        const queuePlayingEmbed = new MessageEmbed().setAuthor('QUE Bot', `${THUMBNAIL}`)
            .setColor('WHITE')
            .setDescription('Click on the button below to search for a queue. And wait for enough players to join in the queue to start the matchmaking.')
            .setThumbnail(`${THUMBNAIL}`)

        return {
            queuePlayingRow,
            queuePlayingEmbed,
        }
    }

    // component  generated for update afetr  queue button is clicked
    static searchingQueue(size) {
        const startQueueDisabled = new MessageButton()
            .setCustomId('startQueue')
            .setLabel('Searching')
            .setStyle('PRIMARY')
            .setDisabled(true)
        startQueueDisabled.setEmoji('<a:Loading:890250872448229436>')
        const leaveQueue = new MessageButton()
            .setCustomId('leaveQueue')
            .setLabel('Leave Queue')
            .setStyle('DANGER')
        const startQueueEmbed = new MessageEmbed()
            .setAuthor('QUE Bot', `${THUMBNAIL}`)
            .setColor('GREEN')
            .setDescription(`*\`${size} Players in queue\`*`)
            .addField('<a:g_loading:890250524056764417>', `\`Waiting for more players to join\``)
            .setThumbnail(`${THUMBNAIL}`)
        const rowDisabled = new MessageActionRow().addComponents(startQueueDisabled, leaveQueue)

        return {
            embeds: [startQueueEmbed],
            components: [rowDisabled],
        }
    }

    // components generated for checkin button to be sent
    static getCheckInRow(url) {
        const checkInEmbed = new MessageEmbed().setAuthor('Que Bot', `${THUMBNAIL}`)
            .setColor('WHITE')
        const checkInButton = new MessageButton().setStyle('LINK')
            .setLabel('Check-In')
            .setURL(`${url}`)
        const checkInRow = new MessageActionRow().addComponents(checkInButton)

        return {
            checkInRow,
            checkInEmbed,
        }
    }

    // Componenet for join game link to redirect user to the channe created
    static getJoinGame(url) {
        const joinGameButton = new MessageButton().setLabel('Join-Game')
            .setStyle('LINK')
            .setURL(`${url}`)
        const joinGameRow = new MessageActionRow().addComponents(joinGameButton)
        const joinGameEmbed = new MessageEmbed()
            .setAuthor('QUE Bot', `${THUMBNAIL}`)
            .setColor('WHITE')
            .setDescription(' Now, You can join the game by clicking on the button below. ')
            .setThumbnail(`${THUMBNAIL}`)
            .setImage(MATCH_FOUND_IMAGE)

        return {
            joinGameRow,
            joinGameEmbed,
        }
    }

    // Components generated for team selection
    static genSelectionBoard(cap1, cap2, team1, team2, remainingPlayers, playerTurn) {
        const usersBatch = _.chunk(remainingPlayers, 5)
            .map((batch) => new MessageActionRow().addComponents(batch.map((user) => user.button)))
        const playerSelectionEmbed = new MessageEmbed().setThumbnail(THUMBNAIL)
            .setColor('WHITE')
            .setDescription(`Captains mentioned below, now select your players one by one. 
            NOTE: No need to react sequentially, but just maintain the ethics and react only when its your turn 
            Its your turn : ${playerTurn ? playerTurn.mention : ''} `)
            .setAuthor('Que Bot', THUMBNAIL)
            .addField('Team A', `${cap1.mention} 🌟 \n ${team1.map((user) => user.mention).join('\n')}`, true)
            .addField('Team B', `${cap2.mention} 🌟 \n ${team2.map((user) => user.mention).join('\n')}`, true)
        if (remainingPlayers.length) {
            playerSelectionEmbed.addField('Available Players ✅', ` ${remainingPlayers.map((user) => user.mention).toString()}`, false)
        }

        return {
            embeds: [playerSelectionEmbed],
            components: usersBatch,
        }
    }

    // Components generated for map selection embeds
    static genMapBoard(availableMaps, playerTurn, i, cap1, cap2) {
        // TODO : If availableMps.length = 2 -> change embed and button color and text to 'pick' from 'ban'
        let buttonColor = 'DANGER'
        let image = SELECT_MAP

        const turn = `Its your turn : ${playerTurn ? playerTurn.mention : ''}`
        let description = `Ban maps one by one by clicking on buttons below. ${turn} `
        if (availableMaps[0] === 'Attacker') {
            description = `Now, choose the side ${turn}`
            image = SELECT_SIDE
        }
        if (availableMaps.length === 2 && availableMaps[0] !== 'Attacker') {
            description = ` Now PICK one to choose the final map. ${turn}`
            buttonColor = 'SUCCESS'
        }

        if (!availableMaps.length) {
            if (i.customId === 'Attacker') {
                if (i.user.id === cap1.id) {
                    description = ` **Team A  have choosen Attacker side**`
                    image = ATTACKER
                }
                if (i.user.id === cap2) {
                    description = ` **Team B have choosen Attacker side**`
                    image = ATTACKER
                }
            }
            if (i.customId === 'Defender') {
                if (i.user.id === cap1.id) {
                    description = ` **Team A  have choosen Defender side**`
                    image = DEFENDER
                }
                if (i.user.id === cap2) {
                    description = ` **Team B have choosen Defender side**`
                    image = DEFENDER
                }
            }
        }
        const embed = new MessageEmbed()
            .setAuthor('QUE Bot', `${THUMBNAIL}`)
            .setDescription(`${description} `)
            .setThumbnail(`${THUMBNAIL}`)
            .setColor('WHITE')
            .setImage(`${image}`)

        const mapsButton = availableMaps.map((map) => new MessageButton().setCustomId(map).setLabel(map).setStyle(buttonColor))
        const mapBatch = _.chunk(mapsButton, 3).map((batch) => new MessageActionRow().addComponents(batch))

        return {
            embeds: [embed],
            components: mapBatch,
        }
    }

    // Components generated to show the selectd map embed
    static mapComponents(availableMaps, selectedMap) {
        const selectedMapImage = process.env[selectedMap.toUpperCase()]
        const selectedMapComponents = new MessageEmbed()
            .setAuthor('QUE Bot', `${THUMBNAIL}`)
            .setDescription(`**You have selected ${selectedMap} for this match.**`)
            .setThumbnail(`${THUMBNAIL}`)
            .setColor('WHITE')
            .setImage(`${selectedMapImage}`)

        return {
            embeds: [selectedMapComponents],
        }
    }

    // Components generated to send end game embed
    static endGameComponents() {
        const endGameComponents = new MessageEmbed()
            .setAuthor('QUE Bot', `${THUMBNAIL}`)
            .setDescription(`**Don't click this now ! Press the button below once you ends with your game**`)
            .setThumbnail(`${THUMBNAIL}`)
            .setColor('RED')
        const endGameButton = new MessageButton().setCustomId('End Game').setLabel('End Game').setStyle('DANGER')
        const endGameActionRow = new MessageActionRow().addComponents(endGameButton)

        return {
            embeds: [endGameComponents],
            components: [endGameActionRow],
        }
    }
}

module.exports = Components
