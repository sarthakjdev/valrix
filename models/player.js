const { Permissions } = require('discord.js')

class Player {
    constructor(data) {
        this.id = data.id
        this.tag = data.valorantTag
        this.name = data.valorantName
        this.valorantId = data.valorantId
        this.team = data.team
        this.status = data.status
        this.kills = data.kills
        this.assists = data.assists
        this.deaths = data.deaths
        this.averageCombatScore = data.averageCombatScore
        this.noOfMatches = data.noOfMatches
    }

    get ign() {
        return `${this.name}#${this.tag}`
    }

    get permissions() {
        return {
            id: this.id,
            allow: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.CONNECT, Permissions.FLAGS.VIEW_CHANNEL],
            deny: [Permissions.FLAGS.ADD_REACTIONS],
        }
    }

    get readOnlyPermission() {
        return {
            id: this.id,
            deny: [Permissions.FLAGS.SEND_MESSAGES],
        }
    }

    get voiceDenyPermission() {
        return {
            id: this.id,
            deny: [Permissions.FLAGS.CONNECT],
        }
    }

    get mention() {
        return `<@${this.id}>`
    }

    get voiceAllowPermission() {
        return {
            id: this.id,
            allow: [Permissions.FLAGS.CONNECT],
        }
    }

    get viewChannelPermission() {
        return {
            id: this.id,
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
        }
    }
}

module.exports = Player
