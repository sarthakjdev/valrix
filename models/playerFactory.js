const knex = require('../util/knex')

const PLAYER_TABLE = 'public.players'
const TEAM_TABLE = 'public.teams'

class PlayerFactory {
    static async getPlayerById(id) {
        const [player] = await knex(PLAYER_TABLE).select('*').where({ id })
        if (!player) return undefined;
        [player.team] = await knex(TEAM_TABLE).select('*').where({ uuid: player.team })

        return player
    }

    static async createPlayer(player) {
        const data = {
            id: player.id,
            team: player.team.uuid,
            ign: player.ign,
            valorantId: player.valorantId,
            status: player.status,
        }
        const [createdPlayer] = await knex(PLAYER_TABLE).insert(data).returning('*')

        return createdPlayer
    }
}

module.exports = PlayerFactory
