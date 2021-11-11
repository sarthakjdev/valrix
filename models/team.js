
class Team {
    constructor(data) {
        this.uuid = data.uuid
        this.name = data.name
        this.rating = data.rating
        this._players = []
    }

    get owner() {
        return this._players.find((p) => p.status === 'OWNER')
    }

    get players() {
        return this._players.filter((p) => p.status !== 'SUB')
    }

    get sub() {
        return this._players.filter((p) => p.stat === 'SUB')
    }

    has(playerId) {
        return !!this._players.find((p) => p.id === playerId)
    }

    get playerIds() {
        return this._players.map((p) => p.id)
    }

    get ownerId() {
        return this.owner?.id
    }

    get qualified() {
        return this.players.length > 4 && this.rating !== 0
    }

    removePlayer(playerId) {
        this._players = this._players.filter((p) => p.id !== playerId)
    }

    addPlayers(players) {
        if (Array.isArray(players)) this._players.push(...players)
        else this._players.push(players)
    }
}

module.exports = Team
