
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

    addPlayers(players) {
        if (Array.isArray(players)) this._players.push(...players)
        else this._players.push(players)
    }
}

module.exports = Team
