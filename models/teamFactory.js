const knex = require('../util/knex')

const TEAM_TABLE = 'public.teams'
const PLAYER_TABLE = 'public.players'
const PLAYER_STATUS = {
    owner: 'OWNER',
    player: 'PLAYER',
    sub: 'SUB',
}

class TeamFactory {
    static async createTeam(name, owner) {
        const [team] = await knex(TEAM_TABLE).insert({ name }).returning('*')
        if (owner) team.owner = await knex(PLAYER_TABLE).update({ team: team.uuid, status: 'owner' }).where({ id: owner.id }).returning('*')
        else {
            team.owner = await knex(PLAYER_TABLE).insert({
                id: owner.id, ign: owner.ign, team: team.uuid, status: 'owner',
            })
        }

        return team
    }

    static async getTeamByUuid(uuid) {
        const [team] = await knex(TEAM_TABLE).select('*').where({ uuid })
        if (!team) return undefined
        const players = await knex(PLAYER_TABLE).select('*').where({ team: uuid })

        return team
    }

    static async getTeamByName(name) {
        const [team] = await knex(TEAM_TABLE).select('*').where({ name })
        if (!team) return undefined
        team.owner = await knex(PLAYER_TABLE).where({ team: team.uuid, status: 'owner' })

        return team
    }
}

module.exports = TeamFactory
