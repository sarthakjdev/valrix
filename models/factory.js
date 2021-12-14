const knex = require('../util/knex')
const Team = require('./team')
const Player = require('./player')
const Match = require('./match')

const TEAM_TABLE = 'public.teams'
const PLAYER_TABLE = 'public.players'
const MATCH_TABLE = 'public.match_history'

const PLAYER_STATUS = {
    owner: 'OWNER',
    player: 'PLAYER',
    sub: 'SUB',
}

class Factory {
    constructor(client) {
        this.client = client
    }

    /**
     * Create team
     * @param {string} name
     * @param {Object} owner
     * @param {Player} player
     * @return {Promise<Team>}
     */
    async createTeam(name, owner, player) {
        const [dbTeam] = await knex(TEAM_TABLE).insert({ name }).returning('*')
        const team = new Team(dbTeam)
        let teamOwner
        if (player) teamOwner = await this.updateOwnerTeam(player.id, team)
        else teamOwner = await this.createPlayer(owner.id, owner.valorantId, owner.valorantName, owner.valorantTag, PLAYER_STATUS.owner, team)
        team.addPlayers(teamOwner)

        return team
    }

    /**
     * Delete team
     * @param {Team} team
     * @return {Promise<void>}
     */
    async deleteTeam(team) {
        await knex(TEAM_TABLE).where({ uuid: team.uuid }).del()
        const { playerIds } = team
        await knex(PLAYER_TABLE).update({ team: null }).whereIn('id', playerIds)
    }

    /**
     * Create Valorant player
     * @param {string} id
     * @param {string} valorantId
     * @param {string} valorantName
     * @param {string} valorantTag
     * @param {PLAYER_STATUS} [status]
     * @param {Team} [team]
     * @return {Promise<Player>}
     */
    async createPlayer(id, valorantId, valorantName, valorantTag, status, team) {
        const [dbPlayer] = await knex(PLAYER_TABLE)
            .insert({
                id, valorantId, valorantName, valorantTag, status, team: team?.uuid,
            }).returning('*')

        dbPlayer.team = team

        return new Player(dbPlayer)
    }

    /**
     * Update owner's team
     * @param {String} ownerId
     * @param {Team} team
     * @return {Promise<Player>}
     */
    async updateOwnerTeam(ownerId, team) {
        const [dbPlayer] = await knex(PLAYER_TABLE)
            .update({ team: team.uuid, status: PLAYER_STATUS.owner })
            .where({ id: ownerId })
            .returning('*')
        dbPlayer.team = team

        return new Player(dbPlayer)
    }

    /**
     * Update player's team
     * @param {string} playerId
     * @param {Team} team
     * @param {string} playerType
     * @return {Promise<Player>}
     */
    async updatePlayerTeam(playerId, team, playerType) {
        const [dbPlayer] = await knex(PLAYER_TABLE)
            .update({ team: team.uuid, status: playerType })
            .where({ id: playerId })
            .returning('*')
        dbPlayer.team = team

        return new Player(dbPlayer)
    }

    /**
     * Update player's stats
     * @param {string} playerId
     * @param {number} kills
     * @param {number} deaths
     * @param {number} assists
     * @param {number} averageCombatScore
     * @returns {Promise<Player>}
     */
    async updatePlayerStats(playerId, kills, deaths, assists, averageCombatScore) {
        const [dbPlayer] = await knex(PLAYER_TABLE)
            .update({
                kills, deaths, assists, average_combat_score: averageCombatScore,
            })
            .where({ id: playerId })
            .returning('*')

        return new Player(dbPlayer)
    }

    /**
     * Remove player from team
     * @param {string} playerId
     * @param {Team} team
     */
    async removePlayer(playerId, team) {
        const [dbPlayer] = await knex(PLAYER_TABLE)
            .where({ id: playerId })
            .update({ team: null, status: 'REGISTERED' })
            .returning('*')
        team.removePlayer(playerId)
        dbPlayer.team = team

        return new Player(dbPlayer)
    }

    /**
     * Get all registerd teams
     * @return {Promise<any[]>}
     */
    async getRegisteredTeams() {
        const dbTeams = await knex(TEAM_TABLE).select('*')

        let teams = dbTeams.map((dbTeam) => new Team(dbTeam))

        teams = await Promise.all(teams.map(async (team) => {
            const players = await this.getTeamPlayers(team)
            team.addPlayers(players)

            return team
        }))

        return teams
    }

    // returning all teams owners
    async getOwners() {
        return knex(PLAYER_TABLE).where({ status: 'OWNER' }).select('*')
    }

    /**
     * Get team by team uuid
     * @param {string} uuid
     * @return {Promise<undefined|Team>}
     */
    async getTeamByUuid(uuid) {
        const [dbTeam] = await knex(TEAM_TABLE).where({ uuid })
        if (!dbTeam) return undefined
        const team = new Team(dbTeam)
        const players = await this.getTeamPlayers(team)
        team.addPlayers(players)

        return team
    }

    /**
     * Get team by team name
     * @param {string} name
     * @return {Promise<undefined|Team>}
     */
    async getTeamByName(name) {
        const [dbTeam] = await knex(TEAM_TABLE).where({ name })
        if (!dbTeam) return undefined
        const team = new Team(dbTeam)
        const players = await this.getTeamPlayers(team)
        team.addPlayers(players)

        return team
    }

    /**
     * Get player by discord userId
     * @param {string} id
     * @return {Promise<Player|undefined>}
     */
    async getPlayerById(id) {
        const [dbPlayer] = await knex(PLAYER_TABLE).where({ id })
        if (!dbPlayer) return undefined
        const player = new Player(dbPlayer)
        if (dbPlayer.team) player.team = await this.getTeamByUuid(dbPlayer.team)

        return player
    }

    /**
     * Get player by valorant Id
     * @param id
     * @return {Promise<Player|undefined>}
     */
    async getPlayerByValorantId(id) {
        const [dbPlayer] = await knex(PLAYER_TABLE).where({ valorantId: id })
        if (!dbPlayer) return undefined
        const player = new Player(dbPlayer)
        if (dbPlayer.team) player.team = await this.getTeamByUuid(dbPlayer.team)

        return player
    }

    /**
     * Update team's rating
     * @param {Team} teamToUpdate
     * @param {number} rating
     * @return {Promise<undefined|Team>}
     */
    async updateTeamRating(teamToUpdate, rating) {
        const [dbTeam] = await knex(TEAM_TABLE).where({ uuid: teamToUpdate.uuid }).update({ rating }).returning('*')
        if (!dbTeam) return undefined
        const team = new Team(dbTeam)
        const players = await this.getTeamPlayers(team)
        team.addPlayers(players)

        return team
    }

    /**
     * Get players of single team
     * @param {Team} team
     * @return {Promise<*>}
     */
    async getTeamPlayers(team) {
        const players = await knex(PLAYER_TABLE).where({ team: team.uuid })

        return players.map((p) => ({ ...p, team })).map((p) => new Player(p))
    }

    /**
     * Get all rated teams in descending order of their rating:
     * @return {Promise<any[]>}
     */
    async getLeaderboard() {
        const dbTeams = await knex(TEAM_TABLE)
            .select('*')
            .orderBy('rating', 'desc')

        let teams = dbTeams.map((dbTeam) => new Team(dbTeam))

        teams = await Promise.all(teams.map(async (team) => {
            const players = await this.getTeamPlayers(team)
            team.addPlayers(players)

            return team
        }))

        return teams
    }

    /**
     * Create match in the db after
     * @param {string} uuid
     * @param {string} map
     * @param {string} winningTeam
     * @param {string} losigTeam
     * @param {string} totalRounds
     * @param {string} eloDiff
     * @param {string} score
     * @returns {Promise<Match>}
     */
    async createMatch(uuid, teams, map, winningTeam, losingTeam, totalRounds, score, eloDiff) {
        const [dbMatch] = await knex(MATCH_TABLE)
            .insert({
                uuid, teams, map, winningTeam, losingTeam, totalRounds, score, eloDiff,
            })
            .returning('*')
        const match = new Match(dbMatch)

        return match
    }

    /**
     *  Get match by uuid
     * @param {string} uuid
     * @returns {Promise<Match>}
     */
    async getMatch(uuid) {
        const [dbMatch] = await knex(MATCH_TABLE)
            .select({ uuid })

        const match = new Match(dbMatch)

        return match
    }

    /**
     * Get match history
     * @param {string} teamUUID
     * @returns {Promise<any[]>}
     */
    async getMatchHistory(teamUUID) {
        const matchHistory = await knex(MATCH_TABLE)
            .select('*')
            .where({ losingTeam: teamUUID })
            .orWhere({ winningTeam: teamUUID })

        const matches = matchHistory.map((m) => new Match(m))

        return matches
    }
}

module.exports = Factory
