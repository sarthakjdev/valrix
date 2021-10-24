
class Team {
    constructor(data) {
        this.uuid = data.uuid
        this.name = data.name
        this.rating = data.rating
        this.players = []
    }

    get owner() {
        return this.players.find((p) => p.status === 'owner')
    }

    addPlayers(players) {
        if (Array.isArray(players)) this.players.push(...players)
        else this.players.push(players)
    }
}

module.exports = Team
