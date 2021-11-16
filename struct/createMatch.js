const { Permissions } = require('discord.js')
const Components = require('./components')
const pWaitFor = require('../util/pWaitFor')

const CHAT_CHANNEL_NAME = 'Chat Here'
const GAME_SETTINGS_CHANNEL_NAME = 'Game Settings'
const VOICE_CHANNEL_NAME = 'Check-In'

const createMatch = async (interactions) => {
    const owners = await Promise.all(interactions.map(async (i) => i.client.factory.getPlayerById(i.user.id)))

    const teamOwner1 = owners[0]
    const teamOwner2 = owners[1]
    const players = [...teamOwner1.team.players, ...teamOwner2.team.players]

    await Promise.all(players.map((p) => interactions.first().client.users.fetch(p.id)))

    const { channels, members } = interactions.first().guild

    const categoryName = `${teamOwner1.team.name} vs ${teamOwner2.team.name}`

    // Create category channel
    const category = await channels.create(categoryName, {
        type: 'GUILD_CATEGORY',
        permissionOverwrites: [{
            id: channels.guild.id,
            deny: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.CONNECT, Permissions.FLAGS.VIEW_CHANNEL],
        },
        ...players.map((p) => p.permissions)],
    })

    await channels.create(CHAT_CHANNEL_NAME, { type: 'GUILD_TEXT', parent: category })

    // Create game settings channel and create invite link
    const gameSettingsChannel = await channels.create(GAME_SETTINGS_CHANNEL_NAME, {
        type: 'GUILD_TEXT',
        permissionOverwrites: [{
            id: channels.guild.id,
            deny: [Permissions.FLAGS.VIEW_CHANNEL],
        },
        ...players.map((p) => p.viewChannelPermission)],
        parent: category,
    })
    const gameSettingsInvite = await gameSettingsChannel.createInvite()

    // Create voice channel and invite
    const checkIn = await channels.create(VOICE_CHANNEL_NAME, {
        type: 'GUILD_VOICE',
        userLimit: 10,
        parent: category,
    })
    const checkInInvite = await checkIn.createInvite()

    const { joinGameEmbed, joinGameRow } = Components.getJoinGame(gameSettingsInvite.url)
    const { checkInEmbed, checkInRow } = Components.getCheckInRow(checkInInvite.url)

    await Promise.all(interactions.map(async (pb) => pb.editReply({ embeds: [joinGameEmbed], components: [joinGameRow] })))

    await gameSettingsChannel.send({
        content: ` ${players.map((u) => u.mention).toString()}  \n Check-in to continue the process.`,
        embeds: [checkInEmbed],
        components: [checkInRow],
    })

    await pWaitFor(() => checkIn.full)

    const team1VoiceChannel = await channels.create(teamOwner1.team.name, {
        type: 'GUILD_VOICE',
        userLimit: teamOwner1.team.players.length,
        parent: category,
        permissionOverwrites: [{
            id: channels.guild.id,
            deny: [Permissions.FLAGS.VIEW_CHANNEL],
        }, ...teamOwner1.team.players.map((user) => user.voiceAllowPermission)],
    })

    const team2VoiceChannel = await channels.create(teamOwner2.team.name, {
        type: 'GUILD_VOICE',
        userLimit: teamOwner1.team.players.length,
        parent: category,
        permissionOverwrites: [{
            id: channels.guild.id,
            deny: [Permissions.FLAGS.VIEW_CHANNEL],
        }, ...teamOwner2.team.players.map((user) => user.voiceAllowPermission)],
    })

    const team1Members = teamOwner1.team.players.map((player) => members.cache.get(player.id))
    const team2Members = teamOwner2.team.players.map((player) => members.cache.get(player.id))

    await Promise.all(team1Members.map(async (player) => {
        if (player.voice) await player.voice.setChannel(team1VoiceChannel)
    }))

    await Promise.all(team2Members.map(async (player) => {
        if (player.voice) await player.voice.setChannel(team2VoiceChannel)
    }))

    await checkIn.delete()

    let turn = members.cache.get(teamOwner1.id)

    let maps = ['Bind', 'Haven', 'Split', 'Ascent', 'Icebox', 'Breeze', 'Fracture']

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
        if (turn.id === teamOwner1.id) {
            turn = teamOwner2.id
            await buttonInteraction.reply({ content: `You have ${actiontaken} ${buttonInteraction.customId}`, ephemeral: true })
        } else {
            turn = teamOwner1.id
            await buttonInteraction.reply({ content: `You have ${actiontaken} ${buttonInteraction.customId}`, ephemeral: true })
        }
        maps = maps.filter((map) => map !== buttonInteraction.customId)
        let updatedGameSettingMsg = Components.genMapBoard(maps, turn)
        if (!maps.length) mapSelectionCollector.stop()
        if (maps.length === 1) {
            updatedGameSettingMsg = Components.genMapBoard(['Attacker', 'Defender'], turn)
        }
        if (maps.length === 1 && ['Attacker', 'Defender'].includes(buttonInteraction.customId)) {
            updatedGameSettingMsg = Components.genMapBoard([], null, buttonInteraction, teamOwner1, teamOwner2)
        }

        return mapSelectionMsg.edit(updatedGameSettingMsg)
    })
}

module.exports = createMatch
