const knex = require('../util/knex')

const TEAM_TABLE = 'public.teams'
const PLAYER_TABLE = 'public.players'
const PLAYER_STATUS = {
    owner: 'OWNER',
    player: 'PLAYER',
    sub: 'SUB',
}

class Player {
    constructor(data) {
        this.id = data.id
        this.ign = data.ign
        this.valorantId = data.valorantId
        this.status = data.status
        this.team = data.team
    }

    async fetchValorantId() {
        // Fetch user data from Valorant API
    }
}

module.exports = Player
