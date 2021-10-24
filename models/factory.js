const knex = require('../util/knex')
const Team = require('./team')
const Player = require('./player')

const TEAM_TABLE = 'public.teams'
const PLAYER_TABLE = 'public.players'
const PLAYER_STATUS = {
    owner: 'OWNER',
    player: 'PLAYER',
    sub: 'SUB',
}

class Factory {
    constructor(client) {
        this.client = client
    }

    async createTeam(name, owner) {
        const [dbTeam] = await knex(TEAM_TABLE).insert({ name }).returning('*')
        const team = new Team(dbTeam)
        let player
        if (owner.player) player = await this.updateOwner(owner.id, team)
        else player = this.createPlayer(owner.id, owner.ign, team)
        team.addPlayers(player)

        return team
    }

    async createPlayer(id, ign, team) {
        const [dbPlayer] = await knex(PLAYER_TABLE).insert({ id, ign, team: team.uuid }).returning('*')
        dbPlayer.team = team
        const player = new Player(dbPlayer)
        await player.fetchValorantId()

        return player
    }

    async updateOwner(ownerId, team) {
        const [dbPlayer] = await knex(PLAYER_TABLE)
            .update({ team: team.uuid, status: PLAYER_STATUS.owner })
            .where({ id: ownerId })
            .returning('*')
        dbPlayer.team = team

        return new Player(dbPlayer)
    }

    async getTeamByUuid(uuid) {
        const [dbTeam] = await knex(TEAM_TABLE).where({ uuid })
        if (!dbTeam) return undefined
        const team = new Team(dbTeam)
        const players = await this.getTeamPlayers(team)
        team.addPlayers(players)

        return team
    }

    async getTeamByName(name) {
        const [dbTeam] = await knex(TEAM_TABLE).where({ name })
        if (!dbTeam) return undefined
        const team = new Team(dbTeam)
        const players = await this.getTeamPlayers(team)
        team.addPlayers(players)

        return team
    }

    async getPlayerById(id) {
        const [dbPlayer] = await knex(PLAYER_TABLE).where({ id })
        if (!dbPlayer) return undefined
        const player = new Player(dbPlayer)
        if (dbPlayer.team) player.team = await this.getTeamByUuid(dbPlayer.team)

        return player
    }

    async getTeamPlayers(team) {
        const players = await knex(PLAYER_TABLE).where({ team: team.uuid })

        return players.map((p) => ({ ...p, team }))
    }
}

module.exports = Factory
