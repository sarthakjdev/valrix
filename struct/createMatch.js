const { Permissions, MessageButton } = require('discord.js')
const pWaitFor = require('../util/pwaitfor')
const Components = require('./components')

const CATEGORY_NAME = 'Valorant'
const CHAT_CHANNEL_NAME = 'Chat Here'
const GAME_SETTINGS_CHANNEL_NAME = 'Game Settings'
const VOICE_CHANNEL_NAME = 'Check-In'
const TEAM1_VOICE_CHANNEL_NAME = 'Team A'
const TEAM2_VOICE_CHANNEL_NAME = 'Team B'

const createMatch = async (playerButtons) => {
    const users = playerButtons.map((bi) => ({
        id: bi.user.id,
        tag: bi.user.tag,
        mention: `<@${bi.user.id}>`,
        permissions: {
            id: bi.user.id,
            allow: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.CONNECT, Permissions.FLAGS.VIEW_CHANNEL],
            deny: [Permissions.FLAGS.ADD_REACTIONS],
        },
        readOnlyPermission: {
            id: bi.user.id,
            deny: [Permissions.FLAGS.SEND_MESSAGES],
        },
        voiceDenyPermission: {
            id: bi.user.id,
            deny: [Permissions.FLAGS.CONNECT],
        },
        button: new MessageButton().setCustomId(bi.user.id)
            .setLabel(bi.user.tag)
            .setStyle('SECONDARY'),
    }))

    const { channels, members } = playerButtons.first().guild

    // Create category channel
    const category = await channels.create(CATEGORY_NAME, {
        type: 'GUILD_CATEGORY',
        permissionOverwrites: [{
            id: channels.guild.id,
            deny: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.CONNECT, Permissions.FLAGS.VIEW_CHANNEL],
        }, ...users.map((user) => user.permissions)],
    })

    // Create chat channel
    await channels.create(CHAT_CHANNEL_NAME, { type: 'GUILD_TEXT', parent: category })

    // Create game settings channel and create invite link
    const gameSettingsChannel = await channels.create(GAME_SETTINGS_CHANNEL_NAME, {
        type: 'GUILD_TEXT',
        permissionOverwrites: users.map((user) => user.readOnlyPermission),
        parent: category,
    })
    const gameSettingsInvite = await gameSettingsChannel.createInvite()

    // Create voice channel and invite
    const checkIn = await channels.create(VOICE_CHANNEL_NAME, {
        type: 'GUILD_VOICE',
        userLimit: playerButtons.size,
        parent: category,
    })
    const checkInInvite = await checkIn.createInvite()

    const { joinGameEmbed, joinGameRow } = Components.getJoinGame(gameSettingsInvite.url)
    const { checkInEmbed, checkInRow } = Components.getCheckInRow(checkInInvite.url)

    await Promise.all(playerButtons.map(async (pb) => pb.editReply({ embeds: [joinGameEmbed], components: [joinGameRow] })))

    await gameSettingsChannel.send({
        content: ` ${users.map((u) => u.mention).toString()}  \n Check-in to continue the process.`,
        embeds: [checkInEmbed],
        components: [checkInRow],
    })

    await pWaitFor(() => checkIn.full)

    const team1 = []
    const team2 = []
    // eslint-disable-next-line prefer-const
    let [cap1, cap2, ...remainingPlayers] = users
    let turn = cap1
    const selectionBoardMessage = Components.genSelectionBoard(cap1, cap2, team1, team2, remainingPlayers, turn)
    const gameSettingsMsg = await gameSettingsChannel.send(selectionBoardMessage)

    const teamSelectionCollector = gameSettingsMsg.createMessageComponentCollector({ componentType: 'BUTTON' })
    teamSelectionCollector.on('collect', async (buttonInteraction) => {
        if (buttonInteraction.user.id !== turn.id) {
            return buttonInteraction.reply({ content: `You're not allowed to click button`, ephemeral: true })
        } if (turn.id === cap1.id) {
            const selectedPlayer = remainingPlayers.find((player) => player.id === buttonInteraction.customId)
            team1.push(selectedPlayer)
            turn = cap2
            await buttonInteraction.reply({ content: `You have selected ${selectedPlayer.mention}`, ephemeral: true })
        } else {
            const selectedPlayer = remainingPlayers.find((player) => player.id === buttonInteraction.customId)
            team2.push(selectedPlayer)
            turn = cap1
            await buttonInteraction.reply({ content: `You have selected ${selectedPlayer.mention}`, ephemeral: true })
        }
        remainingPlayers = remainingPlayers.filter((player) => player.id !== buttonInteraction.customId)
        const updatedGameSettingMsg = Components.genSelectionBoard(cap1, cap2, team1, team2, remainingPlayers)
        if (!remainingPlayers.length) teamSelectionCollector.stop()

        return gameSettingsMsg.edit(updatedGameSettingMsg)
    })

    await pWaitFor(() => !remainingPlayers.length)

    team1.push(cap1)
    team2.push(cap2)
    const team1VoiceChannel = await channels.create(TEAM1_VOICE_CHANNEL_NAME, {
        type: 'GUILD_VOICE',
        userLimit: team1.length,
        parent: category,
        permissionOverwrites: team2.map((player) => player.voiceDenyPermission),
    })
    const team2VoiceChannel = await channels.create(TEAM2_VOICE_CHANNEL_NAME, {
        type: 'GUILD_VOICE',
        userLimit: team2.length,
        parent: category,
        permissionOverwrites: team1.map((player) => player.voiceDenyPermission),
    })

    const team1Members = team1.map((player) => members.cache.get(player.id))
    const team2Members = team2.map((player) => members.cache.get(player.id))

    await Promise.all(team1Members.map(async (player) => {
        if (player.voice) await player.voice.setChannel(team1VoiceChannel)
    }))

    await Promise.all(team2Members.map(async (player) => {
        if (player.voice) await player.voice.setChannel(team2VoiceChannel)
    }))

    await checkIn.delete()

    let maps = ['Bind', 'Heaven', 'Split', 'Ascent', 'Icebox', 'Breeze']
    let selectedMap
    let attacker
    let defender

    const mapSelectionMsgComponents = Components.genMapBoard(maps, turn)
    const mapSelectionMsg = await gameSettingsChannel.send(mapSelectionMsgComponents)

    const mapSelectionCollector = mapSelectionMsg.createMessageComponentCollector({ componentType: 'BUTTON' })
    mapSelectionCollector.on('collect', async (buttonInteraction) => {
        let actiontaken = 'banned'
        if (maps.length === 2) actiontaken = 'Selected'
        if (maps.length === 2 && maps.includes(buttonInteraction.customId)) {
            const selectedMapComponents = Components.mapComponents(maps, buttonInteraction.customId)
            await gameSettingsChannel.send(selectedMapComponents)
        }
        if (maps.length === 1 && ['Attacker', 'Defender'].includes(buttonInteraction.customId)) actiontaken = 'Selected'
        if (buttonInteraction.user.id !== turn.id) {
            return buttonInteraction.reply({ content: `You're not allowed to click button`, ephemeral: true })
        }
        if (turn.id === cap1.id) {
            if (buttonInteraction.customId === 'Attacker') {
                attacker = cap1
                defender = cap2
            }
            turn = cap2
            await buttonInteraction.reply({ content: `You have ${actiontaken} ${buttonInteraction.customId}`, ephemeral: true })
        } else {
            if (buttonInteraction.customId === 'Attacker') {
                attacker = cap2
                defender = cap1
            }
            turn = cap1
            await buttonInteraction.reply({ content: `You have ${actiontaken} ${buttonInteraction.customId}`, ephemeral: true })
        }
        maps = maps.filter((map) => map !== buttonInteraction.customId)
        let updatedGameSettingMsg = Components.genMapBoard(maps, turn)
        if (!maps.length) mapSelectionCollector.stop()
        if (maps.length === 1) {
            selectedMap = buttonInteraction.customId
            updatedGameSettingMsg = Components.genMapBoard(['Attacker', 'Defender'], turn)
        }
        if (maps.length === 1 && ['Attacker', 'Defender'].includes(buttonInteraction.customId)) {
            updatedGameSettingMsg = Components.genMapBoard([], null, buttonInteraction.customId)
        }

        return mapSelectionMsg.edit(updatedGameSettingMsg)
    })

    await pWaitFor(() => maps.length === 1)

    const endGameComponents = Components.endGameComponents()
    const endGameMsg = await gameSettingsChannel.send(endGameComponents)

    const endGameFilter = (buttonInteraction) => buttonInteraction.customId === 'End Game'
    const endGameCollector = endGameMsg.createMessageComponentCollector({ componentType: 'BUTTON', max: 1, filter: endGameFilter })
    endGameCollector.on('collect', async (buttonInteraction) => {
        if (buttonInteraction.user.id === cap1.id || buttonInteraction.user.id === cap2.id) {
            await gameSettingsChannel.delete()
            await team1VoiceChannel.delete()
            await team2VoiceChannel.delete()
            await category.delete()
        } else {
            return buttonInteraction.reply({ content: `You're not allowed to click button`, ephemeral: true })
        }
    })
}

module.exports = createMatch
